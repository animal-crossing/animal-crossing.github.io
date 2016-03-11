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

        userService.getDefaultCollection = $resource(baseUrl + '/u0eb');

        userService.userCollection = $resource(baseUrl + '/:userCollection', {
            userCollection: '@collection'
        }, {
            'update': {
                method: 'PUT',
                isArray: true
            }
        });

        userService.getSeries2 = $resource(baseUrl + '/1u829');
        userService.getSeries3 = $resource(baseUrl + '/3c14z');

        userService.postUserCollection = $resource(baseUrl);

        return userService;
    }]);
