var app = app || {};

app.FiltersCollection = Backbone.Collection.extend({
	model: app.FilterModel,
	title: ''
});