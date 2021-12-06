import re
import unicodedata

import pymorphy2
from django.utils.http import urlquote


def set_noon(answers, template):
    __noon_re = re.compile(r'setNoon:"(?P<get_id>\d+),(?P<set_id>\d+)"')
    morph = pymorphy2.MorphAnalyzer()

    for i in __noon_re.finditer(template):
        items = i.groupdict()
        get_value = answers.get(int(items.get('get_id')))
        set_value = answers.get(int(items.get('set_id')))
        try:
            noon = morph.parse(get_value)[0].tag.gender
        except Exception:
            continue

        res_value = morph.parse(set_value)[0].inflect({noon})

        answers[int(items.get('set_id'))] = res_value.word if res_value else answers[int(items.get('set_id'))]

    return answers


def rfc5987_content_disposition(file_name):
    ascii_name = unicodedata.normalize('NFKD', file_name).encode('ascii', 'ignore').decode()
    header = 'attachment; filename="{}"'.format(ascii_name)
    if ascii_name != file_name:
        quoted_name = urlquote(file_name)
        header += '; filename*=UTF-8\'\'{}'.format(quoted_name)

    return header
