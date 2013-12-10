var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var LabelsController = new Controller();
var output = [{
      title: 'Jobs',
      mnew: 0,
      color: '#55B5C0'
    }, {
      title: 'Sports', 
      mnew: 3,
      color: '#FF606F'
    }, {
      title: 'Friends',
      mnew: 2,
      color: '#89c7a0'
  }];

LabelsController.index = function() {
  this.output = JSON.stringify(output);
  this.render();
};


LabelsController.create = function() {
  output.push({ title: this.params('title')});
};


module.exports = LabelsController;
