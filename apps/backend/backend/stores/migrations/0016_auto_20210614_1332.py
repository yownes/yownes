# Generated by Django 3.1.2 on 2021-06-14 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0015_storeapp_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='build',
            name='date',
            field=models.DateTimeField(blank=True, default='2020-06-10T11:00Z'),
        ),
    ]
