define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'text!views/labels/helpers/label.html'
], function( $, _, Backbone, Dispatcher, LabelTemplate ) {

		var LabelView = Backbone.View.extend({

			tagName: "li",
			template: LabelTemplate,

			events: {
				"dragenter": "onDragEnterHandler",
				"dragleave" : "onDragLeaveHandler",
				"drop": "onDragDropHandler",
				"dragover": "onDragOverHandler",
				"click": "onClickLabelHandler"
			},

			initialize: function () {
				_.bindAll(this, 'onModelRemoveHandler', 'render', 'onDeleteItemHandler', 'onSelectedHandler');
				this.model.on("remove", this.onModelRemoveHandler);

				this.model.on("change:selected", this.onSelectedHandler);
			},

			render: function () {
				$(this.el).html(_.template(this.template, this.model.attributes));

				return this;
			},

			onModelRemoveHandler: function(event) {
				this.off();
				this.remove();
			},

			onDeleteItemHandler: function(event) {
				var that = this;
				this.collection.remove(that.model);
			},

			onDragEnterHandler: function(event) {
				event.preventDefault();
			},

			onDragLeaveHandler: function(event) {
				event.preventDefault();
			},

			onDragOverHandler: function(event) {
				event.preventDefault();
			},

			onDragDropHandler: function(event) {
				event.preventDefault();
				event.stopPropagation();
				
				Dispatcher.trigger('mail:tag', {id: event.originalEvent.dataTransfer.getData('text'), tag: this.model.get('title')});
			},
			
			onClickLabelHandler: function(event) {
				Dispatcher.trigger('label:read', {title: this.model.get('title')});
			},

			onSelectedHandler: function(event) {
				$(this.el).toggleClass('active');
			}


		});

	return LabelView;

});