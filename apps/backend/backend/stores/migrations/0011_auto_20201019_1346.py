# Generated by Django 3.1.2 on 2020-10-19 13:46

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("stores", "0010_auto_20201019_1209"),
    ]

    operations = [
        migrations.AlterField(
            model_name="build",
            name="build_id",
            field=models.UUIDField(
                default=uuid.UUID("cb725771-3d9c-4729-9b10-44ccf7902d4b")
            ),
        ),
    ]