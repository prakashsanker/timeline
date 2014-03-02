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
		console.log("APPLIED FILTERS");
		console.log(appliedFilters);
		_(newData).each(function(datum, datumKey, datumList){
			temporaryFilteredData = [];
			_(appliedFilters).each(function(filter, filterKey, filterList){
				var equalLessThan = /<=([\d]*)/;
				var lessThan = /<([\d]*)/;
				var equalDigit = /=([\d]*)/;
				var greaterThanEqual = />=([\d]*)/;
				var greaterThan = />([\d]*)/;
				var match = null;	
				var lineTitle = model.get('lineTitle');
				console.log("LINE TITLE");
				console.log(lineTitle);
				var filterText = filter.get('filterText');
				console.log("FILTER TEXT");
				console.log(filterText);
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
			console.log("TEMP FILTERED");
			console.log(temporaryFilteredData);
			newData = temporaryFilteredData;		
		});

		console.log("NEW DATA");
		console.log(newData);
		return newData; 
	},

	render: function(){
		if(this.model.get('show')){
		    var newData = [];
		    var xScale = this.xScale;
		    var yScale = this.yScale;
		    var model = this.model;
		    var svg = this.svg;
		    var color = d3.scale.category10();
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
			var maxXScaleVal = 0;
			var maxYScaleVal = 0;

			var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				xScaleDateVal = xScale(date);

				if(xScaleDateVal > maxXScaleVal){
					maxXScaleVal = xScaleDateVal;
				}
				return xScaleDateVal;})
			.y(function(d,i) { 
				var yVal = yScale(d[model.get('lineTitle')]);
				if(yVal > maxYScaleVal){
					maxYScaleVal = yVal;
				}
				return yVal});


			this.path = svg.append("path")
				.attr("d", line(newData))
				.style("stroke", function(d,i) { return color(i); })
				.attr("fill","none")
				.attr("class","line");


			var totalLength = this.path.node().getTotalLength();

		 	this.path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
		        .duration(2000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);

		    this.svg.append("text")
		    	.attr("x", maxXScaleVal + 10)
		    	.attr("y", maxYScaleVal)
		    	.text(function(d){ return model.get('value') + "-" + model.get('lineTitle');});

		    svg.selectAll('.point')//this will break... 
		    	.data(newData)
		    	.enter()
		    	.append("svg:circle")
		    	.attr("cx", function(d,i){ 
		    		var date = d["date"].match(/(\d+)/g);
					date = new Date(date[2], date[0], date[1]);
					return xScale(date);
		    	})
		    	.attr("cy", function(d,i){
		    		var quantitySold = yScale(d[model.get('lineTitle')]);
		    		return quantitySold;
		    	})
		    	.attr("fill", "red")
		    	.attr("r", 4)
		    	.attr("class","point");



	    } else {


	    }

	    return this.$el;

	}




});