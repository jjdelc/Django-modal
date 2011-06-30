# -*- coding: utf-8 -*-

from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import render

def redirect_unless_ajax(request, destination, message='',
    message_template='modal/confirmation.html'):
    """
    If the request is an ajax request, then return a template
    with the message.
    Otherwise return a HttpResponseRedirect
    """

    if request.is_ajax():
        return render(request, message_template, {
            'message': message,
            'reload_to': destination,
        })

    return HttpResponseRedirect(destination)

def get_base_template(request, default='base.html'):
    """
    Returns a base template or a modal template
    """
    
    default_base = getattr(settings, 'MODAL_DEFAULT_BASE', default)

    if request.is_ajax():
        return 'modal/base.html'

    return default_base
