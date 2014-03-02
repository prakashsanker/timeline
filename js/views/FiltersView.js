var app = app || {};

app.FiltersView = Backbone.View.extend({
	tagName: 'div',
	className: 'filters',
	template: Handlebars.compile($("#filter-form").html()),

	events: {
		"click .add-filter" : "addFilter"


	},

	addFilter: function(e){
		var newFilterModel = new app.FilterModel({filterText: "", applied: false, fieldToFilter: this.fieldToFilter});
		this.collection.add(newFilterModel);
	},
	
	initialize: function(options){
		this.collection.on("add", this.render, this);
		this.fieldToFilter = options.fieldToFilter;
	},

	render: function(){
		var el = this.$el;

		$(el).empty();

		$(el).append(this.template());

		console.log("COLLECTION LENGTH : ");
		console.log(this.collection.length);
		var collection = this.collection;
		this.collection.each(function(filter,key,list){
			console.log("FILTERS");
			console.log(filter);
			var newFilterView = new app.FilterView({model: filter, collection: collection});
			$(el).append(newFilterView.render().$el);
		});


		return this;

	}

});