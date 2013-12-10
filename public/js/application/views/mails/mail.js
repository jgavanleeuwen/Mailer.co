define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'models/mail',
	'text!views/mails/helpers/mail.html',
	'text!views/mails/helpers/contextmenu.html'
], function( $, _, Backbone, Dispatcher, MailModel, MailTemplate, ContextTemplate ) {

		var MailView = Backbone.View.extend({

			tagName: "li",
			template: MailTemplate,

			events: {
				"click": "onMailClickHandler",
				"dragstart": "onDragStartHandler",
				"dragend": "onDragEndHandler",
				"click i.icon-check-empty": "onCheckHandler",
				"click i.icon-star": "onFlagStarredHandler",
				"contextmenu": "onRightClickHandler",
				"markasunseen": "onMarkAsUnseenHandler"
			},

			initialize: function () {
				_.bindAll(this, 'onModelRemoveHandler', 'render', 'onSelectedHandler', 'onChangeFlagsHandler', 'onRightClickHandler', 'onMarkAsUnseenHandler');

				this.model.on("remove", this.onModelRemoveHandler);
				this.model.on("change:selected", this.onSelectedHandler);
				this.model.on("change:flags", this.onChangeFlagsHandler);
			},

			render: function () {
				$(this.el).html(_.template(this.template, this.model.attributes));

				return this;
			},

			onModelRemoveHandler: function(event) {
				this.off();
				this.remove();
			},

			onMailClickHandler: function(event) {
				var newFlags = _.clone(this.model.get('flags'));
	      if (!_.contains(newFlags, '\\Seen')) {
	      	newFlags.push('\\Seen');
	      }
	      this.model.set('flags', newFlags);

				Dispatcher.trigger('mail:read', {id: this.model.get('id'), shiftKey: event.shiftKey, ctrlKey: event.ctrlKey });
			},

			onDragStartHandler: function(event) {
				event.originalEvent.dataTransfer.setData("text", this.model.get('id'));
			},

			onDragEndHandler: function(event) {
				event.preventDefault();
			},

			onSelectedHandler: function(event) {
				$(this.el).toggleClass('active');
			},

			onCheckHandler: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$(event.target).attr('class', 'icon-check');
				this.model.set({ checked: true });
			},

			onFlagStarredHandler: function(event) {
				event.preventDefault();
				event.stopPropagation();

				var newFlags = _.clone(this.model.get('flags'));
	      if (_.contains(newFlags, '\\Flagged')) {
	      	newFlags = _.without(newFlags, '\\Flagged');
	      } else {
	      	newFlags.push('\\Flagged');
	      }
	      this.model.set('flags', newFlags);
			},

			onChangeFlagsHandler: function(event) {
				var that = this;

				this.model.save( null, {
					success: function(model, response, options) {
						that.render();
					},
					error: function(model, xhr, options) {
						console.log('Error setting flags');
					}
				});					
			},

			onRightClickHandler: function(event) {
				event.preventDefault();
			}, 

			onMarkAsUnseenHandler: function(event) {
				event.preventDefault();
				event.stopPropagation();

				console.log('THIS IS UNSEEN');
			}

		});

	return MailView;

});