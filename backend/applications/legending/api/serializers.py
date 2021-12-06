import json

from rest_framework import serializers

from applications.legending.models import *


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ()


class CheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Check
        exclude = ()


class CheckRelatedSerializer(serializers.RelatedField):
    class Meta:
        model_class = Check
        model_serializer_class = CheckSerializer

    def to_representation(self, instance):
        condition = json.loads(instance.condition)
        criteria = ''
        if Check.WORD_NUMBERS_KEY in condition.keys():
            if condition[Check.WORD_NUMBERS_KEY]['min'] == condition[Check.WORD_NUMBERS_KEY]['max']:
                criteria = f'''Ответ должен содержать {condition[Check.WORD_NUMBERS_KEY]['min']}
                {'слово' if condition[Check.WORD_NUMBERS_KEY]['min'] == 1 else 'слова'
                if 1 < condition[Check.WORD_NUMBERS_KEY]['min'] < 5 else 'слов'}'''
            else:
                criteria = f'''Ответ должен содержать не менее {condition[Check.WORD_NUMBERS_KEY]['min']} и не более
                {condition[Check.WORD_NUMBERS_KEY]['max']} слов'''

        elif Check.SPEECH_TYPE_KEY in condition.keys():
            criteria = f'''Ответ должен содержать {', '.join(Check.SPEECH_VALUE_CHOICES._display_map.get(value).lower()
                                                             for value in condition[Check.SPEECH_TYPE_KEY])}'''

        return criteria


class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        exclude = ()


class AnswersQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswersQueue
        exclude = ()

    def save(self):
        question = self.validated_data['question']
        data = {
            'answers': self.validated_data['answers'],
            'user': self.validated_data['user'],
            'question': question,
        }

        answer_queue, created = AnswersQueue.objects.update_or_create(question=question,
                                                                      defaults=data)
        return answer_queue


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        exclude = ()

    def save(self):
        answer = Answer(
            text=self.validated_data['text'],
            user=self.validated_data['user'],
            question=self.validated_data['question']
        )

        answer.save()
        return answer


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        exclude = ()


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ()


class EventListSerializer(serializers.ModelSerializer):
    title = serializers.StringRelatedField(many=False)
    description = TextSerializer(many=False, required=True)

    class Meta:
        model = Event
        exclude = ('user',)


class EventDetailSerializer(serializers.ModelSerializer):
    description = TextSerializer(many=False, required=True)
    title = TitleSerializer(many=False, required=True)

    class Meta:
        model = Event
        exclude = ('user',)


class CharacterSelectionSerializer(serializers.ModelSerializer):
    character_name = serializers.CharField(source='character_name.character_name')
    role = serializers.IntegerField(source='role.id')
    question = serializers.CharField(source='question.text')
    question_id = serializers.IntegerField(source='question.id')
    link_to_the_profile_photo = serializers.CharField(source='character_name.link_to_the_profile_photo')
    criteria = CheckRelatedSerializer(queryset=Check.objects.all(), many=True, required=False, source='question.checks')
    min_answers = serializers.IntegerField(source='question.min_answers')

    class Meta:
        model = CharacterSelection
        exclude = ()


class NewsSerializer(serializers.ModelSerializer):
    elements = serializers.StringRelatedField(many=True, default="")

    class Meta:
        model = News
        exclude = ()

    def save(self):
        news = News(
            user=self.validated_data['user'],
            question=self.validated_data['question']
        )
        news.save()
        return news


class NewsElementSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsElement
        exclude = ()

    def save(self):
        news_element = NewsElement(
            text=self.validated_data['text'],
            user=self.validated_data['user'],
            count=self.validated_data['count'],
            news=self.validated_data['news']
        )
        news_element.save()
        return news_element


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        exclude = ()


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ()


class OrderDateEndSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ('id', 'rate', 'user', 'status', 'date_start', 'unique_id', 'voucher', )


class RateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rate
        exclude = ()


class StatisticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Statistics
        exclude = ('id', 'user', 'events', )


class SupportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Support
        exclude = ()

    def save(self):
        sup = Support(
            email=self.validated_data['email'],
            user=self.validated_data['user'],
            subject=self.validated_data['subject'],
            text=self.validated_data['text']
        )
        sup.save()
        return sup
