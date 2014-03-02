var app = app || {};

app.FilterView = Backbone.View.extend({
	tagName: 'div',
	className: 'filter',
	template: Handlebars.compile($("#add-filter").html()),

	events: {
		"click .remove-filter" : "removeFilter",
		"click .select-filter" : "toggleFilter"
	},

	toggleFilter: function(e){
		var checkbox = e.currentTarget;
		var filterText = $(this.$el).find(".filter-input").val();
		this.model.set('filterText', filterText);

		if($(checkbox).is(":checked")){
			this.model.set('applied', true);
		} else {

			this.model.set('applied', false);
		}
	},

	removeFilter:function(e){
		this.collection.remove(this.model);
		this.remove();
	},

	initialize: function(options){
		this.model.on("change:applied", this.render, this);
		this.render();
	}, 

	render: function(){
		$(this.$el).empty();
		var modelJson = this.model.toJSON();
		$(this.$el).append(this.template({
			applied: modelJson.applied,
			filterText: modelJson.filterText
		}));

		return this;

	}
	


});