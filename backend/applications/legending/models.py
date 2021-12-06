import uuid

from applications.users.models import Role
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from model_utils import Choices


class Question(models.Model):
    """
    Вопрос
    """
    # Текст вопроса
    text = models.TextField(null=False)

    # Минимальное кол-во ответов
    min_answers = models.IntegerField(default=7)

    # Версия (усечённая = True/неусечённая = False)
    version = models.BooleanField(verbose_name='Бесплатная версия', default=False)

    class Meta:
        verbose_name = '[Question] Вопрос'
        verbose_name_plural = '[Question] Вопросы'

    def __str__(self):
        return self.text


class Check(models.Model):
    """
    Проверка ответа
    """
    WORD_NUMBERS_KEY = "WORDS"
    SPEECH_TYPE_KEY = "SPEECH"

    MIN_WORD_NUMBERS = "min"
    MAX_WORD_NUMBERS = "max"

    NOUN_SPEECH = 'NOUN'
    ADJF_SPEECH = 'ADJF'
    ADJS_SPEECH = 'ADJS'
    COMP_SPEECH = 'COMP'
    VERB_SPEECH = 'VERB'
    INFN_SPEECH = 'INFN'
    PRTF_SPEECH = 'PRTF'
    PRTS_SPEECH = 'PRTS'
    GRND_SPEECH = 'GRND'
    NUMR_SPEECH = 'NUMR'
    ADVB_SPEECH = 'ADVB'
    NPRO_SPEECH = 'NPRO'
    PRED_SPEECH = 'PRED'
    PREP_SPEECH = 'PREP'
    CONJ_SPEECH = 'CONJ'
    PRCL_SPEECH = 'PRCL'
    INTJ_SPEECH = 'INTJ'

    CONDITION_KEY_CHOICES = Choices(
        (WORD_NUMBERS_KEY, 'Колличество слов в ответе'),
        (SPEECH_TYPE_KEY, 'Часть речи слова')
    )

    WORD_NUMBERS_VALUE_CHOICES = Choices(
        (MIN_WORD_NUMBERS, "Минимальное кол-во слов в ответе"),
        (MAX_WORD_NUMBERS, "Максимальное кол-во слов в ответе")
    )

    SPEECH_VALUE_CHOICES = Choices(
        (NOUN_SPEECH, "Существительное"),
        (ADJF_SPEECH, "Прилагательное (полное)"),
        (ADJS_SPEECH, "Прилагательно (краткое)"),
        (COMP_SPEECH, "Компаратив"),
        (VERB_SPEECH, "Глагол (личная форма)"),
        (INFN_SPEECH, "Глагол (инфинитив)"),
        (PRTF_SPEECH, "Причастие (полное)"),
        (PRTS_SPEECH, "Причастие (краткое)"),
        (GRND_SPEECH, "Деепричастие"),
        (NUMR_SPEECH, "Числительное"),
        (ADVB_SPEECH, "Наречие"),
        (NPRO_SPEECH, "Местоимение-существительно"),
        (PRED_SPEECH, "Предикатив"),
        (PREP_SPEECH, "Предлог"),
        (CONJ_SPEECH, "Союз"),
        (PRCL_SPEECH, "Частица"),
        (INTJ_SPEECH, "Междометие"),

    )
    # Вопрос
    question = models.ManyToManyField('Question', blank=True, related_name='checks', default=list())
    # Новость
    news = models.ManyToManyField('News', blank=True, related_name='checks', default=list())
    # Элементы
    elements = models.ManyToManyField('NewsElement', blank=True, related_name='checks', default=list())
    # Условие проверки ответа
    condition = JSONField(null=False)

    class Meta:
        verbose_name = '[Check] Ответ'
        verbose_name_plural = '[Check] Ответы'

    def __str__(self):
        return self.condition


class Event(models.Model):
    """
    Событие
    """
    # Название
    title = models.ForeignKey('Title', null=False,
                              on_delete=models.CASCADE,
                              related_name='events')

    like = models.BooleanField(default=True, null=False)
    # Выбранные для удаления
    delete = models.BooleanField(default=False, null=False)

    # Описание
    description = models.ForeignKey('Text', null=False,
                                    on_delete=models.CASCADE,
                                    related_name='events')

    # Начало события
    start = models.DateTimeField(null=False)

    # Конец события
    end = models.DateTimeField(null=False)

    # Указатель типа события, называется так, чтобы сразу кормить его календарю на фронте
    color = JSONField(null=False)

    # Пользователь
    user = models.ForeignKey('users.User', null=False,
                             on_delete=models.CASCADE,
                             related_name='events')

    comment = models.TextField(null=False, default='', blank=True)

    status = models.IntegerField(null=False, default=0)

    class Meta:
        verbose_name = '[Event] Событие'
        verbose_name_plural = '[Event] События'

    def __str__(self):
        return '%d, %s, %s' % (self.id, self.title, self.user)


