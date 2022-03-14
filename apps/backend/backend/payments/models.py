from django.db import models

class FeaturesModel(models.Model):
    stripe_product = models.ManyToManyField("djstripe.Product", related_name="features", blank=True) #, null=True
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Feature"
        verbose_name_plural = "Features"

    def __str__(self):
        return f"[{self.id}] {self.name}"
