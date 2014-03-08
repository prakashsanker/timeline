var app = app || {};

app.LineChooserView = Backbone.View.extend({
	tagName: 'div',
	className: 'line-chooser',
	template: Handlebars.compile($("#line-chooser").html()),

	events: {
		'click .show-line-choice': 'addLineToChart',
		'click .line-title-container' : 'collapseLine'
	},

	collapseLine: function(e) {
		var collapsedState = $(this.$el).find(".line-choice-list").data('collapsed-state');
		var arrow = $(this.$el).find(".arrow");
		if(collapsedState == "collapsed"){
			$(this.$el).find(".line-choice-list").slideDown();
			$(this.$el).find(".line-choice-list").data("collapsed-state", "uncollapsed");
			$(arrow).removeClass("dropdown-arrow");
			$(arrow).addClass("dropup-arrow");
		} else {
			$(this.$el).find(".line-choice-list").data("collapsed-state", "collapsed");
			$(this.$el).find(".line-choice-list").slideUp();
			$(arrow).removeClass("dropup-arrow");
			$(arrow).addClass("dropdown-arrow");
		}
	},

	addLineToChart: function(e) {
		var linesToAdd = $(this.$el).find('.show-line-choice:checked');
		var linesToShow = [];
		_.each(linesToAdd, function(value, key, list){
			linesToShow.push($(value).data('line-title'));
		});
		this.model.set('linesToShow', linesToShow);
		this.model.set('filters', this.filters);
	},

	initialize: function() {
		return this.$el;
	},

	render: function() {
		modelJson = this.model.toJSON();
		$(this.$el).html(this.template({
			lineTitles: modelJson.lineTitles,
			title: modelJson.title
		}));

		var el = this.$el;

		var lineChoices = $(this.$el).find(".line-choice");
		this.filters = {}
		var filters = this.filters;
		var that = this;
		_(lineChoices).each(function(choice, key, list){
			var lineTitle = $(choice).find(".line-title").text();
			lineTitle = $.trim(lineTitle);
			var newFiltersCollection = new app.FiltersCollection();
			filters[lineTitle] = newFiltersCollection;
			var newFiltersView = new app.FiltersView({collection: newFiltersCollection, fieldToFilter: lineTitle, model: that.model});
			$(el).find(choice).append(newFiltersView.render().$el);
		});
		return this;
	}


});