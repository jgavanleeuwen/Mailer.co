define([
	'underscore',
	'backbone',
	'models/contact'
	], function( _, Backbone, ContactModel ) {

		var ContactsCollection = Backbone.Collection.extend({

			model: ContactModel,

			urlRoot: "http://localhost:3000/contacts",

			url: function() {
				return this.urlRoot;
			},

			filter: function( query ) {
				this.each( function(model) {
					model.set({ visible: model.get('name').search(query) + 1 });
				});
			}

		});

		return ContactsCollection;

});