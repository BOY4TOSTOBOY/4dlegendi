from django.test import TestCase
from django.urls import reverse
from django.http import HttpResponse
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from rest_framework.test import APITestCase


# Create your tests here.
from applications.legending.lib.generator import generate_title
from applications.legending.lib.elements_check import element_check, elements_check_by_condition

from applications.legending.models import Character, CharacterSelection, News, NewsElement, Check, Question
from applications.users.models import User


class SimpleGenerator:

    def __init__(self, mock_data):
        self.mock_data = mock_data

    def answer_by_id(self, question_id):
        return self.mock_data[question_id]


class TestTemplates(TestCase):

    sample_dict = {1: "красивый", 2: "умный", 3: "процесс", 4: "предпринимательница", 5: "поражение", 6: "успех",
                   7: "неудачный"}

    def test_method1(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Главная проблема {{ question_1|setNoon:\"3,1\"|inflect:\"sing,gent\" }} " \
                   "и {{ question_2|setNoon:\"3,2\"|inflect:\"sing,gent\" }} {{ question_3|inflect:\"sing,gent\"  }}"
        title = generate_title(template, sg)
        print("1. " + title)
        pass

    def test_method2(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Суть {{ question_1|inflect:\"sing,gent\" }} " \
                   "и {{ question_2|inflect:\"sing,gent\" }} – {{ question_6|inflect:\"sing,nomn\" }}"
        title = generate_title(template, sg)
        print("2. " + title)
        pass

    def test_method3(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_2|setNoon:\"4,2\"|inflect:\"sing,nomn\"|capitalize }} " \
                   "{{ question_4|inflect:\"sing,nomn\" }} – вот что даёт {{ question_4|inflect:\"sing,datv\" }} " \
                   "{{ question_6|inflect:\"sing,nomn\" }}"
        title = generate_title(template, sg)
        print("3. " + title)
        pass

    def test_method4(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_4|inflect:\"sing,nomn\"|capitalize }} утверждает, что " \
                   "{{ question_3|inflect:\"sing,nomn\" }} не {{ question_7|setNoon:\"3,7\"|inflect:\"sing,nomn\" }}"
        title = generate_title(template, sg)
        print("4. " + title)
        pass

    def test_method5(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_4|inflect:\"nomn,plur\"|capitalize }} меня спрашивают: что такое " \
                   "{{ question_6|inflect:\"sing,nomn\" }} {{ question_3|inflect:\"sing,gent\" }}"
        title = generate_title(template, sg)
        print("5. " + title)
        pass

    def test_method6(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Как с помощью {{ question_3|inflect:\"sing,gent\" }} прийти к " \
                   "{{ question_1|setNoon:\"6,1\"|inflect:\"sing,datv\" }} {{ question_6|inflect:\"sing,datv\" }}"
        title = generate_title(template, sg)
        print("6. " + title)
        pass

    def test_method7(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_4|inflect:\"nomn\" }}. Что обеспечит " \
                   "{{ question_2|setNoon:\"3,2\"|inflect:\"sing,nomn\" }} {{ question_6|inflect:\"sing,nomn\" }}"
        title = generate_title(template, sg)
        print("7. " + title)
        pass

    def test_method8(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_5|inflect:\"sing,nomn\"|capitalize }} " \
                   "{{ question_3|inflect:\"sing,gent\"  }} - за и против"
        title = generate_title(template, sg)
        print("8. " + title)
        pass

    def test_method9(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "{{ question_5|inflect:\"sing,nomn\"|capitalize }} {{ question_3|inflect:\"sing,gent\"  }} - " \
                   "глупость или {{ question_7|inflect:\"sing,femn,nomn\" }} работа"
        title = generate_title(template, sg)
        print("9. " + title)
        pass

    def test_method10(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Признавайтесь, кто тут {{ question_4|inflect:\"sing,nomn\" }} и пользуется " \
                   "{{ question_7|setNoon:\"3,7\"|inflect:\"sing,ablt\" }} {{ question_3|inflect:\"sing,ablt\" }}"
        title = generate_title(template, sg)
        print("10. " + title)
        pass

    def test_method11(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Есть такое утверждение, что {{ question_1|setNoon:\"4,1\"|inflect:\"sing,nomn\" }} " \
                   "{{ question_4|inflect:\"sing,nomn\" }} - легенда {{ question_6|inflect:\"sing,gent\"}}"
        title = generate_title(template, sg)
        print("11. " + title)
        pass

    def test_method12(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "Однажды {{ question_4|inflect:\"sing,nomn\" }} использует {{ question_5|inflect:\"sing,nomn\" }} " \
                   "{{ question_3|inflect:\"sing,gent\" }} и..."
        title = generate_title(template, sg)
        print("12. " + title)
        pass

    def test_method13(self):
        sg = SimpleGenerator(self.sample_dict)
        template = "В тот момент, когда вы решаете быть {{ question_2|setNoon:\"4,2\"|inflect:\"sing,ablt\" }} " \
                   "{{ question_4|inflect:\"sing,ablt\" }}  - вы не смеётесь над " \
                   "{{ question_1|setNoon:\"3,1\"|inflect:\"sing,ablt\" }} {{ question_3|inflect:\"sing,ablt\" }}"
        title = generate_title(template, sg)
        print("13. " + title)
        pass


# class NewsElementTest(TestCase):
#     @classmethod
#     # создание объекта для тестирования
#     def setUpTestData(cls):
#
#         cls.user = User.objects.create(email='testemail@mail.ru',
#                                         first_name='testuser',
#                                         last_name='testuser',
#                                         password='ibivob47',
#                                         confirm_password='ibivob47',
#                                         role=1,
#                                         username='testuser')
#
#         q1 = Question.objects.create(text="1.", min_answers=7, version=False)
#         q2 = Question.objects.create(text="2.", min_answers=7, version=True)
#         q3 = Question.objects.create(text="3.", min_answers=7, version=True)
#         q4 = Question.objects.create(text="4.", min_answers=7, version=False)
#         q5 = Question.objects.create(text="5.", min_answers=7, version=False)
#         q6 = Question.objects.create(text="6.", min_answers=7, version=False)
#         q7 = Question.objects.create(text="7.", min_answers=7, version=True)
#
#         rule_1 = Check.objects.create(condition="{\"WORDS\": {\"min\": 1, \"max\": 1}}")
#         rule_2 = Check.objects.create(condition="{\"SPEECH\": [\"ADJF\", \"PRTF\"]}")
#         rule_3 = Check.objects.create(condition="{\"SPEECH\": [\"NOUN\"]}")
#
#         rule_1.question.add(q1, q2, q3, q4, q5, q6, q7)
#         rule_2.question.add(q1, q2, q7)
#         rule_3.question.add(q3, q4, q5, q6)
#
#         return User.objects.get(id=1)
#
#     def test_element_check(self):
#         elements = {'elements': [{'id': 1, 'text': "слон"}, {'id': 2, 'text': "стул"}], 'user': 1}
#         elements_new = elements.get('elements')
#         res, msg = element_check(elements_new)
#         if res:
#             print("method element_check:", res)
#         else:
#             print("method element_check:", msg)


