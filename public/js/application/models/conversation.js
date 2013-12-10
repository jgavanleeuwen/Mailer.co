define ([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var ConversationModel = Backbone.Model.extend({

		types: {
			'application/msword': 'doc',
			'application/pdf': 'pdf',
			'image/png': 'png',
			'audio/mpeg': 'mp3'
		},

		defaults: {
			attachments: [],
			text: 'Mail',
			subject: '',
			name: ''
		},

		urlRoot: function() {
			return "http://localhost:3000/boxes/INBOX/mail/";
		},

		parse: function(response) {
			console.log(response);
			return response[0];
		}

	});

	return ConversationModel;
});