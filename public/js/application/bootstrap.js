require.config({
	paths: {
		// Libs
		jquery: '../libs/jquery/jquery.min',
		underscore: '../libs/underscore/underscore.min',
		backbone: '../libs/backbone/backbone.min',
		socketio: '../libs/socket.io/socket.io.min',
		soundmanager: '../libs/soundmanager/soundmanager2.min',

		// Plugins
		tinyeditor: '../plugins/tinyeditor/tiny.editor'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		soundmanager: {
			exports: 'SoundManager'
		},
		tinyeditor: {
			exports: 'TinyEditor'
		}
	},
	deps: ["main"]
});