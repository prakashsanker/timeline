var app = app || {};

app.TimeChartModel = Backbone.Model.extend({
	defaults:{
		data: [],
		titlesToShow: [],
		tableModel: {}
	},

	initialize: function(){
		

		return this;
	}



});