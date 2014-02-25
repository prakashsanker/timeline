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
		var checkbox = e.eventTarget;
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
		this.model.on("change", this.render, this);
		this.render();
	}, 

	render: function(){
		var modelJson = this.model.toJSON();
		console.log("MODEL JSON");
		console.log(modelJson);
		$(this.$el).append(this.template({
			applied: modelJson.applied,
			filterText: modelJson.filterText
		}));

		return this;

	}
	


});