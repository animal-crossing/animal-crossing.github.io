(function(){
"use strict";
hello.init({
    google: '938000328729-l8ora04d42634g8ln8d77mvgtt1g011d.apps.googleusercontent.com'
});

angular
    .module('app', ['ui.bootstrap', 'ngAnimate', 'ngRoute', 'ngResource', 'angular-loading-bar', 'LocalStorageModule'])
    .config(['$routeProvider', 'localStorageServiceProvider', function($routeProvider, localStorageServiceProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'public/app/views/index.html',
            controller: 'mainController',
            resolve: {
                session: ['storageService', function(storageService) {
                    return storageService.getStorageService(true);
                }]
            }
        }).
        when('/auth', {
            template: ' ',
            controller: 'authController',
            resolve: {
                userModel: ['authService', function(authService) {
                    return authService.auth();
                }],
                session: ['storageService', function(storageService) {
                    return storageService.getStorageService(true);
                }]
            }
        }).
        when('/visit', {
            templateUrl: 'public/app/views/visit_village.html',
            controller: 'villageController',
            resolve: {
                users: ['userService', function(userService) {
                    return userService.Users.query().$promise.then(function(data) {
                        return data;
                    });
                }]
            }
        }).
        when('/about', {
            templateUrl: 'public/app/views/about.html',
            controller: 'aboutController'
        }).
        when('/:user/:action?', {
            templateUrl: 'public/app/views/collection.html',
            controller: 'collectionController',
            resolve: {
                isLoggedIn: ['authService', function(authService) {
                    return authService.isLoggedIn();
                }],
                session: ['storageService', function(storageService) {
                    return storageService.getStorageService(true);
                }]
            }
        }).
        otherwise({
            redirectTo: '/'
        });

        localStorageServiceProvider
            .setPrefix('ac')
            .setStorageCookieDomain('http://animal-crossing.github.io');;
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('aboutController', ['$scope', function($scope) {
        
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('authController', ['$scope', '$location', '$log', 'userModel', 'userService', 'session', 'storageService', function($scope, $location, $log, userModel, userService, session, storageService) {
        if(session){
            storageService.populateStorageData(session);
        }

        userModel = userService.userModel;

        if(userModel.id) {
            if (userModel.collection) {
                getUserCollection(userModel);
            }else{
                userService.Users.query(function(data) {
                    var users = TAFFY(data);

                    var user = users({id: userModel.id}).first();

                    // User has Collection?
                    if (user) {
                        getUserCollection(user);
                    } else {
                        // create a Default User Collection
                        userService.postUserCollection.save(userModel.cards, function(data) {
                            userModel.collection = data.uri.substr(data.uri.lastIndexOf('/') + 1);

                            // User has same name than another?
                            while (users({username: userModel.username}).first()) {
                                userModel.username = userModel.username + Math.floor(Math.random() * 900) + 100;
                            }

                            users.insert({
                                "id": userModel.id,
                                "name": userModel.name,
                                "username": userModel.username,
                                "avatar": userModel.avatar, 
                                "collection": userModel.collection
                            });

                            userService.Users.update({}, users().stringify());

                            createSession();

                            redirectToUserPage(userModel.username);
                        });
                    }
                });
            }
        }else{
            redirectToUserPage('')
        }

        function createSession(){
            if(session){
                storageService.createSession(session);
            }
        }

        function getUserCollection(user){
            userService.userCollection.query({
                userCollection: user.collection
            }, function(data) {
                userService.userModel.id = user.id;
                userService.userModel.name = user.name;
                userService.userModel.username = user.username;
                userService.userModel.avatar = user.avatar;
                userService.userModel.collection = user.collection;

                createSession();

                userService.userModel.cards = data;

                redirectToUserPage(userService.userModel.username);
            });
        }

        function redirectToUserPage(username){
            userService.destroyNeighbor();
            userService.userModel.preview = false;

        	$location.path("/" + username);
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .factory('authService', ['$location', '$q', 'userService', 'storageService', function($location, $q, userService, storageService) {
        return {
            auth: function() {
                var defer = $q.defer();

                var userModel = userService.userModel;

                var session = storageService.getStorageService();

                if (!userModel.id || (session && !session.get('id'))) {
                    hello('google').login().then(function(auth) {
                        userModel.access_token = auth.authResponse.access_token;
                        userModel.client_id = auth.authResponse.client_id;
                        userModel.network = auth.network;

                        session.set('access_token', auth.authResponse.access_token);
                        session.set('client_id', auth.authResponse.client_id);
                        session.set('network', auth.network);

                        hello(auth.network).api('/me').then(function(r){
                            if (r.name) {
                                defer.resolve('');
                            }

                            userModel.id = r.id;
                            userModel.name = r.name;

                            var username = r.name.replace(/\s+/g, '');

                            if (username.length > 15) {
                                username = r.first_name.split(" ")[0].slice(0, 15);
                            }

                            userModel.username = username;
                            userModel.avatar = r.image.url.slice(0, -2) + "150";

                            session.set('id', userModel.id);
                            session.set('name', userModel.name);
                            session.set('username', userModel.username);
                            session.set('avatar', userModel.avatar);

                            defer.resolve(true);
                        });
                    }, function(e) {
                        defer.resolve(false);
                    });                 
                } else {
                    hello('google').logout().then(function() {
                        userService.init();

                        session.clearAll();

                        defer.resolve('');
                    });
                }

                return defer.promise;
            },
            isLoggedIn: function() {
                var defer = $q.defer();

                var session = storageService.getStorageService();

                if (session && !userService.userModel.id) {
                    storageService.populateStorageData(session);
                }

                if (!userService.userModel.id) {
                    defer.resolve(false);
                } else {
                    defer.resolve(true);
                }

                return defer.promise;
            }
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('mainController', ['$scope', 'userService', 'session', 'storageService', '$location', function($scope, userService, session, storageService, $location) {
        $scope.series = 1;

        if (session && session.get('id')) {
            storageService.populateStorageData(session);
            $location.path('/' + session.get('username'));
        } else {
            var userModel = userService.userModel;

            if (!userModel.cards) {
                userService.getDefaultCollection.get(function(data) {
                    userModel.cards = data.cards;
                    $scope.cards = data.cards;
                });
            }else{
                $scope.cards = userModel.cards;
            }
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('menuController', ['$scope', 'userService', function($scope, userService) {

    	$scope.isCollapsed = true;

        $scope.$watch(function() {
            return userService.userModel;
        }, function(newValue, oldValue) {
            $scope.userModel = newValue;
        }, true);

        $scope.$watch(function() {
            return userService.neighbor;
        }, function(newValue, oldValue) {
            $scope.neighbor = newValue;
        }, true);

        $scope.collapse = function(){
            $scope.isCollapsed = true;
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .factory('storageService', ['localStorageService', 'userService', '$q', function(localStorageService, userService, $q) {
        return {
            getStorageService: function(async) {
                var async = async || false;

                var defer = $q.defer();

                if (localStorageService.isSupported) {
                    if (async){
                        defer.resolve(localStorageService);
                    }else{
                        return localStorageService;
                    }
                } else if(localStorageService.cookie.isSupported){
                    if (async) {
                        defer.resolve(localStorageService.cookie);
                    }else{
                        return localStorageService.cookie;
                    }
                }else{
                    if(async){
                        defer.resolve(false)
                    }else{
                        return false;
                    }
                }

                return defer.promise;
            },
            populateStorageData: function(session){
                userService.userModel.id = session.get('id');
                userService.userModel.name = session.get('name');
                userService.userModel.username = session.get('username');
                userService.userModel.avatar = session.get('avatar');
                userService.userModel.collection = session.get('collection');
                userService.userModel.access_token = session.get('access_token');
                userService.userModel.network = session.get('network');
                userService.userModel.client_id = session.get('client_id');
            },
            createSession: function(session){
                session.set('id', userService.userModel.id);
                session.set('name', userService.userModel.name);
                session.set('username', userService.userModel.username);
                session.set('avatar', userService.userModel.avatar);
                session.set('collection', userService.userModel.collection);
                session.set('access_token', userService.userModel.access_token);
                session.set('network', userService.userModel.network);
                session.set('client_id', userService.userModel.client_id);
            }
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .factory('userService', ['$resource', function($resource) {

        var baseUrl = "https://api.myjson.com/bins";

        var userService = {};

        userService.init = function() {
            userService.userModel = {
                id: '',
                name: '',
                username: '',
                avatar: '',
                cards: false,
                collection: '',
                access_token: '',
                network: '',
                client_id: '',
                preview: false,
                changed: false,
                serie: 1
            }
        }

        userService.destroyNeighbor = function () {
            userService.neighbor = {
                avatar: '',
                username: '',
                cards: false,
                collection: ''
            }
        }


        userService.init();
        userService.destroyNeighbor();

        userService.Users = $resource(baseUrl + '/1wizj', {}, {
            'update': {
                method: 'PUT',
                isArray: true
            }
        });

        userService.getDefaultCollection = $resource(baseUrl + '/5325p');

        userService.userCollection = $resource(baseUrl + '/:userCollection', {
            userCollection: '@collection'
        }, {
            'update': {
                method: 'PUT',
                isArray: true
            }
        });

        userService.getSeries2 = $resource(baseUrl + '/1u829');

        userService.postUserCollection = $resource(baseUrl);

        return userService;
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('villageController', ['$scope', 'users', '$location', function($scope, users, $location) {
        $scope.villager = {
            username : ''
        };

        $scope.limit = 25;

        $scope.showMore = function(){
            $scope.limit +=25;
        }

        $scope.users = users;

        $scope.goToVillage = function(username) {
            $location.path('/' + username + '/collection');
        }
    }]);

})();
(function(){
"use strict";
angular
    .module('app')
    .controller('collectionController', ['$scope', 'userService', 'isLoggedIn', '$location', '$routeParams', function($scope, userService, isLoggedIn, $location, $routeParams) {

        angular.element(document).ready(function() {
            new ShareButton({
                url: 'animal-crossing.github.io/#/' + $routeParams.user + '/' + $routeParams.action,
                description: 'Check ' + $routeParams.user + ' ' + $routeParams.action + ' Animal Crossing cards',
                networks: {
                    pinterest: {
                        enabled: false
                    },
                    linkedin: {
                        enabled: false
                    },
                    reddit: {
                        enabled: false
                    },
                    email: {
                        enabled: false
                    }
                }
            });
        });

        var username = $routeParams.user;
        $scope.action = $routeParams.action;

        var userModel = userService.userModel;
        var neighbor = userService.neighbor;

        $scope.changed = userModel.changed;

        getSeries();

        // Previewing neighbor Collection
        if (username != userModel.username) {
            if (!userModel.preview || username != neighbor.username) {
                userService.Users.query(function(data) {
                    var users = TAFFY(data);

                    var user = users({
                        username: username
                    }).first();

                    if (user) {
                        userService.userCollection.query({
                            userCollection: user.collection
                        }, function(data) {
                            neighbor.cards = data;
                            neighbor.username = user.username;
                            neighbor.avatar = user.avatar
                            neighbor.collection = user.collection

                            updateCollection(neighbor, true);

                            userModel.preview = true;

                        });
                    } else {
                        //User doesn't exist
                        userModel.preview = false;
                        userService.destroyNeighbor();

                        $location.path("/");
                    }
                })
            } else {
                updateCollection(neighbor, true);
            }
        } else {
            updateCollection(userModel);
        }

        if (isLoggedIn && username == userModel.username) {
            userService.destroyNeighbor();
            userModel.preview = false;
        }

        // Show User Collection
        if (isLoggedIn && username == userModel.username && !userModel.cards) {
            userService.userCollection.query({
                userCollection: userModel.collection
            }, function(data) {
                userModel.cards = data;

                updateCollection(userModel);
            });
        }

        function updateCollection(user, neighbor) {
            if (user.cards.length < 200 && !neighbor){
                userService.getSeries2.query(function(data) {
                    $scope.collection = user.cards.concat(data);

                    userModel.cards = $scope.collection;

                    userService.userCollection.update({
                        userCollection: userModel.collection
                    }, $scope.collection);
                });
            }else{
                $scope.collection = user.cards;
            }

            $scope.avatar = user.avatar;
            $scope.username = user.username;
        }

        $scope.$watch(function() {
            return userService.userModel.preview;
        }, function(newValue, oldValue) {
            $scope.preview = newValue;
        });

        $scope.updateOwn = function(card) {
            card.own = !card.own;
            triggerChange(true);
        }

        $scope.updateFav = function(card) {
            card.favorite = !card.favorite;
            triggerChange(true);
        }

        $scope.updateRepeated = function(card) {
            card.repeated = !card.repeated;
            triggerChange(true);
        }

        $scope.saveChanges = function() {
            userService.userCollection.update({
                userCollection: userModel.collection
            }, userModel.cards);
            triggerChange(false);
        }

        $scope.changeSeries = function (serie){
            userModel.serie = serie;
        }

        function triggerChange(change) {
            userModel.changed = change;
            $scope.changed = userModel.changed;
        }

        function getSeries(){
            $scope.series = userModel.serie;
        }

    }]);

})();
(function(){
"use strict";
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

})();