# Generated by Django 3.1.3 on 2021-10-21 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0019_template_snack'),
    ]

    operations = [
        migrations.CreateModel(
            name='Config',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('limit', models.IntegerField()),
            ],
        ),
    ]