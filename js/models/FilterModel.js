var app = app || {};

app.FilterModel = Backbone.Model.extend({
	defaults: {
		filterText: '',
		filterFunction: {},
		fieldToFilter: {},
		applied: false

	},

	applyFilter: function(data){
		if(filterFunction){
			return filterFunction(data);
		} else {


		}

	}


});