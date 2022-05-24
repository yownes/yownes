from django.core.mail import send_mail
from django.template.loader import render_to_string

import graphene
from graphene.relay import Node
from graphql_jwt.decorators import login_required, staff_member_required

from backend.errors import Error
from graphql_auth.models import UserStatus
from backend.graphql.types import Return

from ..models import AccountStatus


class BanUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        ban = graphene.Boolean(required=True)

    Output = Return

    @staff_member_required
    @login_required
    def mutate(self, info, user_id, ban):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if ban:
            user_object.account_status = AccountStatus.BANNED.value
            user_object.save()
            send_mail(
                'BAN',
                'Tu cuenta ha sido baneada.',
                'ywns.test1@gmail.com',
                [user_object.email],
                fail_silently=False,
                html_message=render_to_string("custom/account_banned.html", { "username": user_object.username })
            )
            return Return(ok=True)
        user_object.account_status = AccountStatus.REGISTERED
        user_object.save()
        send_mail(
            'DESBAN',
            'Tu cuenta ha sido desbaneada.',
            'ywns.test1@gmail.com',
            [user_object.email],
            fail_silently=False,
            html_message=render_to_string("custom/account_unbanned.html", { "username": user_object.username })
        )
        return Return(ok=True)


class ChangeVerifiedMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        verify = graphene.Boolean(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    verified = graphene.Boolean()

    @staff_member_required
    @login_required
    def mutate(self, info, user_id, verify):
        user_object = Node.get_node_from_global_id(info, user_id)
        user_status_object = UserStatus.objects.get(user=user_object)
        if not user_object or not user_status_object:
            return ChangeVerifiedMutation(ok=False, error=Error.NO_RECURSE.value)
        if verify:
            user_status_object.verified = verify
            user_status_object.save()
            send_mail(
                'VERIFICACIÓN',
                'Tu cuenta ha sido verificada con éxito.',
                'ywns.test1@gmail.com',
                [user_object.email],
                fail_silently=False,
                html_message=render_to_string("custom/account_verified.html", { "username": user_object.username })
            )
            return ChangeVerifiedMutation(ok=True, verified=verify)
        user_status_object.verified = verify
        user_status_object.save()
        return ChangeVerifiedMutation(ok=True, verified=verify)


class DeleteClientMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        active = graphene.Boolean(required=True)

    Output = Return

    @staff_member_required
    @login_required
    def mutate(self, info, user_id, active):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if not active:
            user_object.is_active = active
            user_object.save()
            send_mail(
                'ELIMINACIÓN',
                'Tu cuenta ha sido eliminada.',
                'ywns.test1@gmail.com',
                [user_object.email],
                fail_silently=False,
                html_message=render_to_string("custom/account_deleted.html", { "username": user_object.username })
            )
            return Return(ok=True)
        user_object.is_active = active
        user_object.save()
        return Return(ok=True)
