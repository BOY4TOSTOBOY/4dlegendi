from django.core.management import call_command
from django.test import TestCase

from django.contrib.auth.models import User

from applications.legending.api.views import *
from applications.users.models import *

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.utils.serializer_helpers import ReturnDict

client = APIClient()


class TextViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/texts', verbosity=0)
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/character_selection', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)

        cls.user = User.objects.get(id=1)

    # Получить все объекты (НЕавторизован)
    def test_get_text_queryset_un_auth(self):
        client.force_authenticate(user=None)
        response = client.get('/api/legending/templates/')
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Получить все объекты (Авторизован)
    def test_text_get_queryset(self):
        client.force_authenticate(user=self.user)
        response = client.get('/api/legending/templates/')
        count_dict = len(response.data)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(count_dict, 9)

    # Получить конкретный объект
    def test_get_a_specific_news_item(self):
        client.force_authenticate(user=self.user)
        response = client.get('/api/legending/templates/1/')
        raz = list()
        raz.append(response.data)
        count_dict = len(raz)
        self.assertEquals(count_dict, 1)


class QuestionViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/character_selection', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)

    # получить список вопросов
    def test_get_questions(self):
        response = client.get('/api/legending/questions/')
        count_dict = len(response.data)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(count_dict, 21)


class QuestionListForNewsViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/character_selection', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)

        cls.user1 = User.objects.get(id=1)

    # Попытка получить список вопросов для НЕ авторизованного юзера
    def test_get_question_list_un_auth(self):
        client.force_authenticate(user=None)
        response = client.get('/api/legending/questions_for_news/')
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Получить (бесплатная версия) список вопросов авторизованного юзера для конкретной роли
    def test_get_question_list_for_role_version_user1(self):
        client.force_authenticate(user=self.user1)
        response = client.get('/api/legending/questions_for_news/')
        self.assertEquals(response.status_code, status.HTTP_200_OK)


class QuestionViewTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.role = Role.objects.create(name='test2')
        cls.question = Question.objects.create(text="1. ")
        cls.character = Character.objects.create(character_name='Test', gender='Мужской',
                                                 link_to_the_profile_photo='/assets/images/philo/Ali.png')
        cls.selection1 = CharacterSelection.objects.create(character_name=cls.character,
                                                           role=cls.role,
                                                           question=cls.question)
        cls.selection2 = CharacterSelection.objects.create(character_name=cls.character,
                                                           role=cls.role,
                                                           question=cls.question)
        cls.selection3 = CharacterSelection.objects.create(character_name=cls.character,
                                                           role=cls.role,
                                                           question=cls.question)

    def test_get_questions(self):
        response = client.get('/api/legending/questions/')
        count_dict = len(response.data)
        list1 = list()
        if count_dict == 0:
            print('данные отсутствуют')
            resp1 = Response(status=status.HTTP_404_NOT_FOUND)
            self.assertEquals(resp1.status_code, status.HTTP_404_NOT_FOUND)
        for y1 in range(count_dict):
            list1.append(dict(response.data[y1]))

        if not list1:
            resp2 = Response(status=status.HTTP_404_NOT_FOUND)
            self.assertEquals(resp2.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEquals(response.status_code, status.HTTP_200_OK)


class AnswerViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/questions', verbosity=0)
        cls.role1 = Role.objects.create(name='test2')
        cls.user1 = User.objects.create(email='test@mail.ru',
                                        username='test',
                                        password='ibivob47',
                                        role=cls.role1)
        cls.user2 = User.objects.create(email='test2@mail.ru',
                                        username='test2',
                                        password='ibivob47',
                                        role=cls.role1)

        cls.character1 = Character.objects.create(character_name='Test', gender='Мужской',
                                                  link_to_the_profile_photo='/assets/images/philo/Ali.png')
        cls.selection1 = CharacterSelection.objects.create(character_name=cls.character1,
                                                           role=cls.role1,
                                                           question_id=3)
        cls.selection2 = CharacterSelection.objects.create(character_name=cls.character1,
                                                           role=cls.role1,
                                                           question_id=3)
        cls.selection3 = CharacterSelection.objects.create(character_name=cls.character1,
                                                           role=cls.role1,
                                                           question_id=3)
        cls.answers2 = Answer.objects.create(question_id=2,
                                             user=cls.user1,
                                             text='Тест')
        cls.answers3 = Answer.objects.create(question_id=7,
                                             user=cls.user2,
                                             text='Тест')
        cls.answers1 = {"answers": [{"id": 1, "text": "крутой"}], "question": 3}
        cls.answers1_save = list()
        cls.answers1_save.append({"question": 1, "answers": ["красивый", "красивый"]})
        cls.answers1_save.append({"question": 3, "answers": ["Плов"]})

    # check-answer (НЕавторизованный)
    def test_check_answer_un_auth(self):
        client.force_authenticate(user=None)
        request = client.post('/api/legending/answers/check-answer/', self.answers1)
        self.assertEquals(request.status_code, status.HTTP_200_OK)

    # check-answer (авторизованный)
    def test_check_answer(self):
        client.force_authenticate(user=self.user1)
        response = client.post('/api/legending/answers/check-answer/', self.answers1)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    # получаем список всех ответов конкретного пользователя
    def test_get_queryset(self):
        client.force_authenticate(user=self.user1)
        request = client.get('/api/legending/answers/')
        self.assertEquals(request.status_code, status.HTTP_200_OK)


class NewsViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/character_selection', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)

        cls.user = User.objects.get(id=1)
        cls.mass = {'user': 1, 'question': 1}

    # отображение новостей для НЕ авторизованного
    def test_get_news_for_an_unauthorized_user(self):
        client.force_authenticate(user=None)
        response = client.get('/api/legending/news/')
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # отображение всех новостей для авторизованного
    def test_get_news_for_an_authorized_user(self):
        client.force_authenticate(user=self.user)
        response = client.get('/api/legending/news/')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    # отображение конкретной новости для авторизованного
    def test_get_a_specific_news_item(self):

        client.force_authenticate(user=self.user)
        response = client.get('/api/legending/news/1/')
        if type(response.data) is ReturnDict:
            raz = list()
            raz.append(response.data)
            count_dict = len(raz)
            self.assertEquals(count_dict, 1)
        else:
            count_dict = len(response.data)
            if count_dict == 0:
                print('данные отсутствуют')
                resp1 = Response(status=status.HTTP_404_NOT_FOUND)
                self.assertEquals(resp1.status_code, status.HTTP_404_NOT_FOUND)
            self.assertEquals(count_dict, 1)

    # создание новости (для auth)
    def test_create_news(self):
        client.force_authenticate(user=self.user)
        mass = {
            'user': 1,
            'question': 3
        }
        request = client.post('/api/legending/news/create_news/',
                              data=json.dumps(mass),
                              content_type='application/json')
        self.assertEquals(request.status_code, status.HTTP_200_OK)

    def test_create_news_un_auth(self):
        client.force_authenticate(user=None)
        request = client.post('/api/legending/news/create_news/', self.mass)
        self.assertEquals(request.status_code, status.HTTP_401_UNAUTHORIZED)


class NewsElementViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)
        call_command('loaddata', 'predef/answer_checks', verbosity=0)

        cls.user = User.objects.get(id=1)

        cls.news = News.objects.create(question=Question.objects.get(id=3), user=cls.user)

    # # проверка элементов check (аuth)
    # def test_check_elements(self):
    #     client.force_authenticate(user=self.user)
    #     elements = {
    #         'id': 1,
    #         'text': 'хлеб'
    #     }
    #     full_data = {
    #         'elements': [elements],
    #         'user': 1,
    #         'news_id': 1
    #     }
    #     request = client.post('/api/legending/news/1/elements/check_elements/',
    #                           data=json.dumps(full_data),
    #                           content_type='application/json')
    #     self.assertEquals(request.status_code, status.HTTP_200_OK)

    #    проверка элементов check (no аuth)
    def test_check_elements_no_auth(self):
        client.force_authenticate(user=None)
        elements = {
            'id': 1,
            'text': 'хлеб'
        }
        full_data = {
            'elements': [elements],
            'user': 1,
            'news_id': 1
        }
        request = client.post('/api/legending/news/1/elements/check_elements/',
                              data=json.dumps(full_data),
                              content_type='application/json')
        self.assertEquals(request.status_code, status.HTTP_401_UNAUTHORIZED)

    # # сохранение элементов save (аuth)
    # def test_save_elements(self):
    #     client.force_authenticate(user=self.user)
    #     elements = ["хлеб", "сало"]
    #     full_data = {
    #         'elements': elements,
    #         'user': 1,
    #         'news_id': 1
    #     }
    #     request = client.post('/api/legending/news/1/elements/save_elements/',
    #                           data=json.dumps(full_data),
    #                           content_type='application/json')
    #     self.assertEquals(request.status_code, status.HTTP_200_OK)

    # сохранение элементов save (no аuth)
    def test_save_elements_no_auth(self):
        client.force_authenticate(user=None)
        elements = ["хлеб", "сало"]
        full_data = {
            'elements': elements,
            'user': 1,
            'news_id': 1
        }
        request = client.post('/api/legending/news/1/elements/save_elements/',
                              data=json.dumps(full_data),
                              content_type='application/json')
        self.assertEquals(request.status_code, status.HTTP_401_UNAUTHORIZED)

    # получить элементы для конкретной новости (auth)
    def test_get_elements_for_current_news(self):
        client.force_authenticate(user=self.user)

        request2 = client.get('/api/legending/news/1/elements/')

        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # получить элементы для конкретной новости (no auth)
    def test_get_elements_for_current_news_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/news/1/elements/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)


class TitleViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/templates', verbosity=0)
        call_command('loaddata', 'predef/questions', verbosity=0)
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/character_selection', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)

        cls.user = User.objects.get(id=1)

        cls.answers1 = Answer.objects.create(question=Question.objects.get(id=2),
                                             user=cls.user,
                                             text='красивый')
        cls.answers2 = Answer.objects.create(question=Question.objects.get(id=3),
                                             user=cls.user,
                                             text='идиот')
        cls.answers3 = Answer.objects.create(question=Question.objects.get(id=7),
                                             user=cls.user,
                                             text='тупые')
        cls.create_news = News.objects.create(question=Question.objects.get(id=3), user=cls.user)
        cls.news = News.objects.all().first()

    # получить список всех тайтлов
    def test_get_titles(self):
        client.force_authenticate(user=self.user)
        request2 = client.get('/api/legending/titles/')
        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # получить список всех тайтлов (No auth)
    def test_get_titles_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/titles/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)

    # генерация titles используя только ответы (аuth)
    def test_generate_with_only_answers(self):
        client.force_authenticate(user=self.user)
        request = client.get('/api/legending/titles/generate/')
        self.assertEquals(request.status_code, status.HTTP_200_OK)

    # генерация titles используя только ответы (NO аuth)
    def test_generate_with_only_answers_no_auth(self):
        client.force_authenticate(user=None)
        request = client.get('/api/legending/titles/generate/')
        self.assertEquals(request.status_code, status.HTTP_401_UNAUTHORIZED)

    # # генерация titles используя элементы (аuth)
    # def test_generate_with_elements(self):
    #     client.force_authenticate(user=self.user)
    #     elements = ["хлеб", "сало"]
    #     full_data = {
    #         'elements': elements,
    #         'user': 1,
    #         'news_id': 1
    #     }
    #     request1 = client.post('/api/legending/news/1/elements/save_elements/',
    #                            data=json.dumps(full_data),
    #                            content_type='application/json')
    #     self.assertEquals(request1.status_code, status.HTTP_200_OK)
    #     elements_current = {
    #         "news_id": [1]
    #     }
    #     request2 = client.post('/api/legending/titles/generate_with_elements/',
    #                            data=json.dumps(elements_current),
    #                            content_type='application/json')
    #     self.assertEquals(request2.status_code, status.HTTP_200_OK)
    #
    # # генерация titles используя элементы (NO аuth)
    # def test_generate_with_elements_no_auth(self):
    #     client.force_authenticate(user=self.user)
    #     elements = ["хлеб", "сало"]
    #     full_data = {
    #         'elements': elements,
    #         'user': 1,
    #         'news_id': 1
    #     }
    #     request1 = client.post('/api/legending/news/1/elements/save_elements/',
    #                            data=json.dumps(full_data),
    #                            content_type='application/json')
    #     self.assertEquals(request1.status_code, status.HTTP_200_OK)
    #     client.force_authenticate(user=None)
    #     elements_current = {
    #         "news_id": [1]
    #     }
    #     request2 = client.post('/api/legending/titles/generate_with_elements/',
    #                            data=json.dumps(elements_current),
    #                            content_type='application/json')
    #     self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)


class CharacterViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/characters', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)
        cls.user = User.objects.get(id=1)

    # GET character (авторизованный)
    def test_get_character(self):
        client.force_authenticate(user=self.user)
        response = client.get('/api/legending/character/')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    # check-answer (не авторизованный)
    def test_get_character_no_auth(self):
        client.force_authenticate(user=None)
        response = client.get('/api/legending/character/')
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RateViewSetTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)
        call_command('loaddata', 'predef/rate', verbosity=0)
        cls.user = User.objects.get(id=1)
        cls.rates = Rate.objects.all()

    # получить список всех тарифов
    def test_get_all_rates(self):
        client.force_authenticate(user=self.user)
        request2 = client.get('/api/legending/rates/')
        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # получить список всех тарифов (No auth)
    def test_get_all_rates_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/rates/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)

    # получить конкретный тариф
    def test_get_current_rate(self):
        client.force_authenticate(user=self.user)
        request2 = client.get('/api/legending/rates/1/')
        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # получить кнокретный тариф (No auth)
    def test_get_current_rate_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/rates/1/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)


class OrderViewSet(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('loaddata', 'predef/stats', verbosity=0)
        call_command('loaddata', 'predef/roles', verbosity=0)
        call_command('loaddata', 'predef/users', verbosity=0)
        call_command('loaddata', 'predef/rate', verbosity=0)
        cls.user = User.objects.get(id=1)
        cls.rate1 = Rate.objects.get(id=1)
        cls.rate2 = Rate.objects.get(id=2)

    # получить все подписки
    def test_get_all_orders(self):
        client.force_authenticate(user=self.user)
        request2 = client.get('/api/legending/orders/')
        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # получить все подписки (no auth)
    def test_get_all_orders_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/orders/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)

    # тест check_orders (отсутствуют)
    def test_check_orders_null(self):
        client.force_authenticate(user=self.user)
        request2 = client.get('/api/legending/orders/check_orders/')
        self.assertEquals(request2.status_code, status.HTTP_400_BAD_REQUEST)

    # тест check_orders (отсутствуют) (no auth)
    def test_check_orders_null_no_auth(self):
        client.force_authenticate(user=None)
        request2 = client.get('/api/legending/orders/check_orders/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)

    # тест check_orders (1 order)
    def test_check_orders(self):
        client.force_authenticate(user=self.user)
        full_data = {
            'rate': 1,
            'user': 1
        }
        request1 = client.post('/api/legending/orders/create_order/',
                               data=json.dumps(full_data),
                               content_type='application/json')
        self.assertEquals(request1.status_code, status.HTTP_200_OK)
        request2 = client.get('/api/legending/orders/check_orders/')
        self.assertEquals(request2.status_code, status.HTTP_200_OK)

    # тест check_orders (1 order) (no auth)
    def test_check_orders_no_auth(self):
        client.force_authenticate(user=None)
        full_data2 = {
            'rate': 1,
            'user': 1
        }
        request1 = client.post('/api/legending/orders/create_order/',
                               data=json.dumps(full_data2),
                               content_type='application/json')
        self.assertEquals(request1.status_code, status.HTTP_401_UNAUTHORIZED)
        request2 = client.get('/api/legending/orders/check_orders/')
        self.assertEquals(request2.status_code, status.HTTP_401_UNAUTHORIZED)

    # тест create_order
    def test_create_order(self):
        client.force_authenticate(user=self.user)
        full_data = {
            'rate': 1,
            'user': 1
        }
        request1 = client.post('/api/legending/orders/create_order/',
                               data=json.dumps(full_data),
                               content_type='application/json')
        self.assertEquals(request1.status_code, status.HTTP_200_OK)

    # тест create_order (no auth)
    def test_create_order_no_auth(self):
        client.force_authenticate(user=None)
        full_data = {
            'rate': 1,
            'user': 1
        }
        request1 = client.post('/api/legending/orders/create_order/',
                               data=json.dumps(full_data),
                               content_type='application/json')
        self.assertEquals(request1.status_code, status.HTTP_401_UNAUTHORIZED)

    # тест check_confirmation
    def test_check_confirmation(self):
        client.force_authenticate(user=self.user)
        full_data = {
            'rate': 1,
            'user': 1
        }
        request1 = client.post('/api/legending/orders/create_order/',
                               data=json.dumps(full_data),
                               content_type='application/json')
        self.assertEquals(request1.status_code, status.HTTP_200_OK)
        order_id = Order.objects.get(user=self.user).unique_id
        client.force_authenticate(user=None)
        full_data = {
            'OrderId': str(order_id),
            'Status': "CONFIRMED"
        }
        request2 = client.post('/api/legending/orders/check_confirmation/',
                               data=json.dumps(full_data),
                               content_type='application/json')

        self.assertEquals(request2.status_code, status.HTTP_200_OK)
