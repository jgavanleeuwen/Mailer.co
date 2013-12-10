global.io = require('socket.io').listen(8080);

module.exports = function(done) {
	var self = this;

	global.io.sockets.on('connection', function(socket) {
		self.socket = socket;
		self.socket.emit('welcome');
	});

	done();
}