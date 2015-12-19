angular
    .module('app')
    .controller('mainController', ['$scope', 'userService', 'session', 'storageService', '$location', function($scope, userService, session, storageService, $location) {
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
