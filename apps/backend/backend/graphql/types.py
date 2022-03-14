import graphene


class Return(graphene.ObjectType):
    ok = graphene.Boolean()
    error = graphene.String()
