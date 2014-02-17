    var app = app || {};
    

    app.DataModel = Backbone.Model.extend({
    	defaults: {
            title: '',
            values: [],
    		data: {},
    		dataToShow: [],// can check 'tulip' and 'rose' for example to show all rows dealing with tulips
    		displayedData: []
        },
            

    	initialize: function(){
            return this;
        },

        getDisplayedData: function(){
            var data = this.get('data')
            var displayedData = this.get('displayedData')
            var title = this.get('title')
            var newData = [];
            var dataToShow = this.get('dataToShow');
            _.each(dataToShow, function(value,key,list){
                nData = data.length;
                for(i = 0; i < nData ; i++){
                    row = data[i];
                    if(row[title] == value){
                        newData.push(row);
                    }
                }
            });

            return newData;
        }

    });