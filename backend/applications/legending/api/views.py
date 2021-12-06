import datetime
import io
import requests

from backend.settings.base import DEFAULT_FROM_EMAIL
from collections import OrderedDict
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from docx import Document as DocumentXML
from pyexcel_xlsx import save_data

from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.utils import timezone

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from applications.legending.answers_queue import *
from applications.legending.news_element_queue import *
from applications.legending.lib.generator import *
from applications.legending.lib.elements_check import *
from applications.legending.utils import rfc5987_content_disposition

from applications.users.api.serializers import *


class MultiSerializerViewSetMixin(object):
    """
    This mixin allows to create ViewSets with multi serializers
    """

    def get_serializer_class(self):

        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super(MultiSerializerViewSetMixin, self).get_serializer_class()

    def get_queryset(self):
        try:
            return self.queryset_action[self.action]
        except (KeyError, AttributeError):
            return super(MultiSerializerViewSetMixin, self).get_queryset()

    def filter_queryset(self, queryset, default=False):
        for backend in list(self.filter_backends):
            try:
                queryset = backend().filter_queryset(self.request, queryset, self, default=default)
            except TypeError:
                queryset = backend().filter_queryset(self.request, queryset, self)

        return queryset


colors = [
    {
        "primary": '#ad2121',
        "secondary": '#FAE3E3'
    }, {
        "primary": '#1e90ff',
        "secondary": '#D1E8FF'
    }, {
        "primary": '#e3bc08',
        "secondary": '#FDF1BA'
    }
]


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = CharacterSelection.objects.all()
    serializer_class = CharacterSelectionSerializer
    pagination_class = None
    filterset_fields = ('role', 'question__version')


def check_by_condition(answers_list, condition):
    # Todo: Условие с частями речи работает только для одного слова

    errors = list()
    condition = json.loads(condition)
    if Check.WORD_NUMBERS_KEY in condition.keys():
        for answer in answers_list:
            row = answer.get('text').strip().split(' ')
            if not (condition[Check.WORD_NUMBERS_KEY]['min'] <= len(row) <= condition[Check.WORD_NUMBERS_KEY]['max']):
                if condition[Check.WORD_NUMBERS_KEY]['min'] == condition[Check.WORD_NUMBERS_KEY]['max']:
                    error_msg = f'''Ответ должен содержать {condition[Check.WORD_NUMBERS_KEY]['min']} {'слово' if condition[Check.WORD_NUMBERS_KEY]['min'] == 1 else 'слова' if 1 < condition[Check.WORD_NUMBERS_KEY]['min'] < 5 else 'слов'}'''
                else:
                    error_msg = f'''Ответ должен содержать не менее {condition[Check.WORD_NUMBERS_KEY]['min']} и не более {condition[Check.WORD_NUMBERS_KEY]['max']} слов'''

                errors.append({'id': answer.get('id'), 'error': error_msg})
    elif Check.SPEECH_TYPE_KEY in condition.keys():
        morph = pymorphy2.MorphAnalyzer()

        for answer in answers_list:
            row = answer.get('text').strip().split(' ')
            if len(row) > 1:
                # Todo: Пока только для одного слова
                errors.append(
                    {'id': answer.get('id'), 'error': "Пока не могу проверять части речи для нескольких слов"})
            else:
                m = morph.parse(row[0])
                error_msg = f'''Ответ должен содержать {', '.join(Check.SPEECH_VALUE_CHOICES._display_map.get(value).lower() for value in condition[Check.SPEECH_TYPE_KEY])}'''
                for parse in m:
                    if parse.tag.POS in condition[Check.SPEECH_TYPE_KEY]:
                        break
                else:
                    errors.append({'id': answer.get('id'), 'error': error_msg})
    else:
        raise Exception("METHOD NOT RELEASED!!!")

    return errors


def word_check(question_id, answers_list):
    character_selection = CharacterSelection.objects.get(pk=question_id)
    if not character_selection:
        return False

    checks = character_selection.question.checks.all()

    res = False
    errors = []
    for check in checks:
        errors = check_by_condition(answers_list, check.condition)
        if errors:
            break
    else:
        res = True

    return res, errors


