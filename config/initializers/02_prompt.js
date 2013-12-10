var prompt = require('prompt');

module.exports = function( done ) {
  var properties = [{
    name: 'username', 
    validator: /^[a-zA-Z\s\-]+$/,
    warning: 'Username must be only letters, spaces, or dashes'
  }, {
    name: 'password',
    hidden: true
  }];

  prompt.start();

  var self = this;

  prompt.get(properties, function (error, result) {
    if (error) die (error);

    self.prmt = {};
    self.prmt.username = result.username;
    self.prmt.password = result.password;

    done();
  });
}
