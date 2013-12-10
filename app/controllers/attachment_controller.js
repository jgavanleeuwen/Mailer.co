var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var fs = require('fs');

var AttachmentController = new Controller();
var output;

AttachmentController.before('show', function(next) {

	fs.readFile(decodeURIComponent(this.req.url.split('/').pop()), function(err, data) {
		if (err) throw err;

		next();
	});

});

AttachmentController.show = function() {
  this.res.download(decodeURIComponent(this.req.url.split('/').pop()));
};

module.exports = AttachmentController;
