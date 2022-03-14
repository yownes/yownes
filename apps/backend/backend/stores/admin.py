from django.contrib import admin

from .models import Build, Config, PaymentMethod, StoreApp, Template


class PaymentMethodAdmin(admin.TabularInline):
    model = PaymentMethod
    extra = 0


class StoreAppAdmin(admin.ModelAdmin):
    inlines = [PaymentMethodAdmin]


admin.site.register(StoreApp, StoreAppAdmin)
admin.site.register(Template)
admin.site.register(Build)
admin.site.register(Config)