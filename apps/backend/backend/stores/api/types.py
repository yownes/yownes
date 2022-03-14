import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from graphql_auth.schema import UserNode
from graphql_jwt.decorators import login_required
from dataclasses import dataclass
from datetime import date
from typing import Optional, Sequence

from ..models import Build, BuildStatus, Config, PaymentMethod, StoreApp, Template

BuildStatusEnum = graphene.Enum.from_enum(BuildStatus)


@dataclass
class BuildData:
    id: str
    build_status: BuildStatusEnum
    date: date


@dataclass
class BuildsData:
    edges: Optional[Sequence[BuildData]]


class PaymentMethodAppInput(graphene.InputObjectType):
    stripe_test_public = graphene.String(required=True)
    stripe_test_secret = graphene.String(required=True)
    stripe_prod_public = graphene.String(required=True)
    stripe_prod_secret = graphene.String(required=True)


class StoreAppColorInput(graphene.InputObjectType):
    color = graphene.String()
    text = graphene.String()


class StoreAppLinksInput(graphene.InputObjectType):
    android_link = graphene.String()
    ios_link = graphene.String()


class StoreAppInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    color = StoreAppColorInput()
    links = StoreAppLinksInput()
    api_link = graphene.String()
    template = graphene.ID()
    logo = Upload()


class TemplateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    is_active = graphene.Boolean()
    preview_img = Upload()
    url = graphene.String()
    snack = graphene.String()


class BuildType(DjangoObjectType):
    class Meta:
        model = Build
        filter_fields = ["build_status"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)
        convert_choices_to_enum = ["build_status"]


class ConfigType(DjangoObjectType):
    class Meta:
        model = Config
        filter_fields = ["limit"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)


class TemplateType(DjangoObjectType):
    class Meta:
        model = Template
        exclude_fields = ()
        filter_fields = []
        interfaces = (graphene.relay.Node,)

    preview_img = graphene.String()

    def resolve_preview_img(self, info, *args, **kwargs):
        if self.preview_img:
            return info.context.build_absolute_uri(self.preview_img.url)
        else:
            return None
    
    def resolve_url(self, info):
        if info.context.user.is_staff:
            return self.url
        else:
            return None


class StoreLinks(graphene.ObjectType):
    android = graphene.String()
    ios = graphene.String()

    def resolve_android(self, info):
        return self.android

    def resolve_ios(self, info):
        return self.ios


class StoreColors(graphene.ObjectType):
    color = graphene.String()
    text = graphene.String()

    def resolve_color(self, info):
        return self.color

    def resolve_text(self, info):
        return self.text


class PaymentType(DjangoObjectType):
    class Meta:
        model = PaymentMethod
        exclude_fields = ()
        filter_fields = []
        interfaces = (graphene.relay.Node,)

class StoreAppCustomerType(DjangoObjectType):
    class Meta:
        model = StoreApp
        fields = ("is_active", )
    
    is_owner_and_active = graphene.Boolean()

    @login_required
    def resolve_is_owner_and_active(self, info):
        if self.customer == info.context.user:
            if not self.is_active:
                return False
            return True
        return False

class StoreAppType(DjangoObjectType):
    class Meta:
        model = StoreApp
        exclude_fields = ("ios_link", "android_link", "text_color")
        filter_fields = []
        interfaces = (graphene.relay.Node,)

    logo = graphene.String()
    store_links = graphene.Field(StoreLinks)
    color = graphene.Field(StoreColors)
    customer = graphene.Field(UserNode)
    payment_method = graphene.Field(PaymentType)
    is_active = graphene.Boolean()

    def resolve_payment_method(self, info, *args, **kwargs):
        if (self.customer != info.context.user) and not info.context.user.is_staff:
            return None
        try:
            return self.payment_method
        except StoreApp.payment_method.RelatedObjectDoesNotExist:
            return None

    def resolve_color(self, *args, **kwargs):
        return StoreColors(color=self.color, text=self.text_color)

    def resolve_customer(self, *args, **kwargs):
        if self.customer:
            return self.customer
        return None

    def resolve_store_links(self, *args, **kwargs):
        return StoreLinks(android=self.android_link, ios=self.ios_link)

    def resolve_logo(self, info, *args, **kwargs):
        if self.logo:
            return info.context.build_absolute_uri(self.logo.url)
            return self.logo.url
        else:
            return None

    def resolve_is_active(self, *args, **kwargs):
        return self.is_active
