# Generated by Django 3.1.1 on 2020-09-18 09:20

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("stores", "0008_auto_20200917_1649"),
    ]

    operations = [
        migrations.AlterField(
            model_name="build",
            name="build_id",
            field=models.UUIDField(
                default=uuid.UUID("22e9177d-b2af-4a09-9fbc-5e97e0849d1a")
            ),
        ),
    ]
