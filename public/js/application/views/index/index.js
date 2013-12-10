define([
	'jquery',
	'underscore',
	'backbone',
	'views/mails/mails',
	'views/conversation/conversation',
	'views/boxes/boxes',
	'views/index/header'
	], function($, _, Backbone, MailsView, ConversationView, BoxesView, HeaderView) {
		var indexView = Backbone.View.extend({
			el: 'body',

			initialize: function() {
				this.template = this.$el.html();
			},

			render: function() {
				$(this.el).html(_.template(this.template));

				window.App.views.MailsView = new MailsView();
				window.App.views.ConversationView = new ConversationView();
				window.App.views.BoxesView = new BoxesView();
				window.App.views.HeaderView = new HeaderView();
			}
		});
		
		return new indexView();
	});