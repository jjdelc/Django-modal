.. Django-modal documentation master file, created by
   sphinx-quickstart on Thu Jun 30 15:34:00 2011.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Django-modal's documentation!
========================================

Contents:

.. toctree::
   :maxdepth: 4

About
=====

Django-modal aims to make the usage of modal windows less painful. Once you're set up, changing a view into a modal window should cost very little effort.

It degrades gracefully mantaining normal Http flow when Javascript is disabled.

Supports POST form submit within a modal window.


Instalation
===========

* Add `'modal'` to your `INSTALLED_APPS` (so it collects the STATIC and finds the templates)
* Add the `modal.context_processors.extend_from` to your `CONTEXT_PROCESSORS` settings (`Remember to declare the default values <https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors>`).
* Use the `redirect_unless_ajax` helper or ModalPost mixin in your views.

Usage
=====

Context processors
------------------

modal.context_processors.extend_from

    Will add an 'extend_from' variable to the template using the get_base_template helper. 
    
    The templates inheriting from extend_from will behave properly within modal windows.

    This allows you to do the following in your templates:
    ::
        {% extends extend_from %}

Helpers
-------

modal.views.redirect_unless_ajax 
    When submitting a form via POST, you should return an HttpResponseRedirect on success, or a regular HttpResponse (status 200) on failure.

    When working within a modal window you should always return a HttpResponse (status 200) on success or failure in order for the modal window to display the errors form or a success message.

    Instead of doing this:
    ::
        if request.method == 'POST':
            if form.is_valid():
                form.save()
                messages.info(request, success_message)
                return HttpResponseRedirect(success_url)

    You'd do this:
    ::
        if request.method == 'POST':
            if form.is_valid():
                form.save()
                # messages.info(request, success_message) # Optional
                return redirect_unless_ajax(request, success_url, success_message)

    This will take care of using the correct modal template to display the success message within the modal window before closing.

    This will also handle the non-modal scenario and perform a regular redirect in case the action didn't took place inside a modal window.

modal.views.get_base_template

    This function is used by the extend_from context_processor to determine which template to use if the request was called via ajax or not (relies on the request's is_ajax() method).


Class Based Views
-----------------

modal.views.ModalMixin

    The ModalMixin class, inplements a modal_response method that works as a view (Being a callable that takes a request and returns an HttpResponse) that returns using the redirect_unless_ajax helper as appropiate.

    This class has two attributs that can be set:

    success_message
        Defaults as `None`. You should set this with a message such as "Item deleted", as it will be displayed in the modal window after a successful POST.

    message_template
        Defaults to 'modal/confirmation.html' which will just render the success message in the modal window before closing.

modal.views.ModalPost

    Inherits from ModalMixin. 

    This class view will override the subclasses post() method so it returns the necessary response according to redirect_unless_ajax logic.

    You whould use it like this
    ::
        class DelegeMyObjectView(ModalPost, DeleteView):
            template_name = 'my_delete_confirmation.html'

Settings
--------

MODAL_DEFAULT_BASE
    Defaults to "base.html". This will be the template to inherit from when the content is not within a modal window. Otherwise it will use 'modal/base.html'

Templates and Javascript
------------------------

Now that you've set up the backend, you need to add the 'open-modal' class to any link that you want to be open inside a modal window.

To activate the modal links, you should start the ModalPanels machinery on your page's load. Add this to your base template.

Required CSS file:
::
    <link href="{{STATIC_URL}}css/modal.css" rel="stylesheet"/>


Required Javascript:
::
    <script src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
    <script src="{{STATIC_URL}}js/jquery.simplemodal.1.4.1.min.js"></script>
    <script src="{{STATIC_URL}}js/modal.js"></script>
    <script>
        $(document).ready(function(){
            ModalPanel.init();
        });
    </script>


You should place jQuery and jQuery Simple Modal somewhere where Django's Static file finders can find them.

Dependencies
============

At the moment, Django-modal is designed to work with jQuery (http://jquery.com/) and jQuery Simple modal (http://www.ericmmartin.com/projects/simplemodal/)
