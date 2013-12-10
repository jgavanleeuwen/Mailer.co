var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Imap = require('imap');
var inspect = require('util').inspect;

var BoxesController = new Controller();
var output;

BoxesController.before('index', function( next ) {

  this.app.imap.getBoxes('/', function(error, boxes) {
    if(error) die(error);
    output = boxes;
    next();
  });

});

BoxesController.index = function() {
  var cache = [];
  this.output = JSON.stringify(output, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  }, 4);
  cache = null;
  this.render();
};

BoxesController.after('*', function(next) {
	output = null;
	next();
});

module.exports = BoxesController;
