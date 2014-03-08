var app = app || {};

app.FiltersView = Backbone.View.extend({
	tagName: 'div',
	className: 'filters-container',
	template: Handlebars.compile($("#filter-form").html()),
	filtersTemplate: Handlebars.compile($("#filters-area").html()),

	events: {
		"click .add-filter" : "addFilter"


	},

	addFilter: function(e){
		var newFilterModel = new app.FilterModel({filterText: "", applied: false, fieldToFilter: this.fieldToFilter});
		this.collection.add(newFilterModel);
	},
	
	initialize: function(options){
		this.collection.on("add", this.render, this);
		this.collection.on("change:applied", this.filterChanged, this);
		this.collection.on("remove", this.filterChanged,this);
		this.fieldToFilter = options.fieldToFilter;
	},

	filterChanged: function(){
		//this might be a hack
		this.model.trigger("change");
	},



	render: function(){
		var el = this.$el;

		$(el).empty();
		$(el).append(this.template());
		var collection = this.collection;
		var filtersTemplate = this.filtersTemplate;
		this.collection.each(function(filter,key,list){
			if(key == 0){
				$(el).append(filtersTemplate());
			}
			var newFilterView = new app.FilterView({model: filter, collection: collection, id: key});
			$(el).find(".filters").append(newFilterView.render().$el);
		});


		return this;

	}

});