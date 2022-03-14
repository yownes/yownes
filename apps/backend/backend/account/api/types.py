import graphene

from ..models import AccountStatus

AccountStatusEnum = graphene.Enum.from_enum(AccountStatus)
