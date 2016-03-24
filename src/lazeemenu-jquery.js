/* global jQuery */
(function($) {
    "use strict";

    var Plugin = function(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = options;
        this.init();
        return this;
    };

    Plugin.prototype.init = function() {
        var self = this;
        var activeIndex = -1;
        var activeSubIndex = -1;

        self.$el.addClass('lz-menu');
        self.$el.find('> li').each(function(idx) {
            console.log('foo', $(this));
            var sub = $(this);

            // Append arrows
            sub.find('> h3').each(function() {
                $(this).prepend(self._arrowBtn());
                $(this).addClass('collapsed');
            });
            sub.find('> ul > li > h3').prepend(self._arrowBtn());

            // Add indexes and collapse all
            sub.attr('data-lz-index', idx);
            sub.find('> ul > li').each(function(subidx) {
                $(this).find('> h3').parent().attr('data-lz-index', idx + '-' + subidx);
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

        if (self.options.initialState === 'expand') {
            self.expandAll();
        } else if (self.options.initialState === 'collapse') {
            // Already collapsed
        } else {
            if (activeIndex > -1 && activeSubIndex > -1) {
                self._toggle(activeIndex, 'expand');
                self._toggle(activeIndex + '-' + activeSubIndex, 'expand');
            } else if (activeIndex > -1) {
                self._toggle(activeIndex, 'expand');
            }
        }
    };

    Plugin.prototype._addClickEvents = function(sub, idx) {
        var self = this;
        sub.find('> h3 > a.arrow-btn').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            self._toggle(idx, 'toggle');
        });
        sub.find('> h3 > span').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            self._toggle(idx, 'toggle');
        });
    };

    Plugin.prototype._arrowBtn = function() {
        return '<a href="#" class="arrow-btn"></a>';
    };

    Plugin.prototype._toggle = function(index, action) {
        var self = this;
        self.$el.find('li[data-lz-index=\'' + index + '\'] > h3 > a.arrow-btn').each(function() {
            if (action === 'toggle') {
                if ($(this).hasClass('expanded')) {
                    $(this).parent().removeClass('expanded');
                    $(this).parent().addClass('collapsed');
                    $(this).removeClass('expanded');
                    $(this).addClass('collapsed');
                    $(this).parent().parent().find('> ul > li').each(function() {
                        var elem = $(this);
                        elem.slideUp(100, function() {
                            elem.attr('style', 'display: none');
                        });
                    });
                } else {
                    $(this).parent().removeClass('collapsed');
                    $(this).parent().addClass('expanded');
                    $(this).removeClass('collapsed');
                    $(this).addClass('expanded');
                    $(this).parent().parent().find('> ul > li').each(function() {
                        var elem = $(this);
                        elem.slideDown(100, function() {
                            elem.attr('style', 'display: block');
                        });
                    });
                }
            } else if (action === 'expand') {
                if (!$(this).hasClass('expanded')) {
                    $(this).parent().addClass('expanded');
                    $(this).parent().removeClass('collapsed');
                    $(this).addClass('expanded');
                    $(this).removeClass('collapsed');
                    $(this).parent().parent().find('> ul > li').attr('style', 'display: block');
                }
            } else {
                if ($(this).hasClass('expanded')) {
                    $(this).parent().removeClass('expanded');
                    $(this).parent().addClass('collapsed');
                    $(this).removeClass('expanded');
                    $(this).addClass('collapsed');
                    $(this).parent().parent().find('> ul > li').attr('style', 'display: none');
                }
            }
        });
    };

    Plugin.prototype.expandAll = function() {
        var self = this;
        self.$el.find('li[data-lz-index]').each(function() {
            self._toggle($(this).attr('data-lz-index'), 'expand');
        });
    };

    Plugin.prototype.collapseAll = function() {
        var self = this;
        self.$el.find('li[data-lz-index]').each(function() {
            self._toggle($(this).attr('data-lz-index'), 'collapse');
        });
    };

    Plugin.prototype.destroy = function() {
        $.removeData(this.$el);
        this.$el.find("> ul > li > h3 > a").unbind('click');
        this.$el.find("> ul > li > h3 > span").unbind('click');
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
        activeClass: 'active',
        initialState: 'default'
    };

})(jQuery);
