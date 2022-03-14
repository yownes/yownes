# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class AccountStatus(models.TextChoices):
    REGISTERED = "REGISTERED"
    PAID_ACCOUNT = "PAID ACCOUNT"
    WAITING_PAYMENT = "WAITING PAYMENT"
    BANNED = "BANNED"


class Account(AbstractUser):
    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")
    account_status = models.CharField(
        max_length=15,
        default=AccountStatus.REGISTERED,
        choices=AccountStatus.choices,
    )
    logo = models.ImageField(upload_to="user_logos/", blank=True, null=True)

    customer = models.ForeignKey(
        "djstripe.Customer",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text="The user's Stripe Customer object, if it exists",
    )
    subscription = models.ForeignKey(
        "djstripe.Subscription",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text="The user's Stripe Subscription object, if it exists",
    )

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    def __str__(self):
        return f"[{self.account_status}] {self.username} - {self.email}"
