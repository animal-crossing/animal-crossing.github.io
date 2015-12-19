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
