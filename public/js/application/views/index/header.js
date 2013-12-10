define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher'
], function($, _, Backbone, Dispatcher) {
		var HeaderView = Backbone.View.extend({
			el: 'header',

			initialize: function() {
				this.template = this.$el.html();
			},

			events: {
				'click #composeicon': 'onComposeClickHander'
			},

			render: function() {
				$(this.el).html(_.template(this.template));
			},

			onComposeClickHander: function(event) {
				Dispatcher.trigger('mail:create', {});
			}
		});
		
		return HeaderView;
	});