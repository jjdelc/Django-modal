var ModalPanels = {
    prepareModalForms: function(){
        var $modalContainer = $('simplemodal-container');
        $('.modal input[type=submit]').live('click', function(){
            var form = this.form;
            var that = this;
            $[form.method](form.action, $(form).serialize(), function(data){
                $data = $(data);
                $this_modal = $(that).parents('.modal');
                $this_modal.html($data.html());
                // Execute the retrieved SQL as $() messes with <script/>
                // http://goo.gl/4Clt
                $data.filter('script').each(function(){
                    $.globalEval(this.text||this.textContent||this.innerHTML);
                });

                if ($data.find('#delay-close').length) {
                    $this_modal.fadeOut();
                    var delay_close = $data.find('#delay-close').val();
                    setTimeout(function(){
                        $.modal.close();
                    }, parseInt(delay_close)*1000);
                }

                if ($data.find('#reload').length) {
                    $this_modal.fadeOut();
                    window.location.reload();
                }

                if ($data.find('#reload-to').length) {
                    $this_modal.fadeOut();
                    window.location = $('#reload-to').val();
                }
            });
            return false;
        });
    },
    openModal: function(dest, local) {
        if (local) {
            var hash = dest.split('#')[1];
            $('#' + hash).modal();
        } else {
            $.get(dest, function(data){
                $.modal(data, {
                    onShow: function(dlg) {
                        $(dlg.container).css('height', 'auto');
                    }
                });
            });
        }
    },
    bindModalLinks: function(){
        $('a.open-modal').click(function(){
            ModalPanels.openModal(this.href);
            return false;
        });
        $('a.local-modal').click(function(){
            ModalPanels.openModal(this.href, true);
            return false;
        });
    },
    bindCloseModal: function(){
        $('.modal a.close-modal').live('click', function(){
            $.modal.close();
            return false;
        });
    },
    init: function(){
        this.bindModalLinks();
        this.bindCloseModal();
        this.prepareModalForms();
    }
}
