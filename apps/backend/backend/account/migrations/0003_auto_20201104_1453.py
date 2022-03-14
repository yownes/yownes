# Generated by Django 3.1.2 on 2020-11-04 14:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("djstripe", "0006_2_3"),
        ("account", "0002_auto_20200917_1623"),
    ]

    operations = [
        migrations.AddField(
            model_name="account",
            name="customer",
            field=models.ForeignKey(
                blank=True,
                help_text="The user's Stripe Customer object, if it exists",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="djstripe.customer",
            ),
        ),
        migrations.AddField(
            model_name="account",
            name="subscription",
            field=models.ForeignKey(
                blank=True,
                help_text="The user's Stripe Subscription object, if it exists",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="djstripe.subscription",
            ),
        ),
    ]
