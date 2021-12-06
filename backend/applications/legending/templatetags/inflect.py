import pymorphy2
from django.template import Library

register = Library()

LOAD_TEMPLATE_TAG = '{% load inflect %}\n'


@register.filter(name='inflect')
def inflect(value, args):
    morph = pymorphy2.MorphAnalyzer()
    parse_value = morph.parse(value)[0]
    grammar = set(args.split(','))
    result = parse_value.inflect(grammar) if parse_value else value
    return result.word if result else value


@register.filter(name='setNoon')
def set_noon(value, args):
    return value

@register.filter(name='capitalize')
def capitalize(value):
    return value[0].upper() + value[1:]
