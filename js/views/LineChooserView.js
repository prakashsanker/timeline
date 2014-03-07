var app = app || {};

app.LineChooserView = Backbone.View.extend({
	tagName: 'div',
	className: 'line-chooser',
	template: Handlebars.compile($("#line-chooser").html()),

	events: {
		'click .show-line-choice': 'addLineToChart'
	},

	addLineToChart: function(e){
		var linesToAdd = $(this.$el).find('.show-line-choice:checked');
		var linesToShow = [];
		_.each(linesToAdd, function(value, key, list){
			linesToShow.push($(value).data('line-title'));
		});
		this.model.set('linesToShow', linesToShow, {silent: true});
		this.model.set('filters', this.filters);
	},

	initialize: function(){
		return this.$el;
	},

	render: function(){
		modelJson = this.model.toJSON();
		$(this.$el).html(this.template({
			lineTitles: modelJson.lineTitles,
			title: modelJson.title
		}));

		var el = this.$el;

		var lineChoices = $(this.$el).find(".line-choice");
		this.filters = {}
		var filters = this.filters;
		_(lineChoices).each(function(choice, key, list){
			var lineTitle = $(choice).find(".line-title").text();
			lineTitle = $.trim(lineTitle);
			var newFiltersCollection = new app.FiltersCollection();
			filters[lineTitle] = newFiltersCollection;
			var newFiltersView = new app.FiltersView({collection: newFiltersCollection, fieldToFilter: lineTitle});
			$(el).find(choice).append(newFiltersView.render().$el);
		});
		return this;
	}


});