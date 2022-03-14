import djstripe
import logging
import stripe
from django.http import HttpResponse
from djstripe import webhooks
from graphene.relay import Node

@webhooks.handler("charge.succeeded")
def charge_succeeded_webhook(event, **kwargs):
    logging.warning("< < CHARGE SUCCEEDED WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    data = event.data.get("object", {})
    logging.warning(data)
    logging.warning("< < OK CHARGE SUCCEEDED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("customer.subscription.created")
def customer_subscription_created_webhook(event, **kwargs):
    logging.warning("< < CUSTOMER SUSCRIPTION CREATED WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    data = event.data.get("object", {})
    logging.warning(data)
    subscription_object = event.data.get("object", {})
    subscription_status = subscription_object.get("status")
    customer_id = subscription_object.get("customer")
    subscription_id = subscription_object.get("id")
    from .account.models import Account
    from backend.account.models import AccountStatus
    customer_object = djstripe.models.Customer.objects.filter(id=customer_id)
    account_object = Account.objects.get(customer=customer_object[0])
    if subscription_status == "active":
        if account_object.account_status != AccountStatus.BANNED:
            account_object.account_status = AccountStatus.PAID_ACCOUNT
            account_object.save()
    if subscription_status == "incomplete_expired":
        if account_object.account_status != AccountStatus.BANNED:
            account_object.account_status = AccountStatus.REGISTERED
            account_object.save()
    logging.warning("< < OK CUSTOMER SUSCRIPTION CREATED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("customer.subscription.deleted")
def customer_subscription_deleted_webhook(event, **kwargs):
    logging.warning("< < CUSTOMER SUSCRIPTION DELETED WEBHOOK > >")
    subscription_object = event.data.get("object", {})
    customer_id = subscription_object.get("customer")
    subscription_id = subscription_object.get("id")
    stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
    from .account.models import Account
    from backend.account.models import AccountStatus
    customer_object = djstripe.models.Customer.objects.filter(id=customer_id)
    account_object = Account.objects.get(customer=customer_object[0])
    logging.warning("%s %s %s %s %s %s", customer_id, subscription_id, subscription_object, customer_object, account_object, account_object.subscription)
    logging.warning(account_object.subscription.id)
    if subscription_id == account_object.subscription.id:
        logging.warning(account_object.account_status)
        if account_object.account_status != AccountStatus.BANNED:
            logging.warning("No está ban, poner en REGISTERED")
            account_object.account_status = AccountStatus.REGISTERED
        else:
            logging.warning("Está ban, mantener BAN")
        account_object.subscription = None
        account_object.save()
    logging.warning(subscription_id)
    logging.warning("< < OK CUSTOMER SUSCRIPTION DELETED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("customer.subscription.updated")
def customer_subscription_updated_webhook(event, **kwargs):
    logging.warning("< < CUSTOMER SUSCRIPTION UPDATED WEBHOOK > >")
    subscription_object = event.data.get("object", {})
    customer_id = subscription_object.get("customer")
    subscription_id = subscription_object.get("id")
    stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
    subscription_obj = stripe.Subscription.retrieve(subscription_id)
    subscription = djstripe.models.Subscription.sync_from_stripe_data(subscription_obj)
    customer_object = djstripe.models.Customer.objects.filter(id=customer_id)
    from .account.models import Account
    from backend.account.models import AccountStatus
    account_object = Account.objects.get(customer=customer_object[0])
    if subscription_id == account_object.subscription.id:
        prev_subscription_object = event.data.get("previous_attributes", {})
        logging.warning("OBJ %s --> %s", prev_subscription_object, subscription_object)
        if "status" in prev_subscription_object:
            logging.warning("PREV_STATUS --> %s", prev_subscription_object["status"])
            logging.warning("CURRENT_STATUS --> %s", subscription_object["status"])
            if prev_subscription_object["status"] == "active" and subscription_object["status"] == "past_due":
                logging.warning("ACTIVE --> PAST_DUE")
            if prev_subscription_object["status"] == "past_due" and subscription_object["status"] == "incomplete_expired":
                logging.warning("PAST_DUE --> INCOMPLETE_EXPIRED")
                if account_object.account_status != AccountStatus.BANNED:
                    logging.warning("No está ban, poner en REGISTERED")
                    account_object.account_status = AccountStatus.REGISTERED
                else:
                    logging.warning("Está ban, mantener BAN")
                account_object.subscription = None
                account_object.save()
            if prev_subscription_object["status"] == "incomplete" and subscription_object["status"] == "incomplete_expired":
                logging.warning("INCOMPLETE --> INCOMPLETE_EXPIRED")
                if account_object.account_status != AccountStatus.BANNED:
                    logging.warning("No está ban, poner en REGISTERED")
                    account_object.account_status = AccountStatus.REGISTERED
                else:
                    logging.warning("Está ban, mantener BAN")
                account_object.subscription = None
                account_object.save()
            if prev_subscription_object["status"] == "incomplete" and subscription_object["status"] == "active":
                logging.warning("INCOMPLETE --> ACTIVE")
        
    logging.warning(subscription_id)
    logging.warning(subscription)
    logging.warning("< < OK CUSTOMER SUSCRIPTION UPDATED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("customer.source.created")
def customer_source_created_webhook(event, **kwargs):
    logging.warning("< < CUSTOMER SOURCE CREATED WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    subscription_object = event.data.get("object", {})
    customer_id = subscription_object.get("customer")
    stripe.api_key = djstripe.settings.STRIPE_SECRET_KEY
    from .account.models import Account
    from backend.account.models import AccountStatus
    customer_object = djstripe.models.Customer.objects.filter(id=customer_id)
    account_object = Account.objects.get(customer=customer_object[0])
    logging.warning(account_object)
    account_object.account_status = AccountStatus.REGISTERED
    account_object.save()
    logging.warning(account_object)
    logging.warning("< < OK CUSTOMER SOURCE CREATED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("customer.source.expiring")
def customer_source_expiring_webhook(event, **kwargs):
    logging.warning("< < CUSTOMER SOURCE EXPIRING WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    logging.warning("< < OK CUSTOMER SOURCE EXPIRING WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("invoice")
def invoice_webhook(event, **kwargs):
    logging.warning("< < INVOICE WEBHOOK > >")
    logging.warning(event)
    logging.warning(event.data["object"])
    logging.warning(kwargs)
    logging.warning("< < END INVOICE WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("issuing_card.created")
def issuing_card_created_webhook(event, **kwargs):
    logging.warning("< < ISSUING CARD CREATED WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    logging.warning("< < OK ISSUING CARD CREATED WEBHOOK > >")
    # return HttpResponse(status=200)

@webhooks.handler("issuing_card.updated")
def issuing_card_updated_webhook(event, **kwargs):
    logging.warning("< < ISSUING CARD UPDATED WEBHOOK > >")
    logging.warning(event)
    logging.warning(kwargs)
    logging.warning("< < OK ISSUING CARD UPDATED WEBHOOK > >")
    # return HttpResponse(status=200)
