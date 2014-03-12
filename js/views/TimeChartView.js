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
     	$('body').find('.dashboard').css('height', this.height);

    	$('body').css('height', this.height);
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
				.attr("class", "axis")
				.call(xAxis);

			var yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(7);
			this.svg.append("g").attr("class","axis").call(yAxis); //need to find this
			return this;
	},

	addDataLine: function(){
		// never did this before looked at 
		// http://bl.ocks.org/marufbd/7191340
		// and customized(it was really hard to understand what was going on)
		// var that = this;
		// var lineModels = this.lineModels;
		// this.hoverLine = this.svg.append("svg:line")
		// 	.attr("class", "hover-line")
		// 	.attr("x1", 20)
		// 	.attr("x2",20)
		// 	.attr("y1",2)
		// 	.attr("y2", height + 20)
		// 	.attr("transform", "translate(0,-20)")
		// 	.attr("stroke-width",1)
		// 	.attr("stroke","grey")
		// 	.attr("opacity",1e-6);
		// this.svg.on('mouseover', function (){
		// 	var mouse = d3.mouse(this);
		// 	var mouseX = mouse[0] - that.margin.left;
		// 	var mouseY = mouse[1] - that.margin.top;
		// 	if (mouseX > 0 && mouseY > 0 && mouseX < that.width){
		// 		that.hoverLine.style("opacity",1);
		// 	else {
		// 		that.hoverLine.style("opacity",1e-6);
		// 	}
		// }});

		// this.svg.on("mouseout", function(){
		// 	that.hoverLine.style("opacity", 1e-6);
		// });

		// this.svg.on("mousemove", function(){
		// 	var mouse = d3.mouse(this);
		// 	var mouseX = mouse[0] - that.margin.left;
		// 	var mouseY = mouse[1] - that.margin.top;
		// 	that.hoverLine.attr("x1", mouseX).attr("x2",mouseX);
		// 	if(mouseX > 0 && mouseY > 0 && mouseX < that.width){
		// 		var dt = that.xScale.invert(mouseX);
		// 		_.each(lineModels, function(lineModel, lineModelKey, lineModels){
		// 			var filteredData = lineModel.get('filteredData');


		// 		});

		// 		/*
		// 		The WAY THIS FUNCTION SHOULD WORK-
		// 			Go through the data that is currently displayed, find the nearest date value
		// 			and present that. 

		// 			Problem here - how to access the data that is currently being shown? 
		// 			//the data being currently shown is the data that 
		// 		*/

		// 		var nearestDateVal = min


		// // 	}

		// // });



	},

	render: function(){
		// this.renderAxes();

		this.lineModels = [];
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
		d3.selectAll('.line-label').remove();
		var idCounter = 0;

    	_(linesToShow).each(function(value,lineKey,lineList){
    		_(dataToShow).each(function(datumToShow, datumKey, datumList){
    			_(dataToDisplay).each(function(toDisplay, rowKey, rowList){
    				_(filtersObjects).each(function(filters, filterKey, filtersList){
	   					var filters = filters[value];
		    			var newTimeLine = new app.LineModel({lineTitle: value, title: toDisplay[1], value: datumToShow, data: toDisplay[0], show: true, filters: filters, id: idCounter});
		    			var newTimeLineView = new app.LineView({model: newTimeLine, svg: svg, xScale: xScale, yScale: yScale});
		    			$(el).append(newTimeLineView.render().$el);
		    			idCounter++;
    				});
 
    			});

    		});
    	});       

    	this.addDataLine();

		return this;

	}





});