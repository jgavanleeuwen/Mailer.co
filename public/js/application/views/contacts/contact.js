define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'models/contact',
	'text!views/contacts/helpers/contact.html'
], function( $, _, Backbone, Dispatcher, ContactModel, ContactTemplate ) {

		var ContactView = Backbone.View.extend({

			tagName: 'li',
			template: ContactTemplate,

			events: {
				"click": "onContactClickHandler"
			},

			initialize: function () {
				_.bindAll(this, 'render', 'onContactClickHandler', 'onChangeVisibleHandler');
				
				this.model.on('change:visible', this.onChangeVisibleHandler);
				this.model.on('change:highlight', this.onHighlightHandler);
			},

			render: function() {
				$(this.el).html(_.template(this.template, this.model.attributes));

				return this;
			},

			onContactClickHandler: function(event) {
				this.model.set({ receiver: true });
			},

			onChangeVisibleHandler: function(event) {
				if (this.model.get('visible')) {
					$(this.el).show();
				} else {
					$(this.el).hide();
				}
			}

		});

	return ContactView;

});