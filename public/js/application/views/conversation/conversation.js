define([
	'jquery',
	'underscore',
	'backbone',
	'tinyeditor',
	'events/dispatcher',
	'collections/contacts',
	'models/conversation',
	'views/conversation/attachment',
	'views/contacts/contact',
	'models/attachment',
	'text!views/conversation/helpers/show.html',
	'text!views/conversation/helpers/create.html',
	'text!views/conversation/helpers/reply.html',
	'text!views/conversation/helpers/empty.html'
], function( $, _, Backbone, TinyEditor, Dispatcher, ContactsCollection, ConversationModel, AttachmentView, ContactView, AttachmentModel, ShowTemplate, CreateTemplate, ReplyTemplate, EmptyTemplate ) {

		var ConversationView = Backbone.View.extend({

			el: "section#conversation",
			template: ShowTemplate,

			events: {
				"keyup #headme": "onEnterRecHandler",
				"click #headme": "onEnterRecHandler",
//			"blur #headme": "onBlurRecHandler",
				"click #sendme": "onSendMailHandler",
				"click #replyme": "onReplyMailHandler",
				"click #closeme": "onCloseMailHandler",
				"click #trashme": "onTrashMailHandler",
				"click #selectnext": "onSelectNextHandler",
				"click #selectprev": "onSelectPrevHandler",
				"dragover .droparea": "onFileDragOverHandler",
	      "dragenter .droparea": "onFileDragEnterHandler",
	      "dragleave .droparea": "onFileDragLeaveHandler",
	      "drop .droparea": "onFileDropHandler"
			},

			initialize: function () {

				_.bindAll(this, 'render', 'onChangeIdHandler', 'onMailReadHandler', 'onMailCreateHandler', 'onFileDropHandler', 'onCloseMailHandler', 'onTrashMailHandler');

				this.model = new ConversationModel();
				this.model.on("change:id", this.onChangeIdHandler);
				
				Dispatcher.on('mail:read', this.onMailReadHandler);
				Dispatcher.on('mail:create', this.onMailCreateHandler);

				this.contactsCollection = new ContactsCollection();
				this.contactsCollection.on('change:receiver', function(model){
					$('#headme').before('<span class="newto">' + model.get('name') + '</span>');
					$('.autofill').hide();
					$('#headme').val('');
				});

				this.contactsCollection.fetch({
					success: function(collection, response, options) {
						console.log(collection);
					}
				});
			},

			render: function( callbackfn ) {
				$(this.el).html(_.template(this.template, this.model.attributes));

				_.each(this.model.get('attachments'), function(attachment) {
					$('ul.attachments').append(new AttachmentView({ model: new AttachmentModel(attachment)}).render().el);
				});

				if( typeof callbackfn === 'function') callbackfn();

				return this;
			},

			onChangeIdHandler: function(event) {
				var that = this;
				this.model.fetch({
					success: function(model, response, options) {
						that.render( function() {
							$('#sandbox').contents().find('body').html( that.model.get('html') );
						});
					}
				});
			},

			onMailReadHandler: function(attributes) {
				this.template = ShowTemplate;
				$(this.el).show();
				this.model.set({id: attributes.id});
			},

			onMailCreateHandler: function(attributes) {
				var that = this;
				this.template = CreateTemplate;
				this.render( function() {
					that.editor = new TINY.editor.edit('body', {
						id: 'editme',
						width: '100%',
						css:'body{ padding: 10px; font-family: Arial; color: #444; line-height: 1.8em; }',
						controlclass: 'tinyeditor-control',
						controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', '|', 'leftalign', 'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'font', 'size', 'style', '|', 'cut', 'copy', 'paste']
					});

					that.contactsCollection.each(function(model) {
						$('.autofill').find('ul').append(new ContactView({ model: model}).render().el);
					});

				});
			},

			onEnterRecHandler: function(event) {
				$('.autofill').fadeIn(100);

				if (event.keyCode === 40) {
					event.preventDefault();
				} else if (event.keyCode === 38) {
					event.preventDefault();
				} else if (event.keyCode === 13) {
					event.preventDefault();
					$('.autofill').hide();
				} else {
					this.contactsCollection.filter( $(event.target).val() );
				}
			},

			onBlurRecHandler: function(event) {
				$('.autofill').hide();
			},

			onSendMailHandler: function(event) {
				this.editor.post();
				this.model.save({
					id: null,
					to: $('input[name=to]').val(),
					subject: $('input[name=subject]').val(),
					text: $('#editme').val()
				}, {silent: true});
			},

			onReplyMailHandler: function(event) {
				var that = this;
				this.template = ReplyTemplate;
				this.render( function() {
					that.editor = new TINY.editor.edit('body', {
						id: 'editme',
						width: '100%',
						css:'body{ padding: 10px; font-family: Arial; color: #444; line-height: 1.8em; }',
						controlclass: 'tinyeditor-control',
						controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', '|', 'leftalign', 'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'font', 'size', 'style', '|', 'cut', 'copy', 'paste']
					});

					Dispatcher.trigger('mail:tag', { id: that.model.get('id'), tag: '\\Answered' });

		    });
			},

			onCloseMailHandler: function(event) {
				$(this.el).hide();
			},

			onTrashMailHandler: function(event) {
				Dispatcher.trigger('mail:move', {box: 'Trash', id: this.model.get('id')});
			},

			onSelectNextHandler: function(event) {
				Dispatcher.trigger('mail:next', {id: this.model.get('id'), step: 1 });
			},

			onSelectPrevHandler: function(event) {
				Dispatcher.trigger('mail:next', {id: this.model.get('id'), step: -1 });
			},

			onFileDragEnterHandler: function(event) {
				event.stopPropagation();
				event.preventDefault();
			},

			onFileDragOverHandler: function(event) {
				event.stopPropagation();
				event.preventDefault();
			},

			onFileDragLeaveHandler: function(event) {
			},

			onFileDropHandler: function(event) {
				event.stopPropagation();
				event.preventDefault();


				var fileReader = new FileReader();
				var file = event.originalEvent.dataTransfer.files[0];
				var self = this;

				$('.droparea').prepend('<span><i class="icon-spinner"/> ' + file.name + ' (' +  file.size + ')  </span>');

				fileReader.onloadstart = function(event) {
				}

				fileReader.onload = function(event) {
					self.model.attributes.attachments.push({ name: file.name, type: file.type, data: event.target.result, encoded: true });
					$('.droparea span i').attr('class', 'icon-ok');
				}

				fileReader.onprogress = function(event) {
					// PROGRESS
				}

				fileReader.readAsDataURL(file);
			}



		});

	return ConversationView;

});