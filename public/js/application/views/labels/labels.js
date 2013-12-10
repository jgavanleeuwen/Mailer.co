define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'events/socketdelegate',
	'models/label',
	'collections/labels',
	'views/labels/label'
], function( $, _, Backbone, Dispatcher, SocketDelegate, LabelModel, LabelsCollection, LabelView ) {

		var LabelsView = Backbone.View.extend({

			el: "ul#labels",

			events: {
				'submit form': "onSubmitFormHandler"
			},

			initialize: function () {

				_.bindAll(this, 'onItemAddHandler', 'onSubmitFormHandler', 'onLabelReadHandler');
				this.template = this.$el.html();

				this.collection = new LabelsCollection();
				this.collection.on("add", this.onItemAddHandler);

				Dispatcher.on('label:read', this.onLabelReadHandler);
				
				this.collection.fetch({
					success: function(collection, response, options) {
						//
					},
					error: function(collection, response, options) {
						console.log(collection);
					}
				});
				
			},

			render: function () {
				$(this.el).html(this.template);

				return this;
			},

			onItemAddHandler: function(model) {
				var that = this;
				console.log(model);
				$('#labels').prepend(new LabelView({ model: model }).render().el); 
			},

			onSubmitFormHandler: function(event) {
				event.preventDefault();
				
				this.collection.create({ title: $('#newlabel').val() });
				$('#newlabel').val('');
			},

			onLabelReadHandler: function(attributes) {
				this.collection.each( function(model) {
					if ( model.get('title') === attributes.title ) { 
						model.select();
					} else {
						model.deselect();
					}
				});
			}

		});

	return LabelsView;

});