class TextViewSet(viewsets.ModelViewSet):
    model = Text
    serializer_class = TextSerializer
    pagination_class = None

    def get_queryset(self):
        return Text.objects.all()


class AnswerViewSet(viewsets.ModelViewSet):
    model = Answer
    serializer_class = AnswerSerializer

    def get_queryset(self):
        return Answer.objects.filter(user=self.request.user)

    @action(methods=['POST'], url_path='check-answer', detail=False,
            permission_classes=[], authentication_classes=[])
    def check_answer(self, request, *args, **kwargs):
        data = request.data
        if not data:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)
        question, answers = data.get('question'), data.get('answers')
        if not question or not answers:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)

        res, msg = word_check(question, answers)
        if res:
            return Response(data={"ok": True}, status=status.HTTP_200_OK)

        return Response(data=msg, status=status.HTTP_200_OK)

    @action(methods=['POST'], url_path='poll-results', detail=False)
    def save_results(self, request, *args, **kwargs):

        for data in request.data:
            for answer in data.get('answers', []):
                raw_data = {
                    'text': answer,
                    'question': data.get('question'),
                    'user': request.user.pk
                }
                serializer = self.get_serializer(data=raw_data)
                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    serializer.save()

        return Response(data={"ok": True, "user": {}}, status=status.HTTP_200_OK)


class EventViewSet(MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    model = Event
    serializer_class = EventSerializer

    ordering_fields = ['id', 'start']
    filterset_fields = ['like', 'status']
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    serializer_action_classes = {
        'list': EventListSerializer,
        'month_list': EventListSerializer,
        'retrieve': EventDetailSerializer
    }

    def get_queryset(self):
        title_filter = self.request.query_params.get('title', None)
        if not title_filter:
            return Event.objects.filter(user=self.request.user)
        return Event.objects.filter(user=self.request.user, title__text__icontains=title_filter)

    @action(methods=['GET'], url_path='month', detail=False, pagination_class=None)
    def month_list(self, request, *args, **kwargs):
        month = request.query_params.get('start', str(datetime.date.today()))

        date_start = datetime.strptime(month, '%Y-%m-%d')
        date_end = date_start + relativedelta(months=+1)

        queryset = Event.objects.filter(user=self.request.user,
                                        start__gte=date_start,
                                        end__lt=date_end,
                                        like=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], url_path='generate', detail=False)
    def generate(self, request, *args, **kwargs):

        texts = Text.objects.all()
        titles = Title.objects.filter(user=request.user, status=False)
        if not titles:
            return Response(data={"ok": False,
                                  "msg": "Error: Predefined data do not loaded."},
                            status=status.HTTP_404_NOT_FOUND)

        start_day = datetime.today()
        for title in titles:
            ev = Event()
            ev.user = request.user
            ev.title = title
            ev.description = random.choice(texts)
            ev.color = random.choice(colors)
            ev.start = start_day
            ev.end = start_day
            ev.save()
            start_day += timedelta(days=3)
            title.status = True
            title.save()

        return Response(data={"ok": True}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        data.update({'user': request.user.pk})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)

    @action(methods=['GET'], detail=True, url_path='get-docx')
    def print_doc(self, request, *args, **kwargs):
        instance = self.get_object()
        file_stream = io.BytesIO()
        document_xml = DocumentXML()

        document_xml.add_heading(instance.title.text)
        document_xml.add_paragraph(instance.description.text)

        document_xml.save(file_stream)
        file_stream.seek(0)

        response = HttpResponse(file_stream, content_type='application/docx')
        file_name = f'{instance.title}.docx'

        response['Content-Disposition'] = rfc5987_content_disposition(file_name)

        return response

    @action(methods=['GET'], detail=False, url_path='get-xlsx')
    def print_table(self, request, *args, **kwargs):

        events = Event.objects.filter(user=request.user, status=1).all()

        events_array = []

        events_array.append(['Заголовок', 'Тип', 'Комментарий'])

        for cur_event in events:
            event_arr = []
            event_arr.append(cur_event.title.text)
            event_arr.append(cur_event.description.text)
            event_arr.append(cur_event.comment)
            events_array.append(event_arr)

        data = OrderedDict()
        data.update({"Публикации": events_array})

        file_stream = io.BytesIO()
        save_data(file_stream, data)

        file_stream.seek(0)

        response = HttpResponse(file_stream, content_type='application/xlsx')
        file_name = 'recommended_topics_from_4DLEGENDING.xlsx'

        response['Content-Disposition'] = rfc5987_content_disposition(file_name)

        return response

    @action(methods=['GET'], detail=False, url_path='last-unviewed')
    def last_unviewed(self, request, *args, **kwargs):
        order_user = Order.objects.filter(user=self.request.user).last()
        if order_user:
            try:
                first = Event.objects.filter(user=request.user, status=0).order_by('start').last()

                template = Template.objects.get(id=first.title.template_id)
                template.count_all_ratings += 1
                template.save()

            except:
                return Response({})

            if first is None:
                return Response({})
            else:
                return Response(EventDetailSerializer(first, many=False).data)
        else:
            while self.request.user.last_event <= 12:
                try:
                    first = Event.objects.filter(user=request.user, status=0).order_by('start').last()

                    template = Template.objects.get(id=first.title.template_id)
                    template.count_all_ratings += 1
                    template.save()

                except:
                    return Response({})

                if first is None:
                    return Response({})
                else:
                    cur_user = User.objects.get(id=self.request.user.pk)
                    cur_user.last_event += 1
                    cur_user.save()
                    return Response(EventDetailSerializer(first, many=False).data)
            return Response({})

    @action(methods=['POST'], detail=False, url_path='true')
    def true(self, request, *args, **kwargs):

        template = Template.objects.get(id=request.data.get('template_id'))
        template.count_true_ratings += 1
        template.save()
        return Response(data={"ok": True}, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False, url_path='end')
    def end(self, request, *args, **kwargs):
        events = Event.objects.filter(user=request.user, status=0)
        if not events:
            return Response(data={"ok": False}, status=status.HTTP_200_OK)
        else:
            events.delete()
            return Response(data={"ok": True}, status=status.HTTP_200_OK)


