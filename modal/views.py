# -*- coding: utf-8 -*-

from modal.helpers import redirect_unless_ajax

class ModalMixin(object):
    success_message = None
    message_template = 'modal/confirmation.html'
    def modal_response(self, request):
        return redirect_unless_ajax(request, self.get_success_url(),
            self.success_message, self.message_template)

class ModalPost(ModalMixin):
    
    def post(self, request, *args, **kwargs):
        resp = super(ModalPost, self).post(request, *args, **kwargs)
        return self.modal_response(request)
