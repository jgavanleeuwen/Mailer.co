define([
	'underscore',
	'jquery',
	'backbone',
	'socketio',
	'events/dispatcher'
	], function($, _, Backbone, Socket, Dispatcher) {

		var socket;

		function initialize(url) {
			socket = io.connect(url);

			var $emit = socket.$emit;

			socket.$emit = function() {
				console.log('***','on',Array.prototype.slice.call(arguments));
				$emit.apply(socket, arguments);

				Dispatcher.trigger(arguments[0], arguments[1]);
			};
		}

		function emit( method, data, callbackfn ) {
			socket.emit(method, data, callbackfn);
		}

		function broadcast( method, data, callbackfn) {
			socket.broadcast.emit(method, data);
		}

		return {
			init: initialize,
			emit: emit,
			broadcast: broadcast
		};


	});