import graphene
from djstripe.models import BalanceTransaction, Charge, Customer, Invoice, InvoiceItem, PaymentIntent, PaymentMethod, Plan, Price, Product, Subscription, TaxRate, UpcomingInvoice
from graphene_django import DjangoObjectType

from ..models import FeaturesModel


class FeaturesType(DjangoObjectType):
    class Meta:
        model = FeaturesModel
        filter_fields = ["name", "id"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)


class StripeBalanceType(DjangoObjectType):
    class Meta:
        model = Customer
        fields = ["balance"]
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeChargeType(DjangoObjectType):
    class Meta:
        model = Charge
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeCustomerType(DjangoObjectType):
    class Meta:
        model = Customer
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeInvoiceItemType(DjangoObjectType):
    class Meta:
        model = InvoiceItem
        filter_fields = ["id"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeInvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        filter_fields = ["customer"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeUpcomingInvoiceType(DjangoObjectType):
    class Meta:
        model = UpcomingInvoice
        filter_fields = ["customer", "subscription"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)


class StripePaymentIntentType(DjangoObjectType):
    class Meta:
        model = PaymentIntent
        filter_fields = ["customer"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripePaymentMethodType(DjangoObjectType):
    class Meta:
        model = PaymentMethod
        filter_fields = ["customer"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeProductType(DjangoObjectType):
    class Meta:
        model = Product
        filter_fields = ["name"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripePriceType(DjangoObjectType):
    class Meta:
        model = Price
        filter_fields = ["id"]
        exclude_fields = ("product",)
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripePlanType(DjangoObjectType):
    class Meta:
        model = Plan
        filter_fields = ["id"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)

    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeSubscriptionType(DjangoObjectType):
    class Meta:
        model = Subscription
        filter_fields = ["customer"]
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)
    
    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class StripeTaxType(graphene.InputObjectType):
    class Meta:
        model = TaxRate
        exclude_fields = ()
        interfaces = (graphene.relay.Node,)
    
    stripe_id = graphene.String()

    def resolve_stripe_id(self, info):
        return self.id


class FeatureInput(graphene.InputObjectType):
    name = graphene.String()


class PaymentCardInput(graphene.InputObjectType):
    exp_month = graphene.String()
    exp_year = graphene.String()


class PaymentInput(graphene.InputObjectType):
    card = PaymentCardInput()

class CustomerBillingDetailsAddressInput(graphene.InputObjectType):
    city = graphene.String()
    country = graphene.String()
    line1 = graphene.String()
    state = graphene.String()


class CustomerBillingDetailsInput(graphene.InputObjectType):
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()
    address = CustomerBillingDetailsAddressInput()


class PaymentMetadataInput(graphene.InputObjectType):
    document_id = graphene.String()


class CustomerInput(graphene.InputObjectType):
    billing_details = CustomerBillingDetailsInput()
    metadata = PaymentMetadataInput()


class IntervalEnum(graphene.Enum):
    DAY = "DAY"
    WEEK = "WEEK"
    MONTH = "MONTH"
    YEAR = "YEAR"


class PriceInput(graphene.InputObjectType):
    active = graphene.Boolean()
    amount = graphene.Int()
    currency = graphene.String()
    interval = IntervalEnum()


class ProductInput(graphene.InputObjectType):
    active = graphene.Boolean()
    apps = graphene.Int()
    description = graphene.String()
    features = graphene.List(graphene.String)
    name = graphene.String()

