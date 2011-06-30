# -*- coding: utf-8 -*-

from modal.helpers import get_base_template

def extend_from(request):
    return {
        'extend_from': get_base_template(request)
    }

