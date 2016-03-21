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

            serie = serie || 1;

            var filtered = [];

            switch(serie){
                case 1:
                    filtered = items.slice(0,100);
                    break;
                case 2:
                    filtered = items.slice(100,200);
                    break;
                case 3:
                    filtered = items.slice(200,300);
                    break;
            }

            return filtered;
        }
    });
