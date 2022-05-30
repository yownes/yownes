import djstripe
import graphene
import stripe
from graphene.relay import Node
from graphql_jwt.decorators import login_required, staff_member_required

from backend.account.models import AccountStatus
from backend.account.api.types import AccountStatusEnum
from backend.errors import Error, StripeErrorsEs
from backend.graphql.types import Return

from ..api.types import (CustomerInput, FeatureInput, FeaturesType, CreatePaymentInput, PaymentInput, PriceInput, ProductInput, StripeCustomerType, StripeInvoiceType, StripePriceType, StripeProductType, StripeSubscriptionType)
from ..models import FeaturesModel

import logging
import datetime
from djstripe.models import Customer, Invoice, PaymentMethod, Price, Product, Subscription
import sys


class SubscribeMutation(graphene.Mutation):
    class Arguments:
        payment_method_id = graphene.ID(required=True)
        price_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    subscription = graphene.Field(StripeSubscriptionType)
    account_status = graphene.Field(AccountStatusEnum)
    
    @login_required
    def mutate(self, info, payment_method_id, price_id):
        if info.context.user.account_status == AccountStatus.BANNED:
            return SubscribeMutation(ok=False, error=Error.BANNED_ACCOUNT.value)
        try:
            # Set stripe api key
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            # first sync payment method to local DB to workaround
            # https://github.com/dj-stripe/dj-stripe/issues/1125
            payment_method_obj = stripe.PaymentMethod.retrieve(payment_method_id)
            PaymentMethod.sync_from_stripe_data(payment_method_obj)
            # Create the stripe Customer, by default subscriber Model is User,
            # this can be overridden with settings.DJSTRIPE_SUBSCRIBER_MODEL
            customer, created = Customer.get_or_create(subscriber=info.context.user)

            logging.warning("%s %s", customer.subscription, created)
            if customer.subscription:
                subscription_id = customer.subscription.id
                customer.subscription.cancel(at_period_end=False)
                subscription_object = stripe.Subscription.retrieve(subscription_id)
                djstripe.models.Subscription.sync_from_stripe_data(subscription_object)
                if info.context.user.account_status != AccountStatus.BANNED:
                    info.context.user.account_status = AccountStatus.REGISTERED
                    info.context.user.save()
                # TODO: remove apps from stores
                logging.warning("TODO: remove Apps from stores")
                
            # Add the payment method customer's default
            customer.add_payment_method(payment_method_obj)
            # Using the Stripe API, create a subscription for this customer,
            # using the customer's default payment source
            stripe_subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{"price": price_id}],
                collection_method="charge_automatically",
                # tax_percent=15,
                # api_key=djstripe.settings.STRIPE_SECRET_KEY,
            )
            # Sync the Stripe API return data to the database,
            # this way we don't need to wait for a webhook-triggered sync
            subscription = djstripe.models.Subscription.sync_from_stripe_data(
                stripe_subscription
            )
            # create customer
            if subscription.is_valid():
                info.context.user.account_status = AccountStatus.PAID_ACCOUNT
            else:
                info.context.user.account_status = AccountStatus.WAITING_PAYMENT
            info.context.user.customer = customer
            info.context.user.subscription = subscription
            info.context.user.save()
            subscription_obj = Subscription.objects.get(id=subscription.id)

            return SubscribeMutation(ok=True, subscription=subscription_obj, account_status=info.context.user.account_status)
        except Exception as e:
            logging.warning("EXCEPT")
            logging.warning(e)
            return SubscribeMutation(ok=True, error=e)


