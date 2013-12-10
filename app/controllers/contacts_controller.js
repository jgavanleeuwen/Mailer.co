var Faker = require('Faker');

var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var ContactsController = new Controller();
var output;

ContactsController.before('index', function( next ) {
	
  output = [{
              name: 'Robin van Leeuwen', 
              mail: 'robinvanleeuwen1995@hotmail.com'
            }, {
              name: 'Jeroen van Leeuwen', 
              mail: 'jgavanleeuwen@outlook.com'
            }, {
              name: 'Jorrit Visser',
              mail: 'jkjvisser@gmail.com'
            }];

  for(var i =0; i < 5; i++ ) {
    output.push({
      name: Faker.Name.findName(),
      mail: Faker.Internet.email().toLowerCase(),
      type: 'single'
    });
  }

  output.push({
    name: 'Family',
    mail: ['m.stigters@weerder.nl', 'mvanleeuwen@outlook.com'],
    type: 'group'
  });

  output.push({
    name: 'Friends',
    mail: ['jkjvisser@gmail.com', 'milanvaneeden@gmail.com', 'rudi2010@hotmail.com'],
    type: 'group'
  });

  next();

});

ContactsController.index = function() {
  this.output = JSON.stringify(output);
  this.render();
};

ContactsController.after('index', function(next) {
	output = null;
	next();
});

module.exports = ContactsController;
