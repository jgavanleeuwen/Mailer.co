define([
	'underscore',
	'backbone',
	'models/label'
	], function( _, Backbone, LabelModel ) {

		var LabelsCollection = Backbone.Collection.extend({

			model: LabelModel,

			urlRoot: "http://localhost:3000/labels",

			url: function() {
				return this.urlRoot;
			}

		});

		return LabelsCollection;

});