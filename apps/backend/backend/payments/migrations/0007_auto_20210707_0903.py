# Generated by Django 3.1.2 on 2021-07-07 09:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0006_auto_20210706_1152'),
    ]

    operations = [
        migrations.RenameField(
            model_name='featuresmodel',
            old_name='stripe_plan',
            new_name='stripe_product',
        ),
    ]