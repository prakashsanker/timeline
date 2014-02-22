var app = app || {};

app.LineModel = Backbone.Model.extend({
	defaults : {
		title: '',
		data: [],
		linesToShow: []
	},

	initialize: function(){

		return this;
	},

	getData: function(){
		var linesToShow = this.get('linesToShow');
		var data = this.get('data');
		_.each(linesToShow, function(value,key,list){
                nData = data.length;
                for(i = 0; i < nData ; i++){
                    row = data[i];
         			
                }
            });


	}


});