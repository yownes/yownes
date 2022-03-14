import graphene

from backend.account.api.schema import AuthMutation, AuthQuery
from backend.payments.api.schema import PaymentsMutation, PaymentsQuery
from backend.stores.api.schema import StoresMutation, StoresQuery


class Query(StoresQuery, PaymentsQuery, AuthQuery, graphene.ObjectType):
    pass


class Mutation(AuthMutation, PaymentsMutation, StoresMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
