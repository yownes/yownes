import graphene
from graphene.relay import Node
from graphql_jwt.decorators import login_required, staff_member_required
import json
import sys

from backend import errors
from backend.account.models import AccountStatus
from backend.errors import Error
from backend.graphql.types import Return

from ..api.types import (BuildType, PaymentMethodAppInput, 
                         StoreAppInput, StoreAppType, 
                         TemplateInput, TemplateType)
from ..models import Build, BuildStatus, PaymentMethod, StoreApp, Template
from .. import utils

import logging


def _update_store_app_custom_fields(store_app_object, info, data):
    if data.logo:
        store_app_object.logo.save(data.logo.name, data.logo)
        store_app_object.save()
        del data["logo"]
    if data.links:
        if data.links.android_link:
            store_app_object.android_link = data.links.android_link
        if data.links.ios_link:
            store_app_object.ios_link = data.links.ios_link
        store_app_object.save()
        del data["links"]
    if data.color:
        if data.color.color:
            store_app_object.color = data.color.color
        if data.color.text:
            store_app_object.text_color = data.color.text
        store_app_object.save()
        del data["color"]
    if data.template:
        template_object = Node.get_node_from_global_id(info, data.template)
        store_app_object.template = template_object
        store_app_object.save()
        del data["template"]
    StoreApp.objects.filter(pk=store_app_object.pk).update(**data)


class GenerateAppMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    build = graphene.Field(BuildType)
    
    @login_required
    def mutate(self, info, id):
        store_app_object = Node.get_node_from_global_id(info, id)
        if not store_app_object: # not recurse
            return GenerateAppMutation(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user.account_status == AccountStatus.BANNED: # banned account
            return GenerateAppMutation(ok=False, error=Error.BANNED_ACCOUNT.value)
        if not info.context.user.subscription: # not subscription
            return GenerateAppMutation(ok=False, error=Error.NOT_SUBSCRIBED_ACCOUNT.value)
        if info.context.user.subscription.status.lower() != "active": # not active subscription
            return GenerateAppMutation(ok=False, error=Error.NOT_SUBSCRIBED_ACCOUNT.value)
        try:
            allowed_apps = int(json.loads(str(info.context.user.subscription.plan.product.metadata).replace("\'", "\""))["allowed_apps"])
        except:
            allowed_apps = 1
        current_apps = StoreApp.objects.filter(customer=info.context.user, is_active=True).count()
        if current_apps > allowed_apps: # not available apps
            return GenerateAppMutation(ok=False, error=Error.NOT_AVAILABLE_APPS.value)
        try:
            allowed_builds = int(json.loads(str(info.context.user.subscription.plan.product.metadata).replace("\'", "\""))["allowed_builds"])
        except:
            allowed_builds = 1
        builds = Build.objects.filter(app=Node.get_node_from_global_id(info, id))
        available_builds = utils._available_builds(builds, allowed_builds)
        if available_builds <= 0: # not available builds
            return GenerateAppMutation(ok=False, error=Error.NOT_AVAILABLE_BUILDS.value)
        if utils._has_build_in_progress(builds): # has build in progress
            return GenerateAppMutation(ok=False, error=Error.HAS_BUILD_IN_PROGRESS.value)
        else: # create build
            try:
                generated_build = Build.objects.create(app=store_app_object, build_status=BuildStatus.QUEUED)
                return GenerateAppMutation(ok=True, build=generated_build)
            except:
                logging.warning(sys.exc_info()[0])
                return GenerateAppMutation(ok=False, error=Error.BUILD_EXCEPTION.value)


class CreateStoreAppMutation(graphene.Mutation):
    class Arguments:
        data = StoreAppInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    store_app = graphene.Field(StoreAppType)

    @login_required
    def mutate(self, info, data):
        # if not utils._is_store_link_valid(data.api_link):
        #     return {
        #         "ok": False,
        #         "error": Error.NOT_VALID_STORE.value
        #     }
        try:
            allowed_apps = int(json.loads(str(info.context.user.subscription.plan.product.metadata).replace("\'", "\""))["allowed_apps"])
        except:
            allowed_apps = 1
        current_apps = StoreApp.objects.filter(customer=info.context.user, is_active=True).count()
        if current_apps != 0 and current_apps >= allowed_apps:
            return {
                "ok": False,
                "error": Error.NOT_AVAILABLE_APPS.value
            }
        store_app_object = StoreApp.objects.create(name=data.get('name'))
        store_app_object.customer = info.context.user
        store_app_object.save()
        _update_store_app_custom_fields(store_app_object, info, data)
        return {
            "ok": True,
            "store_app": store_app_object
        }


class UpdateStoreAppMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        data = StoreAppInput(required=True)

    Output = Return

    @login_required
    def mutate(self, info, id, data):
        # if not utils._is_store_link_valid(data.api_link):
        #     return {
        #         "ok": False,
        #         "error": Error.NOT_VALID_STORE.value
        #     }
        store_app_object = Node.get_node_from_global_id(info, id)
        if not store_app_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user != store_app_object.customer:
            return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        #TODO: comprobar que las apps y builds son válidos
        _update_store_app_custom_fields(store_app_object, info, data)
        return Return(ok=True)


class DeleteAppMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, id):
        store_app_object = Node.get_node_from_global_id(info, id)
        if not store_app_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user != store_app_object.customer and not info.context.user.is_staff:
            return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        try:
            store_app_object.is_active = False
            store_app_object.save()
            # TODO: Delete app from Apple/Google Stores
            return Return(ok=True)
        except:
            return Return(ok=False, error=Error.UNKNOWN_ERROR.value)


class RestoreAppMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, id):
        store_app_object = Node.get_node_from_global_id(info, id)
        if not store_app_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user != store_app_object.customer and not info.context.user.is_staff:
            return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        try:
            store_app_object.is_active = True
            store_app_object.save()
            return Return(ok=True)
        except:
            return Return(ok=False, error=Error.UNKNOWN_ERROR.value)


class CreateOrUpdatePaymentMethodAppMutation(graphene.Mutation):
    class Arguments:
        store_app_id = graphene.ID(required=True)
        data = PaymentMethodAppInput(required=True)

    Output = Return

    @login_required
    def mutate(self, info, store_app_id, data):
        store_app_object = Node.get_node_from_global_id(info, store_app_id)
        if not store_app_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user != store_app_object.customer:
            return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        try:
            PaymentMethod.objects.update_or_create(store_app=store_app_object, defaults=data)
            return Return(ok=True)
        except StoreApp.payment_method.RelatedObjectDoesNotExist:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        except:
            return Return(ok=False, error=Error.UNKNOWN_ERROR.value)


class DeletePaymentMethodAppMutation(graphene.Mutation):
    class Arguments:
        store_app_id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, store_app_id):
        store_app_object = Node.get_node_from_global_id(info, store_app_id)
        if not store_app_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if info.context.user != store_app_object.customer:
            return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        try:
            store_app_object.payment_method.delete()
            return Return(ok=True)
        except StoreApp.payment_method.RelatedObjectDoesNotExist:
            return Return(ok=False, error=Error.NO_RECURSE.value)


class CreateTemplateMutation(graphene.Mutation):
    class Arguments:
        data = TemplateInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    template = graphene.Field(TemplateType)

    @staff_member_required
    def mutate(self, info, data):
        if data.url and not utils._is_template_link_valid(data.url):
            return {
                "ok": False,
                "error": Error.NOT_VALID_TEMPLATE_URL.value
            }
        try:
            template_object = Template.objects.create(is_active=data.get('is_active'), name=data.get('name'), url=data.get('url'), preview_img=data.get('preview_img'), snack=data.get('snack'))
            return CreateTemplateMutation(ok=True, template=template_object)
        except:
            return CreateTemplateMutation(ok=False, error=Error.CREATE_TEMPLATE_ERROR.value)


class UpdateTemplateMutation(graphene.Mutation):
    class Arguments:
        template_id = graphene.ID(required=True)
        data = TemplateInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    template = graphene.Field(TemplateType)

    @staff_member_required
    def mutate(self, info, template_id, data):
        logging.warning(data)
        if data.url and not utils._is_template_link_valid(data.url):
            return {
                "ok": False,
                "error": Error.NOT_VALID_TEMPLATE_URL.value
            }
        template_object = Node.get_node_from_global_id(info, template_id)
        if not template_object:
            return UpdateTemplateMutation(ok=False, error=Error.NO_RECURSE.value)
        try:
            template_object.preview_img = data.preview_img
            template_object.name = data.name
            if data.url:
                template_object.url = data.url
            template_object.snack = data.snack
            template_object.is_active = data.is_active
            template_object.save()
            return UpdateTemplateMutation(ok=True, template=template_object)
        except:
            return UpdateTemplateMutation(ok=False, error=Error.UPDATE_TEMPLATE_ERROR.value)