class QuestionListViewSet(viewsets.ModelViewSet):
    model = CharacterSelection
    serializer_class = CharacterSelectionSerializer
    pagination_class = None
    filterset_fields = ('role', 'question__version')

    def get_queryset(self):
        role_id = self.request.user.role_id

        return CharacterSelection.objects.filter(role=role_id, question__version=True).filter(
            Q(id=3) | Q(id=10) | Q(id=17))


class NewsViewSet(viewsets.ModelViewSet):
    model = News
    serializer_class = NewsSerializer
    pagination_class = None

    def get_queryset(self):
        current_user = User.objects.get(id=self.request.user.id)
        current_user.click_theme_day_count += 1
        current_user.save()
        return News.objects.all().filter(user=self.request.user)

    # Создание новости
    @action(methods=['POST'], url_path='create_news', detail=False)
    def create_news(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()
            news = News.objects.all().filter(user=self.request.user).last()
            news_id = news.id
            return Response(data={"news_id": news_id}, status=status.HTTP_200_OK)


class NewsElementViewSet(viewsets.ModelViewSet):
    model = NewsElement
    serializer_class = NewsElementSerializer
    pagination_class = None

    def get_queryset(self):
        return NewsElement.objects.filter(user=self.request.user, news_id=self.kwargs.get('id'))

    # Проверка элементов
    @action(methods=['POST'], url_path='check_elements', detail=False)
    def check_elements(self, request, *args, **kwargs):

        data = request.data
        if not data:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)
        elements = data.get('elements')

        if self.request.user.role_id == 3:
            question_id = 17
        elif self.request.user.role_id == 2:
            question_id = 10
        else:
            question_id = 3

        if not elements:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)

        res, msg = element_check(elements, question_id)
        if res:
            return Response(data={"ok": True}, status=status.HTTP_200_OK)

        return Response(data=msg, status=status.HTTP_200_OK)

    # сохранение в бд
    @action(methods=['POST'], url_path='save_elements', detail=False)
    def save_results(self, request, *args, **kwargs):
        data = request.data

        for text in data.get('elements', []):
            raw_data = {
                'text': text,
                'user': request.user.pk,
                'count': len(data.get('elements')),
                'news': data.get('news_id')
            }
            serializer = self.get_serializer(data=raw_data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer.save()

        return Response(data={"ok": True}, status=status.HTTP_200_OK)


class TitleViewSet(viewsets.ModelViewSet):
    model = Title
    serializer_class = TitleSerializer
    pagination_class = None

    def get_queryset(self):
        if self.request.user.date_end:
            return Title.objects.filter(user=self.request.user)

        return Title.objects.filter(user=self.request.user).reverse()[:12]

    @action(methods=['GET'], url_path='generate', detail=False)
    def generate(self, request, *args, **kwargs):

        order_user = Order.objects.filter(user=self.request.user).last()
        if order_user:
            if self.request.user.role_id == 3:
                templates = Template.objects.filter(role=3).exclude(version=True)
            elif self.request.user.role_id == 2:
                templates = Template.objects.filter(role=2).exclude(version=True)
            else:
                templates = Template.objects.filter(role=1).exclude(version=True)

        else:
            if self.request.user.role_id == 3:
                templates = Template.objects.filter(Q(version=True) & Q(role=3))
            elif self.request.user.role_id == 2:
                templates = Template.objects.filter(Q(version=True) & Q(role=2))
            else:
                templates = Template.objects.filter(Q(version=True) & Q(role=1))

        if not templates:
            return Response(data={"res": [],
                                  "msg": "Error: Predefined data do not loaded."},
                            status=status.HTTP_404_NOT_FOUND)

        if not Answer.objects.filter(user=request.user).exists():
            return Response(data={"res": [],
                                  "msg": "Error: Опрос не был пройден."},
                            status=status.HTTP_404_NOT_FOUND)

        aqm = AnswersQueueManager(request.user)
        try:
            for t in templates:
                try:
                    if t.id == 48 or t.id == 3 or t.id == 16 or t.id == 64 or t.id == 77 \
                            or t.id == 109 or t.id == 138 or t.id == 125 or t.id == 170:
                        aqm2 = AnswersQueueManager(request.user)
                        title2 = generate_title(t.text, aqm2)
                        title = generate_title(t.text, aqm)
                        res1_1 = title2.split()
                        res1 = res1_1[-2] + " " + res1_1[-1]
                        res2_2 = title.split()
                        del res2_2[-1]
                        del res2_2[-1]
                        res2_2.append(res1)
                        raw_data = {
                            'text': ' '.join(res2_2),
                            'template': t.pk,
                            'user': request.user.pk
                        }
                        serializer = self.get_serializer(data=raw_data)
                        if serializer.is_valid():
                            serializer.save()
                        pass
                    else:
                        title = generate_title(t.text, aqm)
                        raw_data = {
                            'text': title,
                            'template': t.pk,
                            'user': request.user.pk
                        }
                        serializer = self.get_serializer(data=raw_data)
                        if serializer.is_valid():
                            serializer.save()
                except ValueError:
                    pass
            return Response(data={"ok": True}, status=status.HTTP_200_OK)
        except:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], url_path='generate_with_elements', detail=False)
    def generate_with_elements(self, request, *args, **kwargs):

        if self.request.user.role_id == 3:
            templates = Template.objects.filter(role=3).exclude(version=True).exclude(news=False)
        elif self.request.user.role_id == 2:
            templates = Template.objects.filter(role=2).exclude(version=True).exclude(news=False)
        else:
            templates = Template.objects.filter(role=1).exclude(version=True).exclude(news=False)

        if not templates:
            return Response(data={"res": [],
                                  "msg": "Error: Templates не были загружены."},
                            status=status.HTTP_404_NOT_FOUND)

        if not NewsElement.objects.filter(user=request.user).exists():
            return Response(data={"res": [],
                                  "msg": "Error: Элементы не были заполнены."},
                            status=status.HTTP_404_NOT_FOUND)

        news_ids = request.data.get('news_id')

        neq = NewsElementQueueManager(request.user, news_ids)
        try:
            for t in templates:
                try:
                    title = generate_titles_with_elements(t.text, neq)
                    raw_data = {
                        'text': title,
                        'template': t.pk,
                        'user': request.user.pk
                    }
                    serializer = self.get_serializer(data=raw_data)
                    if serializer.is_valid():
                        serializer.save()
                except ValueError:
                    pass
            return Response(data={"ok": True}, status=status.HTTP_200_OK)
        except:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CharacterViewSet(viewsets.ModelViewSet):
    model = Character
    serializer_class = CharacterSerializer
    pagination_class = None

    def get_queryset(self):
        return [random.choice(list(Character.objects.all()))]


class RateViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    model = Rate
    serializer_class = RateSerializer
    pagination_class = None

    def get_queryset(self):
        return Rate.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    model = Order
    serializer_class = OrderSerializer
    pagination_class = None

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    # Проверка наличия подписок
    @action(methods=['GET'], url_path='check_orders', detail=False)
    def check_orders(self, request, *args, **kwargs):

        orders = Order.objects.filter(user=self.request.user)
        if not orders:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"ok": True}, status=status.HTTP_200_OK)

    # Создание подписки
    @action(methods=['POST'], url_path='create_order', detail=False)
    def create_order(self, request, *args, **kwargs):
        orders = Order.objects.filter(user=self.request.user)
        last_order = orders

        if orders:
            last_order = Order.objects.get(user=self.request.user)
            Order.objects.filter(user=self.request.user).delete()

        raw_data = {
            'rate': request.data.get('rate'),
            'user': request.user.pk,
        }

        serializer = self.get_serializer(data=raw_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if orders:
                if last_order.date_end:
                    serializer.save()
                    order = Order.objects.filter(user=self.request.user).last()
                    order.date_start = last_order.date_end
                    order.save()
                else:
                    serializer.save()
            else:
                serializer.save()

        unique = Order.objects.filter(user=self.request.user).last().unique_id
        price = Order.objects.filter(user=self.request.user).last().rate.price
        data1 = {
            "OrderId": str(unique),
            "Amount": price,
            "TerminalKey": "1630910989605",
            "Description": "Оплата подписки",
            "NotificationURL": "https://legendi.info/api/legending/orders/check_confirmation/",
            "SuccessURL": "https://legendi.info/after-payment",
            "FailURL": "https://legendi.info/after-payment"
        }
        resp1 = requests.post('https://securepay.tinkoff.ru/v2/Init/', json=data1)
        return HttpResponse(resp1)

    # Создание подписки
    @action(methods=['POST'], url_path='create_order_voucher', detail=False)
    def create_order_voucher(self, request, *args, **kwargs):

        vouch_available_does_not_exist = {"error": "Нет доступных промокодов"}
        vouch_does_not_input = {"error": "Промокод не введён"}
        vouch_does_not_exist = {"error": "Промокод несуществует"}
        vouch_id = None

        vouchers = Voucher.objects.filter(date_activation=None)
        if not vouchers:
            return Response(data=vouch_available_does_not_exist, status=status.HTTP_404_NOT_FOUND)

        if not request.data.get('title'):
            return Response(data=vouch_does_not_input, status=status.HTTP_404_NOT_FOUND)

        for vouch in vouchers:
            if vouch.title == request.data.get('title'):
                vouch_id = vouch.id

        if not vouch_id:
            return Response(data=vouch_does_not_exist, status=status.HTTP_404_NOT_FOUND)

        orders = Order.objects.filter(user=self.request.user)
        last_order = orders

        if orders:
            last_order = Order.objects.get(user=self.request.user)
            Order.objects.filter(user=self.request.user).delete()

        raw_data = {
            'user': request.user.pk,
            'rate': 1
        }
        serializer = self.get_serializer(data=raw_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if orders:
                if last_order.date_end:
                    serializer.save()
                    order = Order.objects.filter(user=self.request.user).last()
                    order.date_start = last_order.date_end
                    order.save()
                else:
                    serializer.save()
            else:
                serializer.save()

        voucher = Voucher.objects.get(id=vouch_id)

        current_order = Order.objects.filter(user=request.user).last()
        current_order.date_end = current_order.date_start + timedelta(days=30)
        current_order.status = True
        current_order.voucher = True
        current_order.save()
        stats = Statistics.objects.all().first()
        stats.count_orders_all += 1
        stats.save()
        user = current_order.user
        user.count_orders += 1
        user.save()
        voucher.date_activation = datetime.now(timezone.utc)
        voucher.user = request.user
        voucher.save()
        return Response(data={"ok": True}, status=status.HTTP_200_OK)

    # Проверка оплаты со стороны тинькофа (успешно ли?)
    @action(methods=['POST'], url_path='check_confirmation', detail=False,
            permission_classes=[], authentication_classes=[])
    def check_confirmation(self, request, *args, **kwargs):
        order_id = request.data.get('OrderId')
        confirmation = request.data.get('Status')
        if confirmation == "AUTHORIZED" \
                or confirmation == "REJECTED" \
                or confirmation == "REFUNDED" \
                or confirmation == "CANCELED" \
                or confirmation == "REVERSED" \
                or confirmation == "PARTIAL_REFUNDED" \
                or confirmation == "PARTIAL_REVERSED":
            text = "OK"
            return HttpResponse(text, status=status.HTTP_200_OK)

        elif confirmation == "CONFIRMED":
            current_order = Order.objects.get(unique_id=order_id)
            current_rate = current_order.rate.price
            if current_rate == 5000:
                current_order.date_end = current_order.date_start + timedelta(days=30)
            else:
                current_order.date_end = current_order.date_start + timedelta(days=365)
            current_order.status = True
            current_order.save()
            stats = Statistics.objects.all().first()
            stats.count_orders_all += 1
            stats.save()
            user = current_order.user
            user.count_orders += 1
            user.save()
        else:
            return Response(data={"ok": False}, status=status.HTTP_400_BAD_REQUEST)
        text = "OK"
        return HttpResponse(text, status=status.HTTP_200_OK)


class StatisticsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    model = Statistics
    serializer_class = StatisticsSerializer
    pagination_class = None
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return Statistics.objects.all()

    # Создание подписки
    @action(methods=['GET'], url_path='templates', detail=False)
    def get_events(self, request, *args, **kwargs):
        templates = Template.objects.values('text', 'count_true_ratings', 'count_all_ratings')

        return Response(data=templates, status=status.HTTP_200_OK)


class SupportViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    model = Support
    serializer_class = SupportSerializer
    pagination_class = None

    def get_queryset(self):
        return Support.objects.filter(user=self.request.user)

    @action(methods=['POST'], url_path='send', detail=False)
    def send_message(self, request, *args, **kwargs):
        data = self.request.data
        raw_data = {
            'text': data.get('text'),
            'email': User.objects.get(id=request.user.pk).email,
            'subject': data.get('subject'),
            'user': request.user.pk
        }
        serializer = self.get_serializer(data=raw_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()

        subject1 = data.get('subject')
        text1 = str(data.get('text'))
        email1 = []
        a1 = str(User.objects.get(id=request.user.pk).email)
        email1.append(a1)
        try:
            send_mail(f'{subject1} от {email1}', text1, DEFAULT_FROM_EMAIL, ['legending@list.ru'], fail_silently=False)
            send_mail(f'{subject1} от Службы поддержки {DEFAULT_FROM_EMAIL}',
                      'Уважаемый пользователь LEGENDING. Спасибо за обращение, ваш вопрос находится на рассмотрении.',
                      DEFAULT_FROM_EMAIL, email1, fail_silently=False)
        except BadHeaderError:
            pass

        return Response(data={"ok": True}, status=status.HTTP_200_OK)


class AfterPaymentViewSet(viewsets.ModelViewSet):
    permission_classes = ()
    model = Order
    serializer_class = OrderSerializer
    pagination_class = None
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return Order.objects.filter(user_id=self.request.user.pk)
