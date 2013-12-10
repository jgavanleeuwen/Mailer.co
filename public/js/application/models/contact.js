define([
	'underscore',
	'backbone'
	], function( _, Backbone) {
		var ContactModel = Backbone.Model.extend({

			defaults: {
				name: 'Name des Blancs',
				mail: 'info@provier.nl',
				type: 'single',
				visible: true
			}

		});
		
		return ContactModel;
	});