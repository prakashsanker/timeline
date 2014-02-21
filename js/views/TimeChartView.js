var app = app || {};

app.TimeChartView = Backbone.View.extend({
	
	tagName: 'div',
	className: 'timechart-container',

	initialize: function(){
		console.log("INIT");
		this.model.bind('change:data','render');
		var margin = {top: 20, right: 80, bottom: 30, left: 50};
    	var width = 600 - margin.left - margin.right;
    	var height = 500 - margin.top - margin.bottom;
    	var color = d3.scale.category10();
    	var svg = d3.select(".timechart").append("svg")
    		.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//need to get the bottom axis?
		//so get the dates?
		//need a date accessor method
		var data = this.model.get('data');

		data.sort(function(d1, d2){
		  var d1 = d1.date.split('/'), d2 = d2.date.split('/');
		  return new Date(d1[2], d1[0] - 1, d1[1]) - new Date(d2[2], d2[0] - 1, d2[1]);
		});

		var minVal = data[0];
		var minDate = data[0]["date"].match(/(\d+)/g);

		minDate = new Date(minDate[2],minDate[0], minDate[1]);
		var maxDate = data[[data.length - 1]]["date"].match(/(\d+)/g);

		maxDate = new Date(maxDate[2],maxDate[0], maxDate[1]);
		var maxVal = data[data.length - 1];

		var xScale = d3.time.scale().domain([minDate, maxDate]).range([0,width]);

		dataSortedByQuantitySold = data.sort(function(d1,d2){
			return d1["quantity-sold"] - d2["quantity-sold"];
		});

		minVal = dataSortedByQuantitySold[0];
		maxVal = dataSortedByQuantitySold[dataSortedByQuantitySold.length - 1];
		var yScale = d3.scale.linear().domain([maxVal["quantity-sold"], minVal["quantity-sold"]]).range([0,height]);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(5); //need a way to find this


		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		var yAxis = d3.svg.axis().scale(yScale).orient("right");
		svg.append("g").call(yAxis);
		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { 
				console.log(d);
				var date = d["date"].match(/(\d+)/g);

				date = new Date(date[2], date[0], date[1]);
				return xScale(date)})
			.y(function(d) { 
				var quantitySold = yScale(d["quantity-sold"]);
				return quantitySold});
		console.log(data);
		data.sort(function(d1, d2){
		  var d1 = d1.date.split('/'), d2 = d2.date.split('/');
		  return new Date(d1[2], d1[0] - 1, d1[1]) - new Date(d2[2], d2[0] - 1, d2[1]);
		});



		var path = svg.append("path")
			.attr("d", line(data))
			.style("stroke", function(d,i) { return color(i); })
			.attr("fill","none");

					var totalLength = path.node().getTotalLength();


	 	path
	      .attr("stroke-dasharray", totalLength + " " + totalLength)
	      .attr("stroke-dashoffset", totalLength)
	      .transition()
	        .duration(2000)
	        .ease("linear")
	        .attr("stroke-dashoffset", 0);


		return this;


	},

	render: function(){

		return this;

	}





});