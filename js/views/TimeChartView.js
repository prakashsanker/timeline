var app = app || {};

app.TimeChartView = Backbone.View.extend({
	
	tagName: 'div',
	className: 'timechart-container',

	initialize: function(){
		this.model.bind('change:data','render');
		var margin = {top: 20, right: 80, bottom: 30, left: 50};
    	var width = 600 - margin.left - margin.right;
    	var height = 500 - margin.top - margin.bottom;
    	console.log(this.model.get('data'));
    	var svg = d3.select(".timechart").append("svg")
    		.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			return this;
	},

	render: function(){

		return this;

	}





});