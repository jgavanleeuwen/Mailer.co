define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'events/notifier',
	'collections/mails',
	'views/mails/mail'
], function( $, _, Backbone, Dispatcher, Notifier, MailsCollection, MailView ) {

		var MailsView = Backbone.View.extend({

			el: "section#search",

			events: {
				"submit form": "onSubmitFormHandler",
				"click .icon-remove": "onResetFormHandler"
			},

			initialize: function () {

				_.bindAll(this, "onCollectionAddHandler", "onMailReadHandler", "onBoxReadHandler", "onNewMailHandler", "onMailMoveHandler", "onMailTagHandler", "onLabelReadHandler", "onSelectNextMailHandler");
				this.template = this.$el.html();
				
				this.collection = new MailsCollection();
				this.collection.on('add', this.onCollectionAddHandler);

				Dispatcher.on('mail:read', this.onMailReadHandler);
				Dispatcher.on('box:read', this.onBoxReadHandler);
				Dispatcher.on('mail:new', this.onNewMailHandler);
				Dispatcher.on('mail:move', this.onMailMoveHandler);
				Dispatcher.on('mail:tag',  this.onMailTagHandler);
				Dispatcher.on('mail:next',  this.onSelectNextMailHandler);
				Dispatcher.on('label:read', this.onLabelReadHandler);

				$(this.el).find('ul').bind('scroll', this.onScrollListHandler);
			},

			render: function () {
				$(this.el).html(this.template);

				return this;
			},

			onCollectionAddHandler: function(model) {
				$(this.el).find('ul').prepend(new MailView({ model: model}).render().el);
			},

			onSubmitFormHandler: function(event) {
				event.preventDefault();
				$('form').find('i').attr('class', 'icon-refresh icon-spin');

				this.collection.fetch({
					data: {
						q: $('#search_input').val()
					},
					success: function(data) {
						$('form').find('i').attr('class', 'icon-remove');
					},
					error: function(error) {
						console.log(error);
					}
				});
			},

			onLabelReadHandler: function(attributes) {
				var that = this;

				this.collection.fetch({
					data: {
						tag: attributes.title
					},
					success: function(collection) {
						//
					},
					error: function(error) {
						console.log(error);
					}
				});
			},

			onResetFormHandler: function(event) {
				$('#search_input').val('').submit();
			},

			onScrollListHandler: function(event) {
				console.log(event);
				if ($(event.target).scrollTop() + $(event.target).height() == event.target.scrollHeight) {
					console.log('END');

				}
			},

			onMailReadHandler: function( attributes ) {

				this.collection.each( function(model) {
					if ( model.get('id') == attributes.id ) {
						if (attributes.ctrlKey && model.get('selected')) {
							model.deselect();
						} else {
							model.select();
						}
					} else {
						if (!attributes.ctrlKey) {
							model.deselect();
						}
					}
				});
			},

			onBoxReadHandler: function(attributes) {
				var that = this;
				this.collection.fetch({
					data: {
						box: attributes.title
					},
					success: function(data) {
						$('h1').html(attributes.title);
						$('#search_input').attr('placeholder', 'Search ' + attributes.title.toLowerCase());
						if(that.collection.length > 0) {
							Dispatcher.trigger('mail:read', {id: that.collection.at(0).get('id') });
						}
					},
					error: function(error) {
						console.log(error);
					}
				});
			},

			onNewMailHandler: function(attributes) {
				
				this.collection.fetch({
					merge: false,
					success: function(collection, response, options) {
						Notifier.notify({ 
							icon: 'images/mail_notification.png', 
							title: 'New e-mail', 
							body: collection.at(0).get('subject')[0], 
							onclick: function() { 
								Dispatcher.trigger('mail:read', { id:collection.at(0).get('id') });
							}
						});
					},
					error: function(collection, response, options) {
						console.log(collection);
					}
				});
			},

			onMailMoveHandler: function(attributes) {
				var that = this;

				this.collection.get(attributes.id).save({ box: attributes.box }, {
					success: function(model, response, options) {
						that.collection.fetch({
							merge: false,
							error: function(collection, response, options) {
								console.log(collection);
							}
						});
					},
					error: function(model, xhr, options) {
						console.log('Error changing box');
					}
				});
			},

			onMailTagHandler: function(attributes) {
				var that = this;

				this.collection.get(attributes.id).save({ keyword: attributes.tag }, {
					success: function(model, response, options) {
						that.collection.fetch({
							merge: true,
							error: function(collection, response, options) {
								console.log(collection);
							}
						});
					},
					error: function(model, xhr, options) {
						console.log('Error changing box');
					}
				});
			},

			onSelectNextMailHandler: function(attributes) {
				var that = this;
				Dispatcher.trigger('mail:read', { id: that.collection.at( that.collection.indexOf(that.collection.get(attributes.id)) + attributes.step ).get('id') });
			}

		});

	return MailsView;

});