var app = app || {};




app.AppView = Backbone.View.extend({
	tagName: 'div',
	className: 'dashboard',

	initialize: function(){
		this.rightView = new app.TableView();
	},

	render: function(){
		this.$el.append(this.rightView.$el);
	}

});

$(function(){
	new app.appView();
});