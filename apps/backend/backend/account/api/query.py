import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphql_auth.schema import UserNode
from graphql_jwt.decorators import login_required, staff_member_required

from ..models import Account


class UserQuery(graphene.ObjectType):
    users = DjangoFilterConnectionField(UserNode)
    user = graphene.Field(UserNode, id=graphene.ID())

    @login_required
    @staff_member_required
    def resolve_users(self, info, **kwargs):
        return Account.objects.all()

    @staff_member_required
    def resolve_user(self, info, id, **kwargs):
        return graphene.relay.Node.get_node_from_global_id(info, id)
