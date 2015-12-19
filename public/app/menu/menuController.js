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
