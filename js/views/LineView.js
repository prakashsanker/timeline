var app = app || {};

app.LineView = Backbone.View.extend({
	tagName: 'div',
	className: 'line',
	el: {},//need to set el because this view deals with svg elements(name space issues with dialects of xml),
	xScale: {},
	yScale: {},
	svg: {},
	path: {}

	initialize: function(){
		this.model.on('change:show', this.render, this);
		return this;
	},

	render: function(){
		if(this.model.get('show')){
		    var nData = this.model.get('data').length;
		    var newData = [];
		    var xScale = this.xScale;
		    var yScale = this.yScale;
		    var model = this.model;
		    var svg = this.svg;

		    for(i = 0; i < nData ; i++){
		        row = data[i];
		        if(row[this.model.get('value')] === value){
		            newData.push(row);
		        }
		    }

			var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				return xScale(date)})
			.y(function(d) { 
				var yVal = yScale(d[model.get('title')]);
				return yVal});

			this.path = svg.append("path")
				.attr("d", line(newData))
				.style("stroke", function(d,i) { return color(i); })
				.attr("fill","none");

			var totalLength = this.path.node().getTotalLength();

		 	this.path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
		        .duration(2000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);

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
		    		var quantitySold = yScale(d[model.get('title')]);
		    		return quantitySold;
		    	})
		    	.attr("fill", "red")
		    	.attr("r", 4)

	    } else {


	    }



	}




});