define([
	'underscore',
	'backbone'
	], function( _, Backbone) {
		var MailModel = Backbone.Model.extend({

			defaults: {
				selected: false,
				checked : false
			},

      select: function() {
      	this.set({ selected: true });
      },

      deselect: function() {
      	this.set({ selected: false });
      }

		});
		
		return MailModel;
	});