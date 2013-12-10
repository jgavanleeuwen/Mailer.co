define([
	'jquery',
	'underscore',
	'backbone',
	'soundmanager',
	'events/dispatcher',
	'models/attachment',
	'text!views/conversation/helpers/attachment.html'
], function( $, _, Backbone, SoundManager, Dispatcher, AttachmentModel, AttachmentTemplate ) {

		var ConversationView = Backbone.View.extend({

			tagName: 'li',
			template: AttachmentTemplate,

			events: {
				"click": "onViewHandler"
			},

			initialize: function () {
				_.bindAll(this, 'render', 'onViewHandler');
				this.soundManager = new SoundManager();
			},

			render: function() {
				$(this.el).html(_.template(this.template, this.model.attributes));

				return this;
			},

			onViewHandler: function(event) {
				var self = this;
				this.soundManager.setup({
				  url: '/swf/',
				  preferFlash: false,
				  onready: function() {
				    var mySound = self.soundManager.createSound({
				      id: 'aSound',
				      url: 'http://localhost:3000/attachment/04 - Within.mp3'
				    });
				    mySound.play();
				  },
				  ontimeout: function() {
				    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
				  }
				});

				//window.open('http://localhost:3000/attachment/' + this.model.get('fileName'), 'File');
			}

		});

	return ConversationView;

});