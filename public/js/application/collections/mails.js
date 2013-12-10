define([
	'underscore',
	'backbone',
	'models/mail'
	], function( _, Backbone, MailModel ) {

		var MailsCollection = Backbone.Collection.extend({

			model: MailModel,

			initialize: function() {
			},

			urlRoot: 'http://localhost:3000/boxes/INBOX/mail',

			url: function() {
				return this.urlRoot;
			},

			comparator: function(model) {
				return -model.get('id');
			}
		});

		return MailsCollection;

});