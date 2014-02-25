var app = app || {};

app.FiltersView = Backbone.View.extend({
	tagName: 'div',
	className: 'filters',
	template: Handlebars.compile($("#filter-form").html()),

	events: {
		"click .add-filter" : "addFilter"

	},

	addFilter: function(e){
		var filterText = $(this.$el).find(".filter-input").val();
		var newFilterModel = new app.FilterModel({filterText: filterText, applied: true});
		this.collection.add(newFilterModel);
	},
	
	initialize: function(options){
		this.collection.on("add", this.render, this);
	},

	render: function(){
		var el = this.$el;

		$(el).empty();

		$(el).append(this.template());


		this.collection.each(function(filter,key,list){
			console.log("FILTER");
			console.log(filter);
			var newFilterView = new app.FilterView({model: filter});
			$(el).append(newFilterView.render().$el);
		});


		console.log("FILTERS VIEW RENDER");
		return this;

	}

});