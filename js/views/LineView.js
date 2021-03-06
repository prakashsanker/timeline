var app = app || {};

app.LineView = Backbone.View.extend({
	tagName: 'div',
	className: 'line',
	el: {},//need to set el because this view deals with svg elements(name space issues with dialects of xml),
	xScale: {},
	yScale: {},
	svg: {},
	path: {},

	initialize: function(options){
		this.svg = options.svg;
		this.xScale = options.xScale;
		this.yScale = options.yScale;
		this.filters = this.model.get('filters');
		this.model.on('change:show', this.render, this);
		return this;
	},

	applyFilters: function(filters, data){
		//figure which this filter is. 
		var model = this.model;
		var newData = data;
		var filteredData = [];
		var appliedFilters = filters.filter(function(model){
			if(model.get('applied')){
				return model;
			}
		});
		// console.log("APPLIED FILTERS");
		// console.log(appliedFilters);
		_(appliedFilters).each(function(filter, filterKey, filterList){
			temporaryFilteredData = [];
			_(newData).each(function(datum, datumKey, datumList){
				var equalLessThan = /<=([\d]*)/;
				var lessThan = /<([\d]*)/;
				var equalDigit = /=([\d]*)/;
				var greaterThanEqual = />=([\d]*)/;
				var greaterThan = />([\d]*)/;
				var match = null;	
				var lineTitle = model.get('lineTitle');
				var filterText = filter.get('filterText');
				// console.log("FILTER TEXT");
				// console.log(filterText);
				if(filterText.match(equalLessThan)){
					condition = equalLessThan.exec(filterText)[1];
					if(parseInt(datum[lineTitle]) <= parseInt(condition)){
						temporaryFilteredData.push(datum);
					}
				}

				if(filterText.match(lessThan)){
					condition = lessThan.exec(filterText)[1];

					if(parseInt(datum[lineTitle]) < parseInt(condition)){
						temporaryFilteredData.push(datum);
					}
				}

				if(filterText.match(equalDigit)){
					condition = equalDigit.exec(filterText)[1];
					if(parseInt(datum[lineTitle]) == parseInt(condition)){
						temporaryFilteredData.push(datum);
					}
				}
				if(filterText.match(greaterThanEqual)){
					condition = greaterThanEqual.exec(filterText)[1];
					if(parseInt(datum[lineTitle]) >= parseInt(condition)){
						temporaryFilteredData.push(datum);
					}
				}

				if(filterText.match(greaterThan)){
					condition = greaterThan.exec(filterText)[1];
					if(parseInt(datum[lineTitle]) > parseInt(condition)){
						temporaryFilteredData.push(datum);
					}
				}
			});
			newData = temporaryFilteredData;
		});

		return newData; 
	},

	addDataPoints: function(minXScaleVal){
		var xScale = this.xScale;
		var yScale = this.yScale;
		var model = this.model;
		var svg = this.svg;
		var filteredData = this.filteredData;

		var internalPoints = this.svg.selectAll("internalPoints" + this.model.get("id"))
			.data(this.filteredData)
			.enter()
			.append("circle")
			.attr("cx", function(d){
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				return xScale(date);
			})
			.attr("cy", function(d){
				var yVal = yScale(d[model.get('lineTitle')]);

				return yVal;
			})
			.attr("r", 15)
			.attr("fill","#fb8072")
			.attr("stroke", "#d26b5f")
			.on("mouseover", function(d){
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);

				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				var yVal = yScale(d[model.get('lineTitle')])

				var indicatorCircle = svg.append("circle")
					.attr('cx', function(x){
						var date = d["date"].match(/(\d+)/g);
						date = new Date(date[2], date[0], date[1]);
						return xScale(date);
					})
					.attr("cy", function(x){
						var yVal = yScale(d[model.get('lineTitle')]);
						return yVal;
					})
					.attr("r", 0)
					.attr("fill", "none")
					.style("stroke", "#d26b5f")
					.attr("class", "indicatorCircle");



				svg.append("text")
					.text(function(x){
						return d[model.get('title')];
					})
					.attr("x", d3.event.pageX - 20)
					.attr("y", d3.event.pageY - 20)
					.attr("class", "tooltip");


				svg.append("text")					
					.text(function(x){
						return d['date'];
					})
					.attr("x", d3.event.pageX - 20)
					.attr("y", d3.event.pageY)
					.attr("class", "tooltip")

				indicatorCircle
					.transition()
					.duration(2000)
					.attr('r', 20)
					.style('stroke',"#d26b5f" );



				var yIndicatorLine = d3.svg.line()
					.interpolate("linear")
					.x(function(d,i){
						return xScale(date);
					})
					.y(function(d,i){
						if(i == 0){
							return yVal;
						} else {
							return yScale(0);
						}
					});

				var yIndicatorPath = svg.append("path")
					.attr("d", yIndicatorLine([0,1]))
					.attr("fill","none")
					.attr("class","yIndicatorLine")
					.style("stroke", "blue");

				var yIndicatorLength = yIndicatorPath.node().getTotalLength();

				yIndicatorPath
			      .attr("stroke-dasharray", yIndicatorLength+ " " + yIndicatorLength)
			      .attr("stroke-dashoffset", yIndicatorLength)
			      .transition()
			        .duration(2000)
			        .ease("linear")
			        .attr("stroke-dashoffset", 0)
			        .delay(2000);

				var xIndicatorLine = d3.svg.line()
					.interpolate("linear")
					.x(function(d,i){
						if ( i == 0){
							return xScale(date);
						} else {
							return minXScaleVal;
						}
					})
					.y(function(d,i){
						return yVal;
					});

				var xIndicatorPath = svg.append("path")
					.attr("d", xIndicatorLine([0,1]))
					.attr("fill","none")
					.attr("class","xIndicatorLine")
					.style("stroke", "blue");

				var xIndicatorLength = xIndicatorPath.node().getTotalLength();


				xIndicatorPath
			      .attr("stroke-dasharray", xIndicatorLength + " " + xIndicatorLength)
			      .attr("stroke-dashoffset", xIndicatorLength)
			      .transition()
			        .duration(2000)
			        .ease("linear")
			        .attr("stroke-dashoffset", 0)
			        .delay(2000);

	


			}).
			on("mouseout", function(d){
				svg.selectAll(".yIndicatorLine")
				.remove();
				svg.selectAll(".xIndicatorLine")
				.remove();
				svg.selectAll(".indicatorCircle")
				.remove();
				svg.selectAll(".tooltip")
				.remove();


			})
			.attr("class", "point");

		var internalPoints = this.svg.selectAll("internalPoints" + this.model.get("id"))
			.data(this.filteredData)
			.enter()
			.append("circle")
			.attr("cx", function(d){
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				return xScale(date);
			})
			.attr("cy", function(d){
				var yVal = yScale(d[model.get('lineTitle')]);

				return yVal;
			})
			.attr("r", 3)
			.attr("fill","white")
			.attr("stroke", "red")
			.attr("class", "point");



	},

	render: function(){
		console.log("RENDER LINE");
		if(this.model.get('show')){
		    var newData = [];
		    var xScale = this.xScale;
		    var yScale = this.yScale;
		    var model = this.model;
		    var svg = this.svg;
		    var color = d3.scale.category10();
		    color.domain([0,1,2,3,4,5,6,7,8,9])
		    var data = this.model.get('data');
		    var filters = this.model.get('filters');
		    data = this.applyFilters(filters, data);

		    var nData = data.length;
		   	data.sort(function(d1, d2){
			  var d1 = d1.date.split('/'), d2 = d2.date.split('/');
			  return new Date(d1[2], d1[0] - 1, d1[1]) - new Date(d2[2], d2[0] - 1, d2[1]);
			});

		    for(i = 0; i < nData ; i++){
		        row = data[i];
		        if(row[this.model.get('title')] === this.model.get('value')){
		            newData.push(row);
		        }
		    }

		    this.filteredData = newData;
			var maxXScaleVal = 0;
			var maxYScaleVal = 0;
			var minXScaleVal = Number.MAX_VALUE;

			var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				xScaleDateVal = xScale(date);
				maxXScaleVal = xScaleDateVal;
				if(xScaleDateVal < minXScaleVal){
					minXScaleVal = xScaleDateVal;
				}
				return xScaleDateVal;})
			.y(function(d,i) { 
				var yVal = yScale(d[model.get('lineTitle')]);
				maxYScaleVal = yVal;
				return yVal});


			this.path = svg.append("path")
				.attr("d", line(newData))
				.style("stroke", function(d,i) { 
					var colorIndex = Math.floor(Math.random() * (10 - 0) + 0);
					return color(colorIndex); })
				.attr("fill","none")
				.attr("class","line" + this.model.get("id"))
				.attr("class", "line");




			var totalLength = this.path.node().getTotalLength();

		 	this.path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
		        .duration(2000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);



		    //data points and tool tips

		    this.addDataPoints(minXScaleVal);
		    this.svg.append("text")
		    	.attr("x", maxXScaleVal - 50)
		    	.attr("y", maxYScaleVal  - 30)
		    	.text(function(d){ return model.get('value') + "-" + model.get('lineTitle');})
		    	.attr("class","line-label");


	    } else {


	    }

	    return this.$el;

	}




});