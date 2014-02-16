var app = app || {};

app.TableView = Backbone.View.extend({
	tagName: 'div'
	className: 'table-container'
	template: Handlebars.compile($('#table').html())


	
	initialize: function(){
		this.collection.bind('change', 'render')


	}

	render: function(){
		_.each(this.collection, function(model){



		});



	}



});