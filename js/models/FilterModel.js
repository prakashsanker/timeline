var app = app || {};

app.FilterModel = Backbone.Model.extend({
	defaults: {
		filterText: '',
		filterFunction: {},
		fieldToFilter: {}

	},

	applyFilter: function(data){
		if(filterFunction){
			return filterFunction(data);
		} else {


		}

	}


});