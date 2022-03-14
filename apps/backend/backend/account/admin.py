from django.contrib import admin
from graphql_auth.models import UserStatus

# Register your models here.
from .models import Account

admin.site.register(Account)
admin.site.register(UserStatus)
