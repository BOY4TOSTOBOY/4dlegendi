import itertools
import random
from collections import Iterable
from datetime import datetime

from applications.legending.api.serializers import AnswersQueueSerializer
from applications.legending.models import Answer


class AnswersQueueManager:
    def __init__(self, user):
        random.seed(datetime.now())

        self.__queue = dict()
        self.__user = user
        self.__answers = self.__load_answers()
        self.__shuffle_answers()

    def __load_answers(self):
        answers = Answer.objects.values('text', 'question').filter(user=self.__user).order_by('question')

        res = dict()
        for k, v in itertools.groupby(answers, key=lambda x: x['question']):
            res.update({k: list(v)})

        return res

    def __shuffle_answers(self, question_ids=None):

        def shuffled_copy(_id, answers):
            new_list = list(map(lambda x: x.get('text', ''), answers.get(_id, [])))

            random.shuffle(new_list)
            return new_list

        if not question_ids:
            question_ids = self.__answers.keys()

        if not isinstance(question_ids, Iterable):
            raise TypeError("\"question_ids\" must be iterable")

        for question_id in question_ids:
            self.__queue.update({question_id: shuffled_copy(question_id, self.__answers)})

    def answer_by_id(self, question_id):
        if question_id not in self.__answers:
            raise ValueError("{} not exists!".format(question_id))

        if not self.__queue.get(question_id):
            self.__shuffle_answers([question_id])

        return self.__queue[question_id].pop()

    def synchronization(self):
        for question in self.__queue.keys():
            serializer = AnswersQueueSerializer(
                data={"user": self.__user.pk,
                      "question": question,
                      "answers": self.__queue.get(question, [])})

            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)
                break
