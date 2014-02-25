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

	render: function(){
		if(this.model.get('show')){
		    var nData = this.model.get('data').length;
		    var newData = [];
		    var xScale = this.xScale;
		    var yScale = this.yScale;
		    var model = this.model;
		    var svg = this.svg;
		    var color = d3.scale.category10();
		    var data = this.model.get('data');

		    // console.log("SVG");
		    // console.log(this.svg);
		    // console.log("TITLE");
		    // console.log(this.model.get('title'));

		    // console.log("VALUE");
		    // console.log(this.model.get('value'));
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

			var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				var date = d["date"].match(/(\d+)/g);
				date = new Date(date[2], date[0], date[1]);
				return xScale(date)})
			.y(function(d,i) { 
				var yVal = yScale(d[model.get('lineTitle')]);
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