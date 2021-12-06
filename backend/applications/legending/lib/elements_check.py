import json
import pymorphy2

from applications.legending.models import *


def elements_check_by_condition(elements_list, condition):
    # Todo: Условие с частями речи работает только для одного слова

    errors = list()
    condition = json.loads(condition)
    if Check.WORD_NUMBERS_KEY in condition.keys():
        for element in elements_list:
            row = element.get('text').strip().split(' ')
            if not (condition[Check.WORD_NUMBERS_KEY]['min'] <= len(row) <= condition[Check.WORD_NUMBERS_KEY]['max']):
                if condition[Check.WORD_NUMBERS_KEY]['min'] == condition[Check.WORD_NUMBERS_KEY]['max']:
                    error_msg = f'''Ответ должен содержать {condition[Check.WORD_NUMBERS_KEY]['min']} {'слово' if condition[Check.WORD_NUMBERS_KEY]['min'] == 1 else 'слова' if 1 < condition[Check.WORD_NUMBERS_KEY]['min'] < 5 else 'слов'}'''
                else:
                    error_msg = f'''Ответ должен содержать не менее {condition[Check.WORD_NUMBERS_KEY]['min']} и не более {condition[Check.WORD_NUMBERS_KEY]['max']} слов'''

                errors.append({'id': element.get('id'), 'error': error_msg})
    elif Check.SPEECH_TYPE_KEY in condition.keys():
        morph = pymorphy2.MorphAnalyzer()

        for element in elements_list:
            row = element.get('text').strip().split(' ')
            if len(row) > 1:
                # Todo: Пока только для одного слова
                errors.append(
                    {'id': element.get('id'), 'error': "Пока не могу проверять части речи для нескольких слов"})
            else:
                m = morph.parse(row[0])
                error_msg = f'''Ответ должен содержать {', '.join(Check.SPEECH_VALUE_CHOICES._display_map.get(value).lower() for value in condition[Check.SPEECH_TYPE_KEY])}'''
                for parse in m:
                    if parse.tag.POS in condition[Check.SPEECH_TYPE_KEY]:
                        break
                else:
                    errors.append({'text': element.get('text'), 'error': error_msg})
    else:
        raise Exception("METHOD NOT RELEASED!!!")

    return errors


def element_check(elements_list, question_id):
    checks = Check.objects.all().filter(question=question_id)
    if not checks:
        return False

    res = False
    errors = []
    for check in checks:
        errors = elements_check_by_condition(elements_list, check.condition)
        if errors:
            break
    else:
        res = True

    return res, errors
