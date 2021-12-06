import itertools
import random
from collections import Iterable
from datetime import datetime

from applications.legending.models import NewsElement, Answer, News


class NewsElementQueueManager:
    def __init__(self, user, news_ids):
        random.seed(datetime.now())

        self.__queue = dict()
        self.__user = user
        self.__elements = self.__load_elements(news_ids, user)
        self.__shuffle_elements()

    def __load_elements(self, news_ids, user):
        # вычисляем id вопросов, связанных с новостями, имеющие news_ids
        exclude_list = list()
        # вычисляем количество элементов для каждой новости
        number_of_elements = list()
        for current_id in news_ids:
            if user.role_id == 1:
                exclude_list.append(3)
            elif user.role_id == 2:
                exclude_list.append(10)
            else:
                exclude_list.append(17)
            # exclude_list.append(News.objects.get(id=current_id).question_id)
            number_of_elements.append(len(NewsElement.objects.filter(news=current_id)))
        question_ids = exclude_list

        # Получаем список ответов на все вопросы, кроме тех, с которыми связаны новости
        answers = Answer.objects.values('text',
                                        'question').filter(user=self.__user).order_by('question').exclude(question__in=exclude_list)
        answers_results = list(answers)

        for current_elements in news_ids:
            data = News.objects.values('elements__text').filter(user=self.__user, id=current_elements)
            count = 0
            for y1 in data:
                y1['text'] = y1.pop('elements__text')
                intermediate_dictionary = dict()
                intermediate_dictionary.clear()
                intermediate_dictionary['text'] = y1.get('text')
                intermediate_dictionary['question'] = question_ids[count]
                answers_results.append(intermediate_dictionary)
            count += 1

        res = dict()
        for k, v in itertools.groupby(answers_results, key=lambda x: x['question']):
            res.update({k: list(v)})
        return res

    def __shuffle_elements(self, news_ids=None):

        def shuffled_copy(_id, elements):
            new_list = list(map(lambda x: x.get('text', ''), elements.get(_id, [])))

            random.shuffle(new_list)
            return new_list

        if not news_ids:
            news_ids = self.__elements.keys()

        if not isinstance(news_ids, Iterable):
            raise TypeError("\"news_ids\" must be iterable")

        for news_id in news_ids:
            self.__queue.update({news_id: shuffled_copy(news_id, self.__elements)})

    def element_by_id(self, news_id):
        if news_id not in self.__elements:
            raise ValueError("{} not exists!".format(news_id))

        if not self.__queue.get(news_id):
            self.__shuffle_elements([news_id])

        return self.__queue[news_id].pop()
