define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'events/socketdelegate',
	'collections/boxes',
	'models/box',
	'views/boxes/box',
	'views/labels/labels'
], function( $, _, Backbone, Dispatcher, SocketDelegate, BoxesCollection, BoxModel, BoxView, LabelsView ) {

		var BoxesView = Backbone.View.extend({

			el: "section#boxlist",

			events: {
				'click #compose': "onComposeMailHandler"
			},

			initialize: function () {

				_.bindAll(this, 'onItemAddHandler', 'onBoxReadHandler');
				this.template = this.$el.html();

				this.collection = new BoxesCollection();
				this.collection.on("add", this.onItemAddHandler);

				Dispatcher.on('box:read', this.onBoxReadHandler);

				this.collection.fetch({
					success: function(collection, response, options) {
						Dispatcher.trigger('box:read', {title: 'INBOX'});
						console.log(collection);
					},
					error: function(collection, response, options) {
						console.log(collection);
					}
				});
				//this.collection.add([{ title: 'Inbox', mnew: 5, selected: true }, { title: 'Trash', mnew: 1 }, { title: 'Sent', mnew: 0 }]);
				
				this.labelsView = new LabelsView();
			},

			render: function () {
				$(this.el).html(this.template);



				return this;
			},

			onItemAddHandler: function(model) {
				var that = this;
				$('#boxes').append(new BoxView({ model: model, collection: that.collection}).render().el); 
			},

			onComposeMailHandler: function(event) {
				Dispatcher.trigger('mail:create', {});
			},

			onBoxReadHandler: function(attributes) {
				this.collection.each( function(model) {
					if ( model.get('title') === attributes.title ) { 
						model.select();
					} else {
						model.deselect();
					}
				});
			}

		});

	return BoxesView;

});