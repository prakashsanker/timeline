var app = app || {};

app.TableView = Backbone.View.extend({
	tagName: 'div',
	className: 'table-container',
	template: Handlebars.compile($('#data-table').html()),

	events: {
		'click .data-type' : 'collapseDatum',
		'click .show-datum' : 'addDatumToShow'
	},

	collapseDatum: function(e){
		var collapsed = $(this.$el).find(".datum-list").data("collapsed-state");
		var datumListElem = $(this.$el).find(".datum-list");
		if(collapsed == "collapsed"){
			datumListElem.slideDown();
			datumListElem.data("collapsed-state","uncollapsed");
		} else {
			datumListElem.slideUp();
			datumListElem.data("collapsed-state","collapsed");
		}	
	},

	addDatumToShow: function(e){
		var test = $(".datum-list").find(":checked");
		newDataToShow = [];
		_.each(test, function(value,key,list){
			console.log(value);
			var title = $(value).data("title");
			newDataToShow.push(title);
		});
		this.model.set('dataToShow', newDataToShow);
	},

	
	initialize: function(){
		return this;
	},

	render: function(){
		modelJson = this.model.toJSON();
		$(this.el).html(this.template({
			title: modelJson.title,
			values: modelJson.values
		}))
		return this;

	}



});