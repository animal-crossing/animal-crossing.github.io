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
                changed: false
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

        userService.getDefaultCollection = $resource(baseUrl + '/3191b');

        userService.userCollection = $resource(baseUrl + '/:userCollection', {
            userCollection: '@collection'
        }, {
            'update': {
                method: 'PUT',
                isArray: true
            }
        });

        userService.postUserCollection = $resource(baseUrl);

        return userService;
    }]);
