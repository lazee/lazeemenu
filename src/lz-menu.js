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
            var activeIndex = -1;
            var activeSubIndex = -1;

            self.$el.addClass('lz-menu');
            self.$el.find('> ul > li').each(function(idx) {
                var sub = $(this);

                // Append arrows
                sub.find('> h3').prepend(self._arrowBtn());
                sub.find('> ul > li > h3').prepend(self._arrowBtn());

                // Add indexes and collapse all
                sub.attr('lz-index', idx);
                sub.find('> ul > li').each(function(subidx) {
                    $(this).find('> h3').parent().attr('lz-index', idx + '-' + subidx);
                    $(this).attr('style', 'display: none');
                    $(this).find('> ul > li').each(function() {
                        $(this).attr('style', 'display: none');
                    });
                });

                // Find active link (only one allowed, and first selected)
                sub.find('> ul > li').each(function(subidx) {
                    var item = $(this);
                    if (item.hasClass(self.options.activeClass)) {
                        activeIndex = idx;
                    }
                    item.find('> ul > li').each(function() {
                        if ($(this).hasClass(self.options.activeClass)) {
                            activeIndex = idx;
                            activeSubIndex = subidx;
                        }

                    });
                    // Also add click event while we are in the loop
                    self._addClickEvents(item, idx + '-' + subidx);
                });
                self._addClickEvents(sub, idx);
            });

            if (activeIndex > -1 && activeSubIndex > -1) {
                self._toggle(activeIndex, 'expand');
                self._toggle(activeIndex + '-' + activeSubIndex, 'expand');
            } else if (activeIndex > -1) {
                self._toggle(activeIndex, 'expand');
            }
        },
        _addClickEvents: function(sub, idx) {
            var self = this;
            sub.find('> h3 > a.arrow-btn').on('click', function(event) {
                event.stopPropagation();
                self._toggle(idx, 'toggle');
            });
            sub.find('> h3 > span').on('click', function(event) {
                event.stopPropagation();
                self._toggle(idx, 'toggle');
            });
        },
        _arrowBtn: function() {
            return '<a href="#" class="arrow-btn"></a>';
        },
        _toggle: function(index, action) {
            self = this;
            self.$el.find('li[lz-index=\'' + index + '\'] > h3 > a.arrow-btn').each(function() {
                if (action == 'toggle') {
                    if ($(this).hasClass('expanded')) {
                        $(this).removeClass('expanded');
                        $(this).parent().parent().find('> ul > li').attr('style', 'display: none');
                    } else {
                        $(this).addClass('expanded');
                        $(this).parent().parent().find('> ul > li').attr('style', 'display: block');
                    }
                } else if (action == 'expand') {
                    if (!$(this).hasClass('expanded')) {
                        $(this).addClass('expanded');
                        $(this).parent().parent().find('> ul > li').attr('style', 'display: block');
                    }
                } else {
                    if ($(this).hasClass('expanded')) {
                        $(this).removeClass('expanded');
                        $(this).parent().parent().find('> ul > li').attr('style', 'display: none');
                    }
                }
            })
        },
        expandAll: function() {
            var self = this;
            self.$el.find('li[lz-index]').each(function(idx) {
                self._toggle($(this).attr('lz-index'), 'expand');
            });
        },
        collapseAll: function() {
            var self = this;
            self.$el.find('li[lz-index]').each(function(idx) {
                self._toggle($(this).attr('lz-index'), 'collapse');
            });
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
