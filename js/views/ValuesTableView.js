var app = app || {};

app.ValuesTableView = Backbone.View.extend({
	tagName: 'div',
	className: 'value-chooser',
	template: Handlebars.compile($('#value-chooser').html()),

	events: {
		'click .data-type' : 'collapseDatum',
		'click .show-datum' : 'addDatumToShow',
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
		var test = $(this.$el).find(".datum-list").find(":checked");
		console.log("test");
		console.log(test);
		newDataToShow = [];
		_.each(test, function(value,key,list){
			var title = $(value).data("title");
			newDataToShow.push(title);
		});
		console.log(this);
		console.log(this.model);
		this.model.setDataToShow(newDataToShow);
	},


	
	initialize: function(){
		return this;
	},

	render: function(){
		modelJson = this.model.toJSON();
		$(this.el).html(this.template({
			title: modelJson.title,
			values: modelJson.values
		}));


		return this;

	}



});