# Generated by Django 3.0.2 on 2021-11-15 15:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('legending', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='title',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sentences', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='template',
            name='role',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.Role'),
        ),
        migrations.AddField(
            model_name='support',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='support', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='statistics',
            name='events',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stats', to='legending.Event'),
        ),
        migrations.AddField(
            model_name='statistics',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='statistics', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='order',
            name='rate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='legending.Rate'),
        ),
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='date_end', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='order',
            name='voucher',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='order', to='legending.Voucher'),
        ),
        migrations.AddField(
            model_name='newselement',
            name='news',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='legending.News'),
        ),
        migrations.AddField(
            model_name='newselement',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='news',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news', to='legending.Question'),
        ),
        migrations.AddField(
            model_name='news',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='description',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='legending.Text'),
        ),
        migrations.AddField(
            model_name='event',
            name='title',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='legending.Title'),
        ),
        migrations.AddField(
            model_name='event',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='check',
            name='elements',
            field=models.ManyToManyField(blank=True, default=[], related_name='checks', to='legending.NewsElement'),
        ),
        migrations.AddField(
            model_name='check',
            name='news',
            field=models.ManyToManyField(blank=True, default=[], related_name='checks', to='legending.News'),
        ),
        migrations.AddField(
            model_name='check',
            name='question',
            field=models.ManyToManyField(blank=True, default=[], related_name='checks', to='legending.Question'),
        ),
        migrations.AddField(
            model_name='characterselection',
            name='character_name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='legending.Character', verbose_name='Выберите персонажа'),
        ),
        migrations.AddField(
            model_name='characterselection',
            name='question',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='legending.Question', verbose_name='Вопрос'),
        ),
        migrations.AddField(
            model_name='characterselection',
            name='role',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.Role', verbose_name='Роль'),
        ),
        migrations.AddField(
            model_name='answersqueue',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers_queues', to='legending.Question'),
        ),
        migrations.AddField(
            model_name='answersqueue',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers_queues', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='legending.Question'),
        ),
        migrations.AddField(
            model_name='answer',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to=settings.AUTH_USER_MODEL),
        ),
    ]
