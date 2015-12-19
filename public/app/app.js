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
