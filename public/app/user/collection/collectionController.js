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
