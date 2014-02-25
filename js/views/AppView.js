var app = app || {};

app.AppView = Backbone.View.extend({
	tagName: 'div',
	className: 'dashboard',

	initialize: function(){
		var data = [
						{"flower": "tulip", "date": "2/3/2012", "quantity-sold": "20", "quantity-unsold": "10"},
						{"flower": "tulip", "date": "2/4/2012", "quantity-sold": "18", "quantity-unsold": "12"},
						{"flower": "tulip", "date": "2/5/2012", "quantity-sold": "23", "quantity-unsold": "7"},
						{"flower": "tulip", "date": "2/6/2012", "quantity-sold": "15", "quantity-unsold": "20"},
						{"flower": "tulip", "date": "2/7/2012", "quantity-sold": "12", "quantity-unsold": "23"},
						{"flower": "rose", "date": "2/3/2012", "quantity-sold": "50", "quantity-unsold": "40"},
						{"flower": "rose", "date": "2/4/2012", "quantity-sold": "43", "quantity-unsold": "47"},
						{"flower": "rose", "date": "2/5/2012", "quantity-sold": "55", "quantity-unsold": "35"},
						{"flower": "rose", "date": "2/6/2012", "quantity-sold": "70", "quantity-unsold": "20"},
						{"flower": "rose", "date": "2/7/2012", "quantity-sold": "30", "quantity-unsold": "70"},
						{"flower": "dandelion", "date": "2/3/2012", "quantity-sold": "10", "quantity-unsold": "0"},
						{"flower": "dandelion", "date": "2/4/2012", "quantity-sold": "9", "quantity-unsold": "11"},
						{"flower": "dandelion", "date": "2/5/2012", "quantity-sold": "3", "quantity-unsold": "17"},
						{"flower": "dandelion", "date": "2/6/2012", "quantity-sold": "4", "quantity-unsold": "16"},
						{"flower": "dandelion", "date": "2/7/2012", "quantity-sold": "7", "quantity-unsold": "8"}
					];
		var dataLen = data.length;




		var tableCollection = new app.TableCollection();
		//DataModel is REALLY a model for filtering data...or for exact matching of filtering data. It picks out rose, tulip and dandelion...
		//I think the dataToShow method that is passed in should be a filter method. 
		

		var datumChoicesCollection = new app.DatumChoicesCollection();
		var lineChoicesCollection = new app.LineChoicesCollection();

		var lineChoiceModel = new app.LineChoiceModel({title: "Line Charts", lineTitles: ["quantity-sold", "quantity-unsold"], linesToShow: []});
		var flowerModel = new app.FilterModel({title: "flower", values: ["tulip","rose","dandelion"], dataToShow:["tulip", "rose", "dandelion"], data: data});

		var chooserModel = new app.ChooserModel({lineChoicesCollection: [], datumChoicesCollection: []});

		var chooserView = new app.ChooserView({model: chooserModel});

		lineChoicesCollection.add(lineChoiceModel);
		datumChoicesCollection.add(flowerModel);

		var timelineData = new app.LineChoicesCollection();

		chooserModel.set('lineChoicesCollection', lineChoicesCollection);
		chooserModel.set('datumChoicesCollection', datumChoicesCollection);
		chooserModel.set('data',data);

		// var timelineModel = new app.TimeChartModel({data: flowerModel.getDisplayedData(), titlesToShow: flowerModel.get('dataToShow')});
		this.rightView = chooserView;

		var timechart = d3.select("body").append("div").attr("class","timechart");

		this.centerView = new app.TimeChartView({collection: timelineData, model: chooserModel});

		// this.centerView = new app.TimeChartView({model: flowerModel, el : timechart});
	},

	render: function(){
		this.$el.append(this.rightView.render().$el);
		// this.centerView.render();
		return this;
	}

});

$(function(){
	var appView = new app.AppView();
	$('body').append(appView.render().$el);
});