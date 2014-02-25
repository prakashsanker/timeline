var app = app || {};

app.ChooserView = Backbone.View.extend({
	tagName: 'div',
	className: 'chooser-container',
	template: Handlebars.compile($('#table-chooser').html()),
	childViews: [],


	addFilterArea: function(e){
		console.log("ADD FILTER AREA");
		var filtersContainer = $(e.eventTarget).siblings(".filters-container");
		this.filters = new app.FiltersCollection();
		this.filtersView = new app.FiltersView({collection: this.filters});
		$(filtersContainer).append(this.filtersView.render().$el);
	},


	initialize: function(){
		this.model.on("add", this.render, this);
		$(this.$el).html(this.template());
		return this.$el;
	},

	render: function(){
		var lineChoicesCollection = this.model.get('lineChoicesCollection');
		var datumChoicesCollection = this.model.get('datumChoicesCollection');
		var listToAppendTo = $(this.$el).find('ul');
		var childViews = this.childViews;
		childViews = [];
		datumChoicesCollection.each(function(model, value, list){
			var valueChooserView = new app.ValuesTableView({model: model});
			$(listToAppendTo).append(valueChooserView.render().$el);
			childViews.push(valueChooserView);
		});

		lineChoicesCollection.each(function(model, value, list){
			var lineChoicesView = new app.LineChooserView({model: model});
			$(listToAppendTo).append(lineChoicesView.render().$el);
			childViews.push(lineChoicesView);
		});

		
		return this;
	}


});