class UpdateSubscriptionMutation(graphene.Mutation):
    class Arguments:
        price_id = graphene.ID(required=True)
        subscription_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    subscription = graphene.Field(StripeSubscriptionType)
    account_status = graphene.Field(AccountStatusEnum)
    
    @login_required
    def mutate(self, info, price_id, subscription_id):
        if info.context.user.account_status == AccountStatus.BANNED:
            return UpdateSubscriptionMutation(ok=False, error=Error.BANNED_ACCOUNT.value)
        stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
        subscription = stripe.Subscription.retrieve(subscription_id)
        default_payment_method = Customer.objects.get(id=subscription.customer).default_payment_method
        if not default_payment_method:
            return UpdateSubscriptionMutation(ok=False, error=Error.PAY_ERROR.value)
        exp_month = default_payment_method.card.get("exp_month")
        exp_year = default_payment_method.card.get("exp_year")
        now_month = datetime.datetime.today().month
        now_year = datetime.datetime.today().year
        if exp_year < now_year or (exp_year == now_year and exp_month < now_month ):
            return UpdateSubscriptionMutation(ok=False, error=Error.PAY_ERROR.value)
        try:
            stripe_subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=False,
                proration_behavior='create_prorations',
                items=[{
                    "id": subscription['items']['data'][0].id,
                    "price": price_id,
                }],
            )
            logging.warning(stripe_subscription)
            subscription = djstripe.models.Subscription.sync_from_stripe_data(
                stripe_subscription
            )
            if subscription.is_valid():
                info.context.user.account_status = AccountStatus.PAID_ACCOUNT
            else:
                info.context.user.account_status = AccountStatus.WAITING_PAYMENT
                info.context.user.save()
                return UpdateSubscriptionMutation(ok=False, error=Error.CREATE_SUBSCRIPTION_ERROR.value, subscription=subscription, account_status=info.context.user.account_status)
            info.context.user.subscription = subscription
            info.context.user.save()

            return UpdateSubscriptionMutation(ok=True, subscription=subscription, account_status=info.context.user.account_status)
        except Exception as e:
            logging.warning(e)
            return UpdateSubscriptionMutation(ok=False, error=Error.UNKNOWN_ERROR.value)


class AddPaymentMethod(graphene.Mutation):
    class Arguments:
        is_default = graphene.Boolean(default_value=True)
        payment_method_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, is_default, payment_method_id, user_id):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if not info.context.user.is_staff and user_object.account_status == AccountStatus.BANNED: # banned account
            return Return(ok=False, error=Error.BANNED_ACCOUNT.value)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            payment_method_obj = stripe.PaymentMethod.retrieve(payment_method_id)
            PaymentMethod.sync_from_stripe_data(payment_method_obj)

            user_object.customer.add_payment_method(payment_method_obj, is_default)
            user_object.customer.save()
            
            return Return(ok=True)
        except Exception as e:
            return Return(ok=False, error=e)


class CreatePaymentMethod(graphene.Mutation):
    class Arguments:
        payment = CreatePaymentInput(required=True)
        user_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    id = graphene.String()

    @login_required
    def mutate(self, info, payment, user_id):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return CreatePaymentMethod(ok=False, error=Error.NO_RECURSE.value)
        if not info.context.user.is_staff and user_object.account_status == AccountStatus.BANNED: # banned account
            return CreatePaymentMethod(ok=False, error=Error.BANNED_ACCOUNT.value)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            payment_method = stripe.PaymentMethod.create(billing_details=payment.billing_details, card=payment.card, type="card")
            payment_method_obj = stripe.PaymentMethod.retrieve(payment_method.id)
            PaymentMethod.sync_from_stripe_data(payment_method_obj)
            
            return CreatePaymentMethod(ok=True, id=payment_method.id)
        except Exception as e:
            error_message=StripeErrorsEs[e.code].value
            logging.warning("error type: %s %s", e.code, error_message)
            return CreatePaymentMethod(ok=False, error=error_message)


class UpdatePaymentMethod(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        payment_method_id = graphene.ID(required=True)
        payment = PaymentInput(required=True)
        user_id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, id, payment_method_id, payment, user_id):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if not info.context.user.is_staff and user_object.account_status == AccountStatus.BANNED: # banned account
            return Return(ok=False, error=Error.BANNED_ACCOUNT.value)
        payment_object = Node.get_node_from_global_id(info, id)
        if not info.context.user.is_staff:
            if info.context.user.customer.id != payment_object.customer.id:
                return Return(ok=False, error=Error.NOT_YOUR_RECURSE.value)
        # TODO Comprobar que los campos obligatorios llegan (igual poniedo required en los type ya bastaría)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            payment_method_mod = stripe.PaymentMethod.modify(payment_method_id, billing_details=payment.billing_details, card=payment.card)
            payment_method_obj = stripe.PaymentMethod.retrieve(payment_method_id)
            PaymentMethod.sync_from_stripe_data(payment_method_obj)
            
            return Return(ok=True)
        except Exception as e:
            error_message=StripeErrorsEs[e.code].value
            logging.warning("error type: %s %s", e.code, error_message)
            return Return(ok=False, error=error_message)


class UpdateCustomerMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        customer = CustomerInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    customer = graphene.Field(StripeCustomerType)
    
    @login_required
    def mutate(self, info, user_id, customer):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return UpdateCustomerMutation(ok=False, error=Error.NO_RECURSE.value)
        if not info.context.user.is_staff and user_object.account_status == AccountStatus.BANNED: # banned account
            return UpdateCustomerMutation(ok=False, error=Error.BANNED_ACCOUNT.value)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            try:
                customer_obj = Customer.objects.get(id=user_object.customer.id)
            except:
                customer_obj, created = Customer.get_or_create(subscriber=user_object)
            user_object.customer=customer_obj
            user_object.save()
            mod = stripe.Customer.modify(customer_obj.id, address=customer.billing_details.address, email=customer.billing_details.email, name=customer.billing_details.name, phone=customer.billing_details.phone, metadata={"document_id": customer.metadata.document_id})
            cus_obj = stripe.Customer.retrieve(customer_obj.id)
            Customer.sync_from_stripe_data(cus_obj)
            customer_object = Customer.objects.get(id=customer_obj.id)
        except:
            return Return(ok=False, error=Error.UPDATE_CUSTOMER_ERROR.value)
        
        return UpdateCustomerMutation(ok=True, customer=customer_object)
        

class DropOutUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        at_period_end = graphene.Boolean(default_value=False)

    ok = graphene.Boolean()
    error = graphene.String()
    subscription = graphene.Field(StripeSubscriptionType)
    account_status = graphene.Field(AccountStatusEnum)

    @login_required
    def mutate(self, info, user_id, at_period_end):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return DropOutUserMutation(ok=False, error=Error.NO_RECURSE.value)
        if not user_object.subscription:
            return DropOutUserMutation(ok=False, error=Error.WARNING.value)
        try:
            if user_object.subscription.status != "canceled" and user_object.subscription.status != "incomplete_expired":
                user_object.subscription.cancel(at_period_end=at_period_end)
                stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
                subscription_object = stripe.Subscription.retrieve(user_object.subscription.id)
                djstripe.models.Subscription.sync_from_stripe_data(subscription_object)
                subscription_obj = Subscription.objects.get(id=user_object.subscription.id)
                if at_period_end is False:
                    if info.context.user.account_status != AccountStatus.BANNED:
                        info.context.user.account_status = AccountStatus.REGISTERED
                        info.context.user.save()
                    # TODO: remove apps from stores
                    logging.warning("TODO: remove Apps from stores")
            return DropOutUserMutation(ok=True, subscription=subscription_obj, account_status=info.context.user.account_status)
        except Exception as e:
            return DropOutUserMutation(ok=False, error=e)


class TakeUpUserMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
    
    ok = graphene.Boolean()
    error = graphene.String()
    subscription = graphene.Field(StripeSubscriptionType)

    @login_required
    def mutate(self, info, user_id):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return TakeUpUserMutation(ok=False, error=Error.NO_RECURSE.value)
        if not user_object.subscription:
            return TakeUpUserMutation(ok=False, error=Error.WARNING.value)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            subscription_mod = stripe.Subscription.modify(user_object.subscription.id, cancel_at_period_end=False)
            subscription_obj = stripe.Subscription.retrieve(user_object.subscription.id)
            djstripe.models.Subscription.sync_from_stripe_data(subscription_obj)
            subscription_object = Subscription.objects.get(id=user_object.subscription.id)
            return TakeUpUserMutation(ok=True, subscription=subscription_object)
        except Exception as e:
            return TakeUpUserMutation(ok=False, error=e)


