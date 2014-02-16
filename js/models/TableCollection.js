var app = app || {};

app.TableCollection = Backbone.Collection.extend({
	defaults: {
		model: app.DataModel
	}

});

