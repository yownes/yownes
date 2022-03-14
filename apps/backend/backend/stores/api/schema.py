import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required, staff_member_required

from ..models import Build, Config, StoreApp, Template
from .mutations import (UpdateBuildsLimit, CreateStoreAppMutation,
                        DeleteAppMutation, DeletePaymentMethodAppMutation,
                        GenerateAppMutation, RestoreAppMutation, CreateOrUpdatePaymentMethodAppMutation,
                        UpdateStoreAppMutation, CreateTemplateMutation, UpdateTemplateMutation)
from .types import BuildType, ConfigType, StoreAppCustomerType, StoreAppType, TemplateType
import logging


class StoresQuery(graphene.ObjectType):
    template = graphene.relay.Node.Field(TemplateType)
    templates = DjangoFilterConnectionField(
        TemplateType,
        description="List of templates",
    )
    appcustomer = graphene.Field(StoreAppCustomerType, id=graphene.ID())
    app = graphene.relay.Node.Field(StoreAppType)
    apps = DjangoFilterConnectionField(StoreAppType, is_active=graphene.Boolean())
    builds = DjangoFilterConnectionField(BuildType)
    configs = DjangoFilterConnectionField(ConfigType)

    @login_required
    def resolve_templates(self, info, **kwargs):
        if info.context.user.is_staff:
            return Template.objects.all()
        else:
            return Template.objects.filter(is_active=True)

    @login_required
    def resolve_appcustomer(self, info, id, **kwargs):
        return graphene.relay.Node.get_node_from_global_id(info, id)

    @login_required
    def resolve_apps(self, info, is_active, **kwargs):
        if info.context.user:
            return StoreApp.objects.filter(is_active=is_active, customer=info.context.user.id)
        else:
            return StoreApp.objects.none()

    @login_required
    @staff_member_required
    def resolve_builds(self, info, **kwargs):
        return Build.objects.all()

    @login_required
    def resolve_configs(self, info, **kwargs):
        return Config.objects.all()


class StoresMutation(graphene.ObjectType):
    update_builds_limit = UpdateBuildsLimit.Field()

    generate_app = GenerateAppMutation.Field()
    create_app = CreateStoreAppMutation.Field()
    update_app = UpdateStoreAppMutation.Field()
    delete_app = DeleteAppMutation.Field()
    restore_app = RestoreAppMutation.Field()

    modify_payment_method_app = CreateOrUpdatePaymentMethodAppMutation.Field()
    delete_payment_method_app = DeletePaymentMethodAppMutation.Field()
    # payment_method_app = PaymentMethodAppMutation.Field()  # To change between prod/test

    create_template = CreateTemplateMutation.Field()
    update_template = UpdateTemplateMutation.Field()


schema = graphene.Schema(query=StoresQuery, mutation=StoresMutation)