class DetachPaymentMethod(graphene.Mutation):
    class Arguments:
        payment_method_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    Output = Return

    @login_required
    def mutate(self, info, payment_method_id, user_id):
        user_object = Node.get_node_from_global_id(info, user_id)
        if not user_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        if not info.context.user.is_staff and user_object.account_status == AccountStatus.BANNED: # banned account
            return Return(ok=False, error=Error.BANNED_ACCOUNT.value)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            payment_method_obj = stripe.PaymentMethod.retrieve(payment_method_id)
            payment_method_obj_local = PaymentMethod.sync_from_stripe_data(payment_method_obj)
            payment_method_obj_local.detach()
            return Return(ok=True)
        except Exception as e:
            return Return(ok=False, error=e)


class CreatePlanMutation(graphene.Mutation):
    class Arguments:
        data = ProductInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    plan = graphene.Field(StripeProductType)

    @staff_member_required
    @login_required
    def mutate(self, info, data):
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            plan_new = stripe.Product.create(active=data.active, name=data.name, description=data.description, metadata={"allowed_apps": data.apps, "allowed_builds": data.builds, "plan_type": data.type},)
            plan_obj = stripe.Product.retrieve(plan_new.id)
            djstripe.models.Product.sync_from_stripe_data(plan_obj)
            plan_object = Product.objects.get(id=plan_obj.id)
            for feat in data.features:
                feat_object = Node.get_node_from_global_id(info, feat)
                plan_object.features.add(feat_object)
                plan_object.save()
            plan_feat_object = Product.objects.get(id=plan_obj.id)
            return CreatePlanMutation(ok=True, plan=plan_feat_object)
        except:
            return CreatePlanMutation(ok=False, error=Error.CREATE_PLAN_ERROR.value)


class UpdatePlanMutation(graphene.Mutation):
    class Arguments:
        plan_id = graphene.ID(required=True)
        data = ProductInput(required=True)

    Output = Return

    @staff_member_required
    @login_required
    def mutate(self, info, plan_id, data):
        try:
            plan_object = Node.get_node_from_global_id(info, plan_id)
            features_object = FeaturesModel.objects.filter(stripe_product=plan_object)
            for feat in features_object:
                plan_object.features.remove(feat)
                plan_object.save()
            for feat in data.features:
                feat_object = Node.get_node_from_global_id(info, feat)
                plan_object.features.add(feat_object)
                plan_object.save()
            plan_object.active = data.active
            plan_object.name = data.name
            plan_object.description = data.description
            plan_object.metadata = {"allowed_apps": data.apps, "allowed_builds": data.builds, "plan_type": data.type}
            plan_object.save()
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            plan_mod = stripe.Product.modify(plan_object.id, active=data.active, name=data.name, description=data.description, metadata={"allowed_apps": data.apps, "allowed_builds": data.builds, "plan_type": data.type},)
            plan_obj = stripe.Product.retrieve(plan_object.id)
            djstripe.models.Product.sync_from_stripe_data(plan_obj)
            return Return(ok=True)
        except:
            return Return(ok=False, error=Error.UPDATE_PLAN_ERROR.value)


