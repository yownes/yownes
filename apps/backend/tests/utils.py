import json
from uuid import UUID

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from graphql_auth.models import UserStatus

from backend.stores.models import StoreApp

DEFAULT_GRAPHQL_URL = "/graphql"

UserModel = get_user_model()


def create_store(user=None):
    return StoreApp.objects.create(name="AppName", customer=user)


def get_normal_user(idx=""):
    username = f"normal_user{idx}"
    user = UserModel.objects.create(
        username=username,
        first_name="Normal",
        last_name="Normal",
        email=f"normal{idx}@normal.com",
    )
    user.set_password("normal_pass")
    user.save()
    user_status = UserStatus.objects.get(user=user)
    user_status.verified = True
    user_status.save()
    return username, "normal_pass", user


def get_admin_user(idx=""):
    username = f"admin_user{idx}"
    user = UserModel.objects.create(
        username=username,
        is_staff=True,
        first_name="Admin",
        last_name="Admin",
        email=f"admin{idx}@admin.com",
    )
    user.set_password("admin_pass")
    user.save()
    user_status = UserStatus.objects.get(user=user)
    user_status.verified = True
    user_status.save()
    return username, "admin_pass", user


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)


def graphql_query(
    query,
    op_name=None,
    input_data=None,
    variables=None,
    headers=None,
    client=None,
    graphql_url=None,
):
    """
    Args:
        query (string)              - GraphQL query to run
        op_name (string)            - If the query is a mutation or named query, you must
                                      supply the op_name.  For annon queries ("{ ... }"),
                                      should be None (default).
        input_data (dict)           - If provided, the $input variable in GraphQL will be set
                                      to this value. If both ``input_data`` and ``variables``,
                                      are provided, the ``input`` field in the ``variables``
                                      dict will be overwritten with this value.
        variables (dict)            - If provided, the "variables" field in GraphQL will be
                                      set to this value.
        headers (dict)              - If provided, the headers in POST request to GRAPHQL_URL
                                      will be set to this value.
        client (django.test.Client) - Test client. Defaults to django.test.Client.
        graphql_url (string)        - URL to graphql endpoint. Defaults to "/graphql".

    Returns:
        Response object from client
    """
    if client is None:
        client = Client()
    if not graphql_url:
        graphql_url = DEFAULT_GRAPHQL_URL

    body = {"query": query}
    if op_name:
        body["operationName"] = op_name
    if variables:
        body["variables"] = variables
    if input_data:
        if variables in body:
            body["variables"]["input"] = input_data
        else:
            body["variables"] = {"input": input_data}
    if headers:
        resp = client.post(
            graphql_url,
            json.dumps(body, cls=UUIDEncoder),
            content_type="application/json",
            **headers,
        )
    else:
        resp = client.post(
            graphql_url,
            json.dumps(body, cls=UUIDEncoder),
            content_type="application/json",
        )
    return resp


class GraphQLTestCase(TestCase):
    """
    Based on: https://www.sam.today/blog/testing-graphql-with-graphene-django/
    """

    # URL to graphql endpoint
    GRAPHQL_URL = DEFAULT_GRAPHQL_URL

    @classmethod
    def setUpClass(cls):
        super(GraphQLTestCase, cls).setUpClass()

        cls._client = Client()

    def _get_auth_token(self, username, password):
        mutation = (
            "mutation GetToken{\n"
            f'tokenAuth(username: "{username}", password: "{password}" )\n'
            "{ token, refreshToken, success, errors  }"
            "}"
        )
        resp = self.query(query=mutation, op_name="GetToken")
        token = (
            json.loads(resp.content)
            .get("data", {})
            .get("tokenAuth", {})
            .get("token", "")
        )
        header = {"HTTP_AUTHORIZATION": f"JWT {token}"}
        return header

    def query(
        self,
        query,
        op_name=None,
        input_data=None,
        variables=None,
        headers=None,
        username=None,
        password=None,
    ):
        """
        Args:
            query (string)    - GraphQL query to run
            op_name (string)  - If the query is a mutation or named query, you must
                                supply the op_name.  For annon queries ("{ ... }"),
                                should be None (default).
            input_data (dict) - If provided, the $input variable in GraphQL will be set
                                to this value. If both ``input_data`` and ``variables``,
                                are provided, the ``input`` field in the ``variables``
                                dict will be overwritten with this value.
            variables (dict)  - If provided, the "variables" field in GraphQL will be
                                set to this value.
            headers (dict)    - If provided, the headers in POST request to GRAPHQL_URL
                                will be set to this value.

        Returns:
            Response object from client
        """
        if username and password:
            headers = self._get_auth_token(username, password)
        return graphql_query(
            query,
            op_name=op_name,
            input_data=input_data,
            variables=variables,
            headers=headers,
            client=self._client,
            graphql_url=self.GRAPHQL_URL,
        )

    def assertResponseNoErrors(self, resp, msg=None):
        """
        Assert that the call went through correctly. 200 means the syntax is ok, if there are no `errors`,
        the call was fine.
        :resp HttpResponse: Response
        """
        self.assertEqual(resp.status_code, 200)
        content = json.loads(resp.content)
        self.assertNotIn("errors", list(content.keys()), msg)

    def assertResponseHasErrors(self, resp, error=None, msg=None):
        """
        Assert that the call was failing. Take care: Even with errors, GraphQL returns status 200!
        :resp HttpResponse: Response
        """
        content = json.loads(resp.content)
        self.assertIn("errors", list(content.keys()), msg)
        if error:
            messages = [error.get("message") for error in content.get("errors")]
            self.assertIn(error, messages)
