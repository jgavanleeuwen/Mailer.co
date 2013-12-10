define([
	'underscore',
	'backbone',
	'models/box'
	], function( _, Backbone, BoxModel ) {

		var BoxesCollection = Backbone.Collection.extend({

			model: BoxModel,

			urlRoot: "http://localhost:3000/boxes",

			url: function() {
				return this.urlRoot;
			},

			parse: function(response) {
				_.map(response, function(value, key) {
					value.title = key;
					return value;
				});
				return _.toArray(response);
			}

		});

		return BoxesCollection;

});