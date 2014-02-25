var app = app || {};

app.ChooserModel = Backbone.Model.extend({
	defaults: {
		lineChoicesCollection: new app.LineChoicesCollection(),
		datumChoicesCollection: new app.DatumChoicesCollection(),
		data: []

	},

	initialize: function(){

		return this;
	}



})