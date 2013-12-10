define([
	'underscore',
	'backbone'
	], function( _, Backbone) {
		var LabelModel = Backbone.Model.extend({

			defaults: {
				selected: false,
				mnew: 0
			},

			select: function() {
      	this.set({ selected: true });
      },

      deselect: function() {
      	this.set({ selected: false });
      }

		});
		
		return LabelModel;
	});