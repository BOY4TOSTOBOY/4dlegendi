# Generated by Django 3.0.2 on 2021-11-15 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('legending', '0006_auto_20211115_1526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='voucher',
            field=models.BooleanField(default=False),
        ),
    ]
