angular
    .module('app')
    .filter('byAction', function() {
        return function(items, action, favorites) {
            var filtered = [];

            if(action === undefined){
            	return items;
            }

            angular.forEach(items, function(item) {
                switch (action) {
                    case 'collection':
                        item.own ? filtered.push(item) : false;
                        break;
                    case 'favorites':
                    	item.favorite ? filtered.push(item) : false;
                    	break;
                    case 'missing':
                    	if (favorites) {
                    		(!item.own && item.favorite) ? filtered.push(item) : false;
                    	}else{
                    		!item.own ? filtered.push(item) : false;
                    	}
                    	break;
                    case 'repeated':
                        item.repeated ? filtered.push(item) : false;
                        break;
                }
            });
            return filtered;
        };
    })
    .filter('bySerie', function(){
        return function(items, serie){
            if(!items){
                return;
            }

            var filtered = [];

            if(serie === undefined){
                serie = 1;
            }

            angular.forEach(items, function(item){
                switch(serie){
                    case 1:
                        item.release_set == 1 ? filtered.push(item) : false;
                        break;
                    case 2:
                        item.release_set == 2 ? filtered.push(item) : false;
                        break;
                }
            });

            return filtered;
        }
    });
