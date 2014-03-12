var app = app || {};

app.ValuesTableView = Backbone.View.extend({
	tagName: 'div',
	className: 'value-chooser',
	template: Handlebars.compile($('#value-chooser').html()),

	events: {
		'click .data-type' : 'collapseDatum',
		'click .show-datum' : 'addDatumToShow',
		'click .add-filter' : 'addFilter'

	},

	addFilter: function(e){
		


	},

	collapseDatum: function(e){
		var collapsed = $(this.$el).find(".datum-list").data("collapsed-state");
		var datumListElem = $(this.$el).find(".datum-list");
		var arrow = $(this.$el).find(".arrow");
		if(collapsed == "collapsed"){
			datumListElem.slideDown();
			datumListElem.data("collapsed-state","uncollapsed");
			$(arrow).removeClass("dropdown-arrow");
			$(arrow).addClass("dropup-arrow");
		} else {
			datumListElem.slideUp();
			datumListElem.data("collapsed-state","collapsed");
			$(arrow).removeClass("dropup-arrow");
			$(arrow).addClass("dropdown-arrow");
		}	
	},

	addDatumToShow: function(e){
		var checkedValues = $(this.$el).find(".datum-list").find(":checked");

		var newDataToShow = [];
		_.each(checkedValues, function(value,key,list){
			var title = $(value).data("title");
			newDataToShow.push(title);
		});
		this.model.setDataToShow(newDataToShow);
	},


	
	initialize: function(){
		return this;
	},

	render: function(){
		modelJson = this.model.toJSON();
		console.log("MODEL JSON");
		console.log(modelJson);
		$(this.$el).html(this.template({
			title: modelJson.title,
			values: modelJson.values,
			id: this.model.get('cid')
		}));


		return this;

	}



});