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
