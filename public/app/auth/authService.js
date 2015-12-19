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
