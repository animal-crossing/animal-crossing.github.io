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
