var app = app || {};

app.LineModel = Backbone.Model.extend({
	defaults : {
		title: '',
		value: '',
		data: [],
		show: false,
		lineTitle: '',
		filters: []

	},

	initialize: function(){
		return this;
	},

	updateData:function(){
		var linesToShow = this.get('linesToShow');
		var data = this.get('data');
	}
});