class Template(models.Model):
    """
    Шаблон
    """
    # Строка
    text = models.TextField(null=False)
    # роль
    role = models.ForeignKey(Role, null=True, on_delete=models.SET_NULL)
    # Версия (усечённая = true, неусеченная = false)
    version = models.BooleanField(verbose_name='Бесплатная версия', default=False)
    # Для генерации новости
    news = models.BooleanField(default=False)
    # Количество одобрений
    count_true_ratings = models.IntegerField(default=0)
    # Общее количество оцениваний
    count_all_ratings = models.IntegerField(default=0)

    class Meta:
        verbose_name = '[Template] Шаблон'
        verbose_name_plural = '[Template] Шаблоны'

    def __str__(self):
        return '(%d) %s' % (self.id, self.text)


class Title(models.Model):
    """
    Заголовок
    """

    # Строка
    text = models.TextField(null=False)

    # Шаблон
    template = models.ForeignKey('Template', null=False,
                                 on_delete=models.CASCADE,
                                 related_name='sentences')

    status = models.BooleanField(default=False)

    # Пользователь
    user = models.ForeignKey('users.User', null=False,
                             on_delete=models.CASCADE,
                             related_name='sentences')

    class Meta:
        verbose_name = '[Title] Заголовок'
        verbose_name_plural = '[Title] Заголовки'

    def __str__(self):
        return '%s' % self.text


class Text(models.Model):
    """
    Текст
    """

    # Строка
    text = models.TextField(null=False)

    class Meta:
        verbose_name = '[Text] Шаблон текста'
        verbose_name_plural = '[Text] Шаблоны текстов'

    def __str__(self):
        return '%s' % self.text


class AnswersQueue(models.Model):
    """
    Очередь ответов
    """
    # Ответы
    answers = ArrayField(models.TextField(), blank=True)
    # Вопрос
    question = models.ForeignKey('Question', null=False,
                                 on_delete=models.CASCADE,
                                 related_name='answers_queues')
    # Пользователь
    user = models.ForeignKey('users.User', null=False,
                             on_delete=models.CASCADE,
                             related_name='answers_queues')

    class Meta:
        verbose_name = '[AnswersQueue] Очередь ответов'
        verbose_name_plural = '[AnswersQueue] Очереди ответов'


class Character(models.Model):
    """
    Персонажи
    """
    # Имя
    character_name = models.CharField(null=False, blank=False, max_length=100)

    # Пол
    gender = models.CharField(null=False, blank=False, max_length=10)

    # Ссылка на аватар
    link_to_the_profile_photo = models.CharField(null=False, blank=False, max_length=150)

    def __str__(self):
        return '%s' % self.character_name

    class Meta:
        verbose_name = '[Characters] Персонажи'
        verbose_name_plural = '[Characters] Персонажи'


