import re

from django.template import Template as DjangoTemplate, Context

from applications.legending.templatetags.inflect import LOAD_TEMPLATE_TAG
from applications.legending.utils import set_noon


def answer_generator(questions_ids, generator):
    res = dict()
    for question_id in questions_ids:
        res[question_id] = (generator.answer_by_id(question_id))
    return res


def generate_title(template, neq):
    __answer_id = r"question_(?P<id>\d+)"

    answers = map(lambda i: int(i), re.findall(__answer_id, template))
    answers = answer_generator(answers, neq)
    answers = set_noon(answers, template)
    template = DjangoTemplate(f'{LOAD_TEMPLATE_TAG}{template}')
    context = {f'question_{key}': value for key, value in answers.items()}
    return template.render(Context(context))


def elements_generator(questions_ids, generator):
    res = dict()
    for question_id in questions_ids:
        res[question_id] = (generator.element_by_id(question_id))
    return res


def generate_titles_with_elements(template, neq):
    __answer_id = r"question_(?P<id>\d+)"

    answers = map(lambda i: int(i), re.findall(__answer_id, template))
    answers = elements_generator(answers, neq)
    answers = set_noon(answers, template)
    template = DjangoTemplate(f'{LOAD_TEMPLATE_TAG}{template}')
    context = {f'question_{key}': value for key, value in answers.items()}
    return template.render(Context(context))
