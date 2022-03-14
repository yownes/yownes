import uuid

from django.db import models


class BuildStatus(models.TextChoices):
    STALLED = "STALLED"
    QUEUED = "QUEUED"
    GENERATING = "GENERATING"
    UPLOADING = "UPLOADING"
    PUBLISHED = "PUBLISHED"
    WAITING = "WAITING"


class Build(models.Model):
    build_id = models.UUIDField(default=uuid.uuid4)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    build_status = models.CharField(
        max_length=15,
        default=BuildStatus.STALLED,
        choices=BuildStatus.choices,
    )
    app = models.ForeignKey(
        "StoreApp",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="builds",
    )

    def __str__(self):
        return f"[{self.build_status}] {self.build_id}"


class Template(models.Model):
    name = models.CharField(max_length=150)
    preview_img = models.ImageField(
        upload_to="template_previews/", blank=True, null=True
    )
    url = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Link to Git repository of the template",
    )
    is_active = models.BooleanField(default=True)
    snack = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Expo Snack ID",
    )

    def __str__(self):
        if self.url:
            return f"{self.name} - {self.url}"
        else:
            return f"{self.name} - (sin url)"


class PaymentMethod(models.Model):
    stripe_test_public = models.CharField(max_length=255)
    stripe_test_secret = models.CharField(max_length=255)
    stripe_prod_public = models.CharField(max_length=255)
    stripe_prod_secret = models.CharField(max_length=255)

    store_app = models.OneToOneField(
        "stores.StoreApp",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="payment_method",
    )

    def __str__(self):
        return f"[PaymentMethod] id={self.id}; store={self.store_app}"


class StoreApp(models.Model):
    name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to="store_logos/%Y/%m/%d/", blank=True, null=True)
    color = models.CharField(
        max_length=7, help_text="Color in HEX", blank=True, null=True
    )  # https://github.com/fabiocaccamo/django-colorfield/blob/master/README.md
    text_color = models.CharField(
        max_length=5, help_text="[black|white]", blank=True, null=True
    )
    api_link = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Link to GraphQl API of the store",
    )
    ios_link = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Link to Apple Store",
    )
    android_link = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Link to Goggle Play Store",
    )
    customer = models.ForeignKey(
        "account.Account",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="apps",
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="template",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "storeapp"
        verbose_name_plural = "storeapps"

    def __str__(self):
        if self.is_active is True:
            status = "activa"
        else:
            status = "eliminada"
        return f"[{status}] {self.name}"


class Config(models.Model):
    limit = models.IntegerField()

    def save(self):
        count = Config.objects.all().count()
        save_permission = Config.has_add_permission(self)
        
        if count < 2: # if there's more than one object it will not save them in the database
            super(Config, self).save()
        elif save_permission:
            super(Config, self).save()

    def has_add_permission(self):
        return Config.objects.filter(id=self.id).exists()

    def __str__(self):
        return f"Límite de builds en {self.limit}"