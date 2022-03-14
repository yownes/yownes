import base64
import json

from backend.errors import Error

from .utils import (GraphQLTestCase, create_store, get_admin_user,
                    get_normal_user)

users_query = (
    "{\n"
    "  users {\n"
    "    edges {\n"
    "        node {\n"
    "            id\n"
    "        }\n"
    "    }\n"
    "  }\n"
    "}\n"
)

build_query = (
    "{\n"
    "  builds {\n"
    "    edges {\n"
    "        node {\n"
    "            id\n"
    "        }\n"
    "    }\n"
    "  }\n"
    "}\n"
)


class TestUsersPermissions(GraphQLTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        get_normal_user()
        get_admin_user()

    def test_anon_can_not_view_users(self):
        resp = self.query(users_query)
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_store_user_can_not_view_users(self):
        resp = self.query(users_query, username="normal_user", password="normal_pass")
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_admin_can_view_users(self):
        resp = self.query(users_query, username="admin_user", password="admin_pass")
        self.assertResponseNoErrors(resp)

    def test_anon_can_not_view_user_detail(self):
        user_id = "VXNlck5vZGU6MQ=="
        user_query = "{\n" f'  user(id: "{user_id}")' "  {\n" "     id\n" "   }\n" "}\n"
        resp = self.query(user_query)
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_normal_can_not_view_user_detail(self):
        user_id = "VXNlck5vZGU6MQ=="
        user_query = "{\n" f'  user(id: "{user_id}")' "  {\n" "     id\n" "   }\n" "}\n"
        resp = self.query(user_query, username="normal_user", password="normal_pass")
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_admin_can_view_user_detail(self):
        user_id = "VXNlck5vZGU6MQ=="
        user_query = "{\n" f'  user(id: "{user_id}")' "  {\n" "     id\n" "   }\n" "}\n"
        resp = self.query(user_query, username="admin_user", password="admin_pass")
        self.assertResponseNoErrors(resp)


class TestBuildPermissions(GraphQLTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.normal_username, cls.normal_pass, _ = get_normal_user()
        cls.admin_username, cls.admin_pass, _ = get_admin_user()

    def test_anon_can_not_view_builds(self):
        resp = self.query(build_query)
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_store_user_can_not_view_builds(self):
        resp = self.query(
            build_query, username=self.normal_username, password=self.normal_pass
        )
        self.assertResponseHasErrors(
            resp, "You do not have permission to perform this action"
        )

    def test_admin_can_view_builds(self):
        resp = self.query(
            build_query, username=self.admin_username, password=self.admin_pass
        )
        self.assertResponseNoErrors(resp)


class TestStorePermissions(GraphQLTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.normal_username, cls.normal_pass, cls.user = get_normal_user()
        cls.normal1_username, cls.normal1_pass, cls.user1 = get_normal_user("1")
        cls.admin_username, cls.admin_pass, cls.admin = get_admin_user()

    def test_user_can_delete_own_store(self):
        store = create_store(self.user)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{"
            f'deleteApp(id: "{store_id}") '
            "{    ok"
            "        error"
            "    }"
            "}"
        )
        resp = self.query(
            query, username=self.normal_username, password=self.normal_pass
        )
        self.assertResponseNoErrors(resp)
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("deleteApp")
        self.assertTrue(data.get("ok", None))
        self.assertIsNone(data.get("error", "no error"))

    def test_user_cannot_delete_other_store(self):
        store = create_store(self.user1)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{"
            f'deleteApp(id: "{store_id}") '
            "{    ok"
            "        error"
            "    }"
            "}"
        )
        resp = self.query(
            query, username=self.normal_username, password=self.normal_pass
        )
        self.assertResponseNoErrors(resp)
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("deleteApp")
        self.assertFalse(data.get("ok", None))
        self.assertEqual(
            data.get("error", "no error"), str(Error.NOT_YOUR_RECURSE.value)
        )

    def test_user_can_update_own_store(self):
        store = create_store(self.user)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{\n"
            f'  updateApp(id: "{store_id}",\n'
            '           data: {name: "New App Name"}\n'
            "  )\n"
            "  {\n"
            "    ok\n"
            "    error\n"
            "  }\n"
            "}"
        )
        resp = self.query(
            query, username=self.normal_username, password=self.normal_pass
        )
        self.assertResponseNoErrors(resp)
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("updateApp")
        self.assertTrue(data.get("ok", None))
        self.assertIsNone(data.get("error", "no error"))

    def test_user_cannot_update_other_store(self):
        store = create_store(self.user1)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{\n"
            f'  updateApp(id: "{store_id}",\n'
            '           data: {name: "New App Name"}\n'
            "  )\n"
            "  {\n"
            "    ok\n"
            "    error\n"
            "  }\n"
            "}"
        )
        resp = self.query(
            query, username=self.normal_username, password=self.normal_pass
        )
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("updateApp")
        self.assertFalse(data.get("ok", None))
        self.assertEqual(
            data.get("error", "no error"), str(Error.NOT_YOUR_RECURSE.value)
        )

    def test_admin_cannot_update_other_stores(self):
        store = create_store(self.user)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{\n"
            f'  updateApp(id: "{store_id}",\n'
            '           data: {name: "New App Name"}\n'
            "  )\n"
            "  {\n"
            "    ok\n"
            "    error\n"
            "  }\n"
            "}"
        )
        resp = self.query(query, username=self.admin_username, password=self.admin_pass)
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("updateApp")
        self.assertFalse(data.get("ok", None))
        self.assertEqual(
            data.get("error", "no error"), str(Error.NOT_YOUR_RECURSE.value)
        )

    def test_admin_can_delete_other_stores(self):
        store = create_store(self.user)
        store_type_id = f"StoreAppType:{store.pk}"
        store_id = base64.b64encode(bytes(store_type_id, encoding="UTF8")).decode(
            "UTF8"
        )
        query = (
            "mutation{"
            f'deleteApp(id: "{store_id}") '
            "{    ok"
            "        error"
            "    }"
            "}"
        )
        resp = self.query(query, username=self.admin_username, password=self.admin_pass)
        self.assertResponseNoErrors(resp)
        resp_data = json.loads(resp.content)
        data = resp_data.get("data").get("deleteApp")
        self.assertTrue(data.get("ok", None))
        self.assertIsNone(data.get("error", "no error"))
