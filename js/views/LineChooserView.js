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
		this.model.set('linesToShow', linesToShow);
	},

	initialize: function(){
		return this.$el;
	},

	render: function(){
		modelJson = this.model.toJSON();
		$(this.$el).html(this.template({
			lineTitles: modelJson.lineTitles
		}));

		var el = this.$el;

		var lineChoices = $(this.$el).find(".line-choice");
		_(lineChoices).each(function(choice, key, list){
			var lineTitle = $(choice).find(".line-title").val();
			var newFiltersCollection = new app.FiltersCollection({title: lineTitle});
			var newFiltersView = new app.FiltersView({collection: newFiltersCollection});
			$(el).append(newFiltersView.render().$el);
		});
		return this;
	}


});