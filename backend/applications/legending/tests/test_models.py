from django.test import TestCase

from applications.legending.models import *
from applications.users.models import *


class QuestionModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.question = Question.objects.create(text="1. ")

    def test_text_label(self):
        question = self.question
        text = question._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')

    def test_min_answers_label(self):
        question = self.question
        min_answers = question._meta.get_field('min_answers').verbose_name
        self.assertEquals(min_answers, 'min answers')

    def test_version_label(self):
        question = self.question
        version = question._meta.get_field('version').verbose_name
        self.assertEquals(version, 'Бесплатная версия')


class CheckModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.check = Check.objects.create(condition="{\"WORDS\": {\"min\": 1, \"max\": 1}}")

    def test_question_label(self):
        y1 = self.check
        question = y1._meta.get_field('question').verbose_name
        self.assertEquals(question, 'question')

    def test_news_label(self):
        y1 = self.check
        news = y1._meta.get_field('news').verbose_name
        self.assertEquals(news, 'news')

    def test_elements_label(self):
        y1 = self.check
        elements = y1._meta.get_field('elements').verbose_name
        self.assertEquals(elements, 'elements')

    def test_condition_label(self):
        y1 = self.check
        condition = y1._meta.get_field('condition').verbose_name
        self.assertEquals(condition, 'condition')


class AnswerModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.question = Question.objects.create(text="1. ")
        cls.answer = Answer.objects.create(text="test", question=cls.question, user=cls.user)

    def test_question_label(self):
        y1 = self.answer
        question = y1._meta.get_field('question').verbose_name
        self.assertEquals(question, 'question')

    def test_user_label(self):
        y1 = self.answer
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')

    def test_text_label(self):
        y1 = self.answer
        text = y1._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')


class AnswersQueueModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.question = Question.objects.create(text="1. ")
        cls.answerqueue = AnswersQueue.objects.create(answers=[],
                                                      question=cls.question,
                                                      user=cls.user)

    def test_answers_label(self):
        y1 = self.answerqueue
        answers = y1._meta.get_field('answers').verbose_name
        self.assertEquals(answers, 'answers')

    def test_question_label(self):
        y1 = self.answerqueue
        question = y1._meta.get_field('question').verbose_name
        self.assertEquals(question, 'question')

    def test_user_label(self):
        y1 = self.answerqueue
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')


class CharacterModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.character = Character.objects.create(character_name='Test', gender='Мужской',
                                                 link_to_the_profile_photo='/assets/images/philo/Ali.png' )

    def test_character_name_label(self):
        y1 = self.character
        character_name = y1._meta.get_field('character_name').verbose_name
        self.assertEquals(character_name, 'character name')

    def test_gender_label(self):
        y1 = self.character
        gender = y1._meta.get_field('gender').verbose_name
        self.assertEquals(gender, 'gender')

    def test_link_to_the_profile_photo_label(self):
        y1 = self.character
        link_to_the_profile_photo = y1._meta.get_field('link_to_the_profile_photo').verbose_name
        self.assertEquals(link_to_the_profile_photo, 'link to the profile photo')

    def test_character_name_max_length_label(self):
        y1 = self.character
        max_length = y1._meta.get_field('character_name').max_length
        self.assertEquals(max_length, 100)

    def test_gender_max_length_label(self):
        y1 = self.character
        max_length = y1._meta.get_field('gender').max_length
        self.assertEquals(max_length, 10)

    def test_link_to_the_profile_photo_max_length_label(self):
        y1 = self.character
        max_length = y1._meta.get_field('link_to_the_profile_photo').max_length
        self.assertEquals(max_length, 150)


class CharacterSelectionModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.question = Question.objects.create(text="1. ")
        cls.character = Character.objects.create(character_name='Test', gender='Мужской',
                                                 link_to_the_profile_photo='/assets/images/philo/Ali.png')
        cls.selection = CharacterSelection.objects.create(character_name=cls.character,
                                                          role=cls.role,
                                                          question=cls.question)

    def test_character_name_label(self):
        y1 = self.selection
        character_name = y1._meta.get_field('character_name').verbose_name
        self.assertEquals(character_name, 'Выберите персонажа')

    def test_role_label(self):
        y1 = self.selection
        role = y1._meta.get_field('role').verbose_name
        self.assertEquals(role, 'Роль')

    def test_question_label(self):
        y1 = self.selection
        question = y1._meta.get_field('question').verbose_name
        self.assertEquals(question, 'Вопрос')


class EventModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.template = Template.objects.create(text='test', role=cls.role)
        cls.title = Title.objects.create(text='Test',
                                         template=cls.template,
                                         user=cls.user)
        cls.text = Text.objects.create(text='Test')
        cls.event = Event.objects.create(start=datetime.now(),
                                         end=datetime.now(),
                                         color="red",
                                         description=cls.text,
                                         title=cls.title,
                                         user=cls.user)

    def test_title_label(self):
        y1 = self.event
        title = y1._meta.get_field('title').verbose_name
        self.assertEquals(title, 'title')

    def test_like_label(self):
        y1 = self.event
        like = y1._meta.get_field('like').verbose_name
        self.assertEquals(like, 'like')

    def test_description_label(self):
        y1 = self.event
        description = y1._meta.get_field('description').verbose_name
        self.assertEquals(description, 'description')

    def test_start_label(self):
        y1 = self.event
        start = y1._meta.get_field('start').verbose_name
        self.assertEquals(start, 'start')

    def test_end_label(self):
        y1 = self.event
        end = y1._meta.get_field('end').verbose_name
        self.assertEquals(end, 'end')

    def test_color_label(self):
        y1 = self.event
        color = y1._meta.get_field('color').verbose_name
        self.assertEquals(color, 'color')

    def test_user_label(self):
        y1 = self.event
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')

    def test_comment_label(self):
        y1 = self.event
        comment = y1._meta.get_field('comment').verbose_name
        self.assertEquals(comment, 'comment')

    def test_status_label(self):
        y1 = self.event
        status = y1._meta.get_field('status').verbose_name
        self.assertEquals(status, 'status')


class TemplateModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.template = Template.objects.create(text='Test', role=cls.role, version=True)

    def test_text_label(self):
        y1 = self.template
        text = y1._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')

    def test_role_label(self):
        y1 = self.template
        role = y1._meta.get_field('role').verbose_name
        self.assertEquals(role, 'role')

    def test_version_label(self):
        y1 = self.template
        version = y1._meta.get_field('version').verbose_name
        self.assertEquals(version, 'Бесплатная версия')


class TitleModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.template = Template.objects.create(text='Test',
                                               role=cls.role,
                                               version=True)
        cls.title = Title.objects.create(text='Test',
                                         template=cls.template,
                                         user=cls.user)

    def test_text_label(self):
        y1 = self.title
        text = y1._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')

    def test_template_label(self):
        y1 = self.title
        template = y1._meta.get_field('template').verbose_name
        self.assertEquals(template, 'template')

    def test_user_label(self):
        y1 = self.title
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')


class TextModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.text = Text.objects.create(text='Test')

    def test_text_label(self):
        y1 = self.text
        text = y1._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')


class NewsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.question = Question.objects.create(text="1. ")
        cls.new = News.objects.create(user=cls.user, question=cls.question)

    def test_news_label(self):
        y1 = self.new
        news = y1._meta.get_field('description').verbose_name
        self.assertEquals(news, 'description')

    def test_min_elements_label(self):
        y1 = self.new
        min_elements = y1._meta.get_field('min_elements').verbose_name
        self.assertEquals(min_elements, 'min elements')

    def test_user_label(self):
        y1 = self.new
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')

    def test_question_label(self):
        y1 = self.new
        question = y1._meta.get_field('question').verbose_name
        self.assertEquals(question, 'question')


class NewsElementModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.question = Question.objects.create(text="1. ")
        cls.news = News.objects.create(user=cls.user, question=cls.question)
        cls.element = NewsElement.objects.create(text="тест",
                                                 news=cls.news,
                                                 user=cls.user)

    def test_news_label(self):
        y1 = self.element
        news = y1._meta.get_field('news').verbose_name
        self.assertEquals(news, 'news')

    def test_text_label(self):
        y1 = self.element
        text = y1._meta.get_field('text').verbose_name
        self.assertEquals(text, 'text')

    def test_user_label(self):
        y1 = self.element
        user = y1._meta.get_field('user').verbose_name
        self.assertEquals(user, 'user')

    def test_count_label(self):
        y1 = self.element
        count = y1._meta.get_field('count').verbose_name
        self.assertEquals(count, 'count')


class RateModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.rate = Rate.objects.create(text='Тариф', price=5000)

    def test_text_label(self):
        y1 = self.rate
        obj = y1._meta.get_field('text').verbose_name
        self.assertEquals(obj, 'text')

    def test_price_label(self):
        y1 = self.rate
        obj = y1._meta.get_field('price').verbose_name
        self.assertEquals(obj, 'price')


class OrderModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.role = Role.objects.create(name='test')
        cls.user = User.objects.create(email='test@mail.ru', role=cls.role)
        cls.rate = Rate.objects.create(text='Тариф', price=5000)
        cls.order = Order.objects.create(rate=cls.rate, user=cls.user)

    def test_unique_id_label(self):
        y1 = self.order
        obj = y1._meta.get_field('unique_id').verbose_name
        self.assertEquals(obj, 'unique id')

    def test_user_label(self):
        y1 = self.order
        obj = y1._meta.get_field('user').verbose_name
        self.assertEquals(obj, 'user')

    def test_rate_label(self):
        y1 = self.order
        obj = y1._meta.get_field('rate').verbose_name
        self.assertEquals(obj, 'rate')

    def test_date_start_label(self):
        y1 = self.order
        obj = y1._meta.get_field('date_start').verbose_name
        self.assertEquals(obj, 'date start')

    def test_date_end_label(self):
        y1 = self.order
        obj = y1._meta.get_field('date_end').verbose_name
        self.assertEquals(obj, 'date end')

    def test_status_label(self):
        y1 = self.order
        obj = y1._meta.get_field('status').verbose_name
        self.assertEquals(obj, 'status')
