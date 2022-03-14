import graphene
from graphql_auth import mutations
from graphql_auth.schema import MeQuery

from .mutations import BanUserMutation, ChangeVerifiedMutation, DeleteClientMutation
from .query import UserQuery


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    update_account = mutations.UpdateAccount.Field()
    send_secondary_email_activation = mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()

    # own mutations
    ban_user = BanUserMutation.Field()
    change_verified = ChangeVerifiedMutation.Field()
    delete_client = DeleteClientMutation.Field()


class AuthQuery(UserQuery, MeQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=AuthQuery, mutation=AuthMutation)
