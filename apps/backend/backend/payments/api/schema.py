import djstripe
import graphene
from graphene_django.filter import DjangoFilterConnectionField

from djstripe.models import Invoice, Price, Product, Subscription

from ..models import FeaturesModel
from .mutations import AddPaymentMethod, UpdateCustomerMutation, DropOutUserMutation, TakeUpUserMutation, UpdateSubscriptionMutation, SubscribeMutation, DetachPaymentMethod, UpdatePaymentMethod, CreatePlanMutation, UpdatePlanMutation, CreatePriceMutation, UpdatePriceMutation, CreateFeatureMutation, UpdateFeatureMutation, DeleteFeatureMutation, PayInvoiceMutation
from .types import FeaturesType, StripeBalanceType, StripeInvoiceType, StripePriceType, StripeProductType, StripeSubscriptionType, StripeUpcomingInvoiceType
import logging

class PaymentsMutation(graphene.ObjectType):
    subscribe = SubscribeMutation.Field()
    update_customer = UpdateCustomerMutation.Field()
    drop_out = DropOutUserMutation.Field()
    take_up = TakeUpUserMutation.Field()
    update_subscription = UpdateSubscriptionMutation.Field()
    detach_payment_method = DetachPaymentMethod.Field()
    # select_default_payment_method = SelectDefaultPaymentMethod.Field()
    add_payment_method = AddPaymentMethod.Field()
    update_payment_method = UpdatePaymentMethod.Field()
    create_plan = CreatePlanMutation.Field()
    update_plan = UpdatePlanMutation.Field()
    create_price = CreatePriceMutation.Field()
    update_price = UpdatePriceMutation.Field()
    create_feature = CreateFeatureMutation.Field()
    update_feature = UpdateFeatureMutation.Field()
    delete_feature = DeleteFeatureMutation.Field()
    pay_invoice = PayInvoiceMutation.Field()


class PaymentsQuery(graphene.ObjectType):
    balance = graphene.Field(StripeBalanceType, id=graphene.ID())
    upcominginvoice = graphene.Field(StripeUpcomingInvoiceType, cus=graphene.ID(), sub=graphene.ID())
    invoices = DjangoFilterConnectionField(StripeInvoiceType, id=graphene.ID())
    product = graphene.Field(StripeProductType, id=graphene.ID())
    products = DjangoFilterConnectionField(StripeProductType)
    features = DjangoFilterConnectionField(FeaturesType)
    subscriptions = DjangoFilterConnectionField(StripeSubscriptionType, id=graphene.ID())
    
    def resolve_balance(self, info, id):
        return graphene.relay.Node.get_node_from_global_id(info, id)
    def resolve_upcominginvoice(self, info, cus, sub):
        user = graphene.relay.Node.get_node_from_global_id(info, cus)
        subscription = graphene.relay.Node.get_node_from_global_id(info, sub)
        try:
            if not info.context.user.is_staff and info.context.user.customer.id != user.customer.id:
                return None
            djstripe_invoice = djstripe.models.Customer.upcoming_invoice(self, customer=user.customer.id, subscription=subscription.id)
            return djstripe_invoice
        except:
            return None
    def resolve_invoices(self, info, id):
        user = graphene.relay.Node.get_node_from_global_id(info, id)
        if info.context.user == user or info.context.user.is_staff:
            try:
                return Invoice.objects.filter(customer=user.customer.id)
            except AttributeError:
                return Invoice.objects.none()
        else:
            return Invoice.objects.none()
    def resolve_product(self, info, id):
        return graphene.relay.Node.get_node_from_global_id(info, id)
    def resolve_products(self, info):
        if info.context.user.is_staff:
            return Product.objects.filter(type="service")
        else:
            return Product.objects.filter(type="service", active=True)
    def resolve_features(self, info):
        return FeaturesModel.objects.prefetch_related("stripe_product").all()
    def resolve_subscriptions(self, info, id):
        user = graphene.relay.Node.get_node_from_global_id(info, id)
        if info.context.user == user or info.context.user.is_staff:
            try:
                return Subscription.objects.filter(customer=user.customer.id)
            except AttributeError:
                return Subscription.objects.none()
        else:
            return Subscription.objects.none()


schema = graphene.Schema(query=PaymentsQuery, mutation=PaymentsMutation)
