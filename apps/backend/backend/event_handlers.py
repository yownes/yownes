import djstripe
import logging
import stripe
from django.core.mail import send_mail
from django.template.loader import render_to_string
from djstripe import webhooks

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
                #TODO: vencida caducada fallo en la renovacion (enviar mail)
                send_mail(
                    '[Yownes] Suscripción vencida',
                    'Fallo en la renovación de tu suscripción.',
                    'ywns.test1@gmail.com',
                    [account_object.email],
                    fail_silently=False,
                    html_message=render_to_string("custom/invoice_past_due.html", { "username": account_object.username })
                )
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
                #TODO: caducada, no se pago en las primeras 23h desde alta (enviar mail)
                send_mail(
                    '[Yownes] Suscripción caducada',
                    'No se completó el pago inicial.',
                    'ywns.test1@gmail.com',
                    [account_object.email],
                    fail_silently=False,
                    html_message=render_to_string("custom/invoice_incomplete_expired.html", { "username": account_object.username })
                )
            if prev_subscription_object["status"] == "incomplete" and subscription_object["status"] == "active":
                logging.warning("INCOMPLETE --> ACTIVE")
                if account_object.account_status != AccountStatus.BANNED:
                    logging.warning("No está ban, poner en PAID_ACCOUNT")
                    account_object.account_status = AccountStatus.PAID_ACCOUNT
                    account_object.save()
                else:
                    logging.warning("Está ban, mantener BAN")
        
    logging.warning(subscription_id)
    logging.warning(subscription)
    logging.warning("< < OK CUSTOMER SUSCRIPTION UPDATED WEBHOOK > >")
