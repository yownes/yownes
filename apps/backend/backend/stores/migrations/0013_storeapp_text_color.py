# Generated by Django 3.1.2 on 2020-10-21 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("stores", "0012_auto_20201019_1347"),
    ]

    operations = [
        migrations.AddField(
            model_name="storeapp",
            name="text_color",
            field=models.CharField(
                blank=True, help_text="[black|white]", max_length=5, null=True
            ),
        ),
    ]
