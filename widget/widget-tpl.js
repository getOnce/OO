define(['common/widget/widget', 'common/util/template'], function(Widget, template) {
    "use strict";
    return Widget.createClass({
        html: function(data) {
            var tpl = this.template();
            var html = template.render(tpl, data);
            return html;
        },
        template: function() {
            return $(this.$template).html();
        },
        render: function(data) {
            this.$()[this.append ? 'append' : 'html'](this.html(data));
        }
    }, {
        append: true,
        $template: '#tpl'
    });
});