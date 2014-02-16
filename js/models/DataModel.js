    var app = app || app {};
    

    app.DataModel = Backbone.Model.extend({
    	defaults: {
            title: '',
            values: [],
    		data: {},
    		dataToShow: [],// can check 'tulip' for example to show all rows dealing with tulips
    		displayedData: [],
            

    	initialize: function(){
    		dataToShow = this.dataToShowFunc(this.data);//data to show func should give back the titles to show
        },

    	addDataToShow: function(dataName){
            dataToShow = _.uniq(dataToShow.push(dataName));
    	},

        getData: function(){
            //go through the dataToShow and for each title pull out the row?
            //do I need an accessor method to tell my model how to get the data out? 
            data = this.data;
            displayedData = this.displayedData;
            title = this.title;
            _.each(dataToShow, function(value,key,list){
                nData = this.data.length;
                for(i = 0; i < nData ; i++){
                    row = data[i];
                    if(row[title] == value){
                        newData.push(row);
                    }
                }
            });
            this.displayedData = newData;
            return this.displayedData;
        }

    });