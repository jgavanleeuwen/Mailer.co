define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'views/index/index'
	], 
	function($, _, Backbone, Dispatcher, IndexView) {
		var AppRouter = Backbone.Router.extend({

			// Routes
			routes: {
				':id': 'mail',
				'*actions': 'index'
			},

			// Actions
			index: function() {
				IndexView.render();
			},

			mail: function(id) {
				if(isNaN(id)) {	
					Dispatcher.trigger('box:read', {title: id});
				} else {
					Dispatcher.trigger('mail:read', {id: id});
				}
			}
		});

		return AppRouter;
	});