class CharacterSelection(models.Model):
    """
    Выбор персонажа под роль
    """
    # Выбор персонажа
    character_name = models.ForeignKey(Character, verbose_name='Выберите персонажа', on_delete=models.SET_NULL,
                                       null=True)
    # Выбор роли
    role = models.ForeignKey(Role, verbose_name='Роль', null=True, on_delete=models.SET_NULL)

    # Выбор вопроса
    question = models.ForeignKey(Question, verbose_name='Вопрос', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return '%s, %s, %s' % (self.character_name, self.question.id, self.role)

    class Meta:
        verbose_name = '[Selected characters] Выбранные персонажи'
        verbose_name_plural = '[Character Selection] Выбор персонажа'


class Answer(models.Model):
    """
    Ответ
    """
    # Вопрос
    question = models.ForeignKey('Question', null=False, on_delete=models.CASCADE, related_name='answers')
    # Пользователь
    user = models.ForeignKey('users.User', null=False, on_delete=models.CASCADE, related_name='answers')
    # Текст ответа
    text = models.TextField(null=False)

    def __str__(self):
        return "%s (%s)" % (self.text, self.id)

    class Meta:
        verbose_name = '[Answer] Ответ'
        verbose_name_plural = '[Answer] Ответы'


class News(models.Model):
    """
    Новости
    """
    # Новость
    description = models.TextField(null=True, blank=True)
    # Минимальное кол-во ответов
    min_elements = models.IntegerField(default=1)
    # пользователь
    user = models.ForeignKey('users.User', null=False,
                             on_delete=models.CASCADE,
                             related_name='news')
    # вопрос
    question = models.ForeignKey('Question', null=False, blank=False,
                                 on_delete=models.CASCADE,
                                 related_name='news')

    def __str__(self):
        return "%d" % self.id

    class Meta:
        verbose_name = '[News] Новость'
        verbose_name_plural = '[News] Новости'


class NewsElement(models.Model):
    """
    Элемент новости
    """
    # Элемент (ответ)
    text = models.TextField(null=True)
    # Новость
    news = models.ForeignKey(News, null=False, blank=False,
                             on_delete=models.CASCADE,
                             related_name='elements')
    # Пользователь
    user = models.ForeignKey('users.User', null=False,
                             on_delete=models.CASCADE,
                             related_name='elements')
    # количество текущих элементов за 1 сессию
    count = models.IntegerField(default=0)

    def __str__(self):
        return "%s" % self.text

    def __unicode__(self):
        return self.text

    class Meta:
        verbose_name = '[NewsElement] Элемент'
        verbose_name_plural = '[NewsElements] Элементы'


class Rate(models.Model):
    """
    Тариф
    """
    # Тариф
    text = models.TextField(null=False)

    # Цена
    price = models.IntegerField(null=False)

    def __str__(self):
        return "%s" % self.text

    def __unicode__(self):
        return self.text

    class Meta:
        verbose_name = '[Rate] Тариф'
        verbose_name_plural = '[Rates] Тарифы'


class Voucher(models.Model):
    """
    Купоны, активирующие подписку на 1 месяц
    """
    DEFAULT_VOUCHER = ""
    # текст промокода
    title = models.CharField(max_length=6, null=False)

    # Дата активации
    date_activation = models.DateTimeField(null=True)

    # Пользователь, который активировал
    user = models.ForeignKey('users.User', null=True,
                             on_delete=models.CASCADE,
                             related_name='voucher')

    def __str__(self):
        return "%s" % self.title

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = '[Voucher] Купон'
        verbose_name_plural = '[Vouchers] Купоны'


class Order(models.Model):
    """
    Заказ
    """
    # UUID
    unique_id = models.UUIDField(default=uuid.uuid4,
                                 editable=True,
                                 unique=True)
    # Пользователь
    user = models.OneToOneField('users.User', null=False,
                                on_delete=models.CASCADE,
                                related_name='date_end')
    # Тариф
    rate = models.ForeignKey(Rate,
                             on_delete=models.CASCADE,
                             related_name='order')

    # Используется voucher
    voucher = models.BooleanField(default=False)

    # Дата создания оплаты
    date_start = models.DateTimeField(auto_now_add=True)

    # Дата окончания оплаты
    date_end = models.DateTimeField(null=True)

    # Статус оплаты
    status = models.BooleanField(default=False)

    def __str__(self):
        return "(%d) %s, %s" % (self.id, self.user, self.status)

    class Meta:
        verbose_name = '[Order] Подписка'
        verbose_name_plural = '[Orders] Подписки'


class Statistics(models.Model):
    """
    Статистика
    """
    role_blogger = models.IntegerField(default=0)

    role_expert = models.IntegerField(default=0)

    role_seller = models.IntegerField(default=0)

    count_users = models.IntegerField(default=0)

    count_orders_all = models.IntegerField(default=0)

    user = models.ForeignKey('users.User', null=True,
                             on_delete=models.CASCADE,
                             related_name='statistics')

    events = models.ForeignKey(Event, null=True, on_delete=models.SET_NULL, related_name='stats')

    class Meta:
        verbose_name = '[Statistics] Статистика'
        verbose_name_plural = '[Statistics] Статистика'


class Support(models.Model):
    """
    Поддержка
    """
    # email юзера, на который ответить пользователю
    email = models.EmailField()

    # тема обращения
    subject = models.CharField(max_length=50, null=True)

    # текст обращения
    text = models.TextField(null=False)

    user = models.ForeignKey('users.User', null=False, on_delete=models.CASCADE, related_name='support')

    def __str__(self):
        return "(%d) %s, %s" % (self.id, self.user.username, self.text)

    def __unicode__(self):
        return self.text


    class Meta:
        verbose_name = '[Support] Поддержка'
        verbose_name_plural = '[Support] Обращения пользователей'
