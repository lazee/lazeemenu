(function($) {
    "use strict";

    var Plugin = function(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = options;
        this.init();
        return this;
    };

    Plugin.prototype = {
        init: function() {
            var self = this;
            self.$el.find('> ul > li').each(function(idx) {
                var sub = $(this);
                var expanded = false;
                sub.find('> ul > li').each(function () {
                    var item = $(this);
                    if (item.hasClass(self.options.activeClass)) {
                        expanded = true;
                    }
                });
                sub.find('> h3').each(function() {
                    $(this).prepend('<a href="#" class="arrow-btn ' + (expanded ? 'expanded' : '') + '"></a>');
                });
                sub.find('> ul > li').each(function() {
                    $(this).attr('style', 'display: ' + (expanded ? 'block' : 'none') );
                });
                sub.find('> h3 > a.arrow-btn').each(function() {
                    $(this).on('click', function(event) {
                        event.stopPropagation();
                        self._toggle($(this).parent(), 'toggle');
                    })
                });
                sub.find('> h3 > span').each(function() {
                    $(this).on('click', function(event) {
                        event.stopPropagation();
                        self._toggle($(this).parent(), 'toggle');
                    })
                });
            });
        },
        _toggle: function(sub, action) {
            sub.find('> a.arrow-btn').each(function() {
                if (action == 'toggle') {
                    if ($(this).hasClass('expanded')) {
                        $(this).removeClass('expanded');
                        $(this).parent().parent().find('> ul > li').each(function() {
                            $(this).attr('style', 'display: none');
                        });
                    } else {
                        $(this).addClass('expanded');
                        $(this).parent().parent().find('> ul > li').each(function() {
                            $(this).attr('style', 'display: block');
                        });
                    }
                } else if (action == 'expand') {
                    if (!$(this).hasClass('expanded')) {
                        $(this).addClass('expanded');
                        $(this).parent().parent().find('> ul > li').each(function() {
                            $(this).attr('style', 'display: block');
                        });
                    }
                } else {
                    if ($(this).hasClass('expanded')) {
                        $(this).removeClass('expanded');
                        $(this).parent().parent().find('> ul > li').each(function() {
                            $(this).attr('style', 'display: none');
                        });
                    }
                }
            })
        },
        expandAll: function() {
            var self = this;
            self.$el.find('> ul > li > h3 > a.arrow-btn').each(function(idx) {
                self._toggle($(this).parent(), 'expand');
            })
        },
        collapseAll: function() {
            var self = this;
            self.$el.find('> ul > li > h3 > a.arrow-btn').each(function(idx) {
                self._toggle($(this).parent(), 'collapse');
            })
        },
        destroy: function() {
            $.removeData(this.$el);
            this.$el.find("> ul > li > h3 > a").unbind('click');
            this.$el.find("> ul > li > h3 > span").unbind('click');
        }
    };

    $.fn.lazeemenu = function(options) {
        if (typeof options === 'string' && options.charAt(0) !== '_' && options !== 'init') {
            var callback = true,
                args = Array.prototype.slice.call(arguments, 1);
        } else {
            options = $.extend({}, $.fn.lazeemenu.defaults, options || {});
        }
        return this.each(function(idx) {
            var $this = $(this),
                obj = $this.data('lazeemenu');

            if (!obj) {
                obj = new Plugin(this, callback ? $.fn.lazeemenu.defaults : options, idx);
                $this.data('lazeemenu', obj);
            }
            if (callback) {
                obj[options].apply(obj, args);
            }
        });
    };

    $.fn.lazeemenu.defaults = {
        activeClass: 'active'
    };

})(jQuery);
