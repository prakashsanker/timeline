var app = app || {};

app.TimeChartView = Backbone.View.extend({
	
	tagName: 'div',
	className: 'timechart-container',
	lineChoice: {},
	datumChioce: {},

	initialize: function(){
		this.model.get('lineChoicesCollection').on("change", this.render, this);
		this.model.get('datumChoicesCollection').on("change", this.render, this);
		this.margin = {top: 20, right: 80, bottom: 30, left: 50};
    	this.width = 600 - this.margin.left - this.margin.right;
    	this.height = 500 - this.margin.top - this.margin.bottom;
		var data = this.model.get('data');

		d3.select(".timechart").select("svg").remove();
		this.svg = d3.select(".timechart").append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
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

			this.xScale = d3.time.scale().domain([minDate, maxDate]).range([0,this.width]);

			dataSortedByQuantitySold = data.sort(function(d1,d2){
				return d1["quantity-unsold"] - d2["quantity-unsold"];
			});

			minVal = dataSortedByQuantitySold[0];
			maxVal = dataSortedByQuantitySold[dataSortedByQuantitySold.length - 1];
			this.yScale = d3.scale.linear().domain([maxVal["quantity-unsold"], minVal["quantity-unsold"]]).range([0,this.height]);

			var xAxis = d3.svg.axis()
				.scale(this.xScale)
				.orient("bottom")
				.ticks(5); //need a way to find this

			this.svg.append("g")
				.attr("transform", "translate(0," + this.height + ")")
				.call(xAxis);

			var yAxis = d3.svg.axis().scale(this.yScale).orient("right").ticks(7);
			this.svg.append("g").call(yAxis); //need to find this
			return this;
	},

	renderAxes: function(){



	},

	render: function(){
		this.renderAxes();


    	var linesToShow = []
    	var lineChoicesCollection = this.model.get('lineChoicesCollection');
    	var datumChoicesCollection = this.model.get('datumChoicesCollection');
    	var filtersObjects = [];
    	lineChoicesCollection.each(function(model,key,list){
    		linesToShow.push(model.get('linesToShow'));
    		filtersObjects.push(model.get('filters'));
    	});

    	var dataToDisplay = []
    	var dataToShow = []
    	datumChoicesCollection.each(function(model,key,list){
    		dataToDisplay.push([model.getDisplayedData(), model.get('title')]);
    		dataToShow.push(model.get('dataToShow'));
    	});

    	var el = this.$el;
    	var svg = this.svg;
    	var xScale = this.xScale;
    	var yScale = this.yScale;
    	dataToShow = _.flatten(dataToShow);
    	linesToShow = _.flatten(linesToShow);

		d3.selectAll('.line').remove();
		d3.selectAll('.point').remove();    	

    	_(linesToShow).each(function(value,lineKey,lineList){
    		_(dataToShow).each(function(datumToShow, datumKey, datumList){
    			_(dataToDisplay).each(function(toDisplay, rowKey, rowList){
    				_(filtersObjects).each(function(filters, filterKey, filtersList){
	   					var filters = filters[value];
		    			var newTimeLine = new app.LineModel({lineTitle: value, title: toDisplay[1], value: datumToShow, data: toDisplay[0], show: true, filters: filters});
		    			var newTimeLineView = new app.LineView({model: newTimeLine, svg: svg, xScale: xScale, yScale: yScale});
		    			$(el).append(newTimeLineView.render().$el);
    				});
    				// console.log("VALUE");
    				// console.log(value);
    				// console.log("DATUM TO SHOW");
    				// console.log(datumToShow);
    				// console.log("row");
    				// console.log(row);

 
    			});

    		});
    	});


        // _.each(titlesToShow, function(value,key,list){

        //     var nData = data.length;
        //     var newData = [];

        //     for(i = 0; i < nData ; i++){
        //         row = data[i];
        //         if(row["flower"] === value){
        //             newData.push(row);
        //         }
        //     }


        
	  //       newData.sort(function(d1, d2){
			//   var d1 = d1.date.split('/'), d2 = d2.date.split('/');
			//   return new Date(d1[2], d1[0] - 1, d1[1]) - new Date(d2[2], d2[0] - 1, d2[1]);
			// });

			// var line = d3.svg.line()
			// .interpolate("linear")
			// .x(function(d) { 
			// 	var date = d["date"].match(/(\d+)/g);
			// 	date = new Date(date[2], date[0], date[1]);
			// 	return xScale(date)})
			// .y(function(d) { 
			// 	var quantitySold = yScale(d["quantity-sold"]);
			// 	return quantitySold});


			// var path = svg.append("path")
			// 	.attr("d", line(newData))
			// 	.style("stroke", function(d,i) { return color(i); })
			// 	.attr("fill","none");

			
			// var totalLength = path.node().getTotalLength();

			// var tooltip = d3.tip()
			// 	.attr("class", "tooltip")
			// 	.offset([0,5])
			// 	.html(function(d){
			// 		console.log(d);
			// 		return "<strong> 20 </strong>";
			// 	});

			// svg.call(tooltip);




		 	// path
		  //     .attr("stroke-dasharray", totalLength + " " + totalLength)
		  //     .attr("stroke-dashoffset", totalLength)
		  //     .transition()
		  //       .duration(2000)
		  //       .ease("linear")
		  //       .attr("stroke-dashoffset", 0);

		  //   svg.selectAll('.point')
		  //   	.data(newData)
		  //   	.enter()
		  //   	.append("svg:circle")
		  //   	.attr("cx", function(d,i){ 
		  //   		var date = d["date"].match(/(\d+)/g);
				// 	date = new Date(date[2], date[0], date[1]);
				// 	return xScale(date);
		  //   	})
		  //   	.attr("cy", function(d,i){
		  //   		var quantitySold = yScale(d["quantity-sold"]);
		  //   		return quantitySold;
		  //   	})
		  //   	.attr("fill", "red")
		  //   	.attr("r", 4)
		  //   	.on("mouseover", function(d){
		  //   		tooltip.show();
		  //   	})
		  //   	.on("mouseout", function(d){
		  //   		tooltip.hide();
		  //   	});




       

		return this;

	}





});