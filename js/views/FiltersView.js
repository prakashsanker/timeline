var app = app || {};

app.FiltersView = Backbone.View.extend({
	tagName: 'div',
	className: 'filters',
	template: Handlebars.compile($("#filter-form").html()),
	
	initialize: function(options){
		this.collection.on("add", this.render, this);
		this.render();
	},

	render: function(){
		var el = this.$el;
		this.collection.each(function(filter,key,list){
			var newFilterView = new app.FilterView({model: filter});
			$(el).append(newFilterView.render().$el);
		});


	}

});