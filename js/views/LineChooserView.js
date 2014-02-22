var app = app || {};

app.LineChooserView = Backbone.View.extend({
	tagName: 'div',
	className: 'line-chooser',
	template: Handlebars.compile($("#line-chooser").html()),

	initialize: function(){

		return this.$el;
	},

	render: function(){

		return this.$el;
	}


});