class CreatePriceMutation(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        data = PriceInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    price = graphene.Field(StripePriceType)

    @staff_member_required
    @login_required
    def mutate(self, info, product_id, data):
        try:
            product_object = Node.get_node_from_global_id(info, product_id)
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            price_new = stripe.Price.create(product=product_object.id, active=data.active, currency=data.currency, recurring={"interval": data.interval.lower()}, unit_amount=data.amount,)
            price_obj = stripe.Price.retrieve(price_new.id)
            djstripe.models.Price.sync_from_stripe_data(price_obj)
            price_object = Price.objects.get(id=price_obj.id)
            return CreatePriceMutation(ok=True, price=price_object)
        except:
            return CreatePriceMutation(ok=False, error=Error.CREATE_PRICE_ERROR.value)


class UpdatePriceMutation(graphene.Mutation):
    class Arguments:
        price_id = graphene.ID(required=True)
        active = graphene.Boolean(required=True)

    Output = Return

    @staff_member_required
    @login_required
    def mutate(self, info, price_id, active):
        try:
            price_object = Node.get_node_from_global_id(info, price_id)
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            price_mod = stripe.Price.modify(price_object.id, active=active,)
            price_obj = stripe.Price.retrieve(price_mod.id)
            djstripe.models.Price.sync_from_stripe_data(price_obj)
            return Return(ok=True)
        except:
            if active == True:
                return Return(ok=False, error=Error.UNARCHIVE_PRICE_ERROR.value)
            return Return(ok=False, error=Error.ARCHIVE_PRICE_ERROR.value)


class CreateFeatureMutation(graphene.Mutation):
    class Arguments:
        data = FeatureInput(required=True)

    ok = graphene.Boolean()
    error = graphene.String()
    feature = graphene.Field(FeaturesType)

    @staff_member_required
    @login_required
    def mutate(self, info, data):
        try:
            if data.name == "":
                return CreateFeatureMutation(ok=False, error=Error.NOT_VALID_FEATURE.value)
            feature_object = FeaturesModel.objects.create(name=data.get('name'))
            return CreateFeatureMutation(ok=True, feature=feature_object)
        except:
            return CreateFeatureMutation(ok=False, error=Error.CREATE_FEATURE_ERROR.value)


class UpdateFeatureMutation(graphene.Mutation):
    class Arguments:
        feature_id = graphene.ID(required=True)
        data = FeatureInput(required=True)

    Output = Return

    @staff_member_required
    def mutate(self, info, feature_id, data):
        if data.name == "":
            return Return(ok=False, error=Error.NOT_VALID_FEATURE.value)
        feature_object = Node.get_node_from_global_id(info, feature_id)
        if not feature_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        try:
            feature_object.name = data.name
            feature_object.save()
            return Return(ok=True)
        except:
            return Return(ok=False, error=Error.UPDATE_FEATURE_ERROR.value)


class DeleteFeatureMutation(graphene.Mutation):
    class Arguments:
        feature_id = graphene.ID(required=True)

    Output = Return

    @staff_member_required
    def mutate(self, info, feature_id):
        feature_object = Node.get_node_from_global_id(info, feature_id)
        if not feature_object:
            return Return(ok=False, error=Error.NO_RECURSE.value)
        try:
            feature_object.delete()
            return Return(ok=True)
        except:
            return Return(ok=False, error=Error.DELETE_FEATURE_ERROR.value)


class PayInvoiceMutation(graphene.Mutation):
    class Arguments:
        invoice_id = graphene.ID(required=True)
    
    ok = graphene.Boolean()
    error = graphene.String()
    invoice = graphene.Field(StripeInvoiceType)

    def mutate(self, info, invoice_id):
        if info.context.user.is_staff:
            return PayInvoiceMutation(ok=False)
        inv = Invoice.objects.get(id=invoice_id)
        if inv.customer.id != info.context.user.customer.id:
            return PayInvoiceMutation(ok=False)
        try:
            stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
            inv_pay = stripe.Invoice.pay(invoice_id)
            subscription_obj = stripe.Subscription.retrieve(inv_pay.subscription)
            djstripe.models.Subscription.sync_from_stripe_data(subscription_obj)
            inv_obj = stripe.Invoice.retrieve(invoice_id)
            Invoice.sync_from_stripe_data(inv_obj)
            invoice_obj = Invoice.objects.get(id=invoice_id)
            if invoice_obj.status != "paid":
                return PayInvoiceMutation(ok=False, invoice=invoice_obj)
            return PayInvoiceMutation(ok=True, invoice=invoice_obj)
        except:
            try:
                inv_obj = stripe.Invoice.retrieve(invoice_id)
                Invoice.sync_from_stripe_data(inv_obj)
                subscription_obj = stripe.Subscription.retrieve(inv_obj.subscription)
                djstripe.models.Subscription.sync_from_stripe_data(subscription_obj)
                invoice_obj = Invoice.objects.get(id=invoice_id)
                return PayInvoiceMutation(ok=False, error=Error.PAY_INVOICE_ERROR.value, invoice=invoice_obj)
            except:
                return PayInvoiceMutation(ok=False, error=Error.PAY_INVOICE_ERROR.value)
