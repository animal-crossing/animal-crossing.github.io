!function(){"use strict";hello.init({google:"938000328729-l8ora04d42634g8ln8d77mvgtt1g011d.apps.googleusercontent.com"}),angular.module("app",["ui.bootstrap","ngAnimate","ngRoute","ngResource","angular-loading-bar","LocalStorageModule"]).config(["$routeProvider","localStorageServiceProvider",function(e,o){e.when("/",{templateUrl:"public/app/views/index.html",controller:"mainController",resolve:{session:["storageService",function(e){return e.getStorageService(!0)}]}}).when("/auth",{template:" ",controller:"authController",resolve:{userModel:["authService",function(e){return e.auth()}],session:["storageService",function(e){return e.getStorageService(!0)}]}}).when("/visit",{templateUrl:"public/app/views/visit_village.html",controller:"villageController",resolve:{users:["userService",function(e){return e.Users.query().$promise.then(function(e){return e})}]}}).when("/about",{templateUrl:"public/app/views/about.html",controller:"aboutController"}).when("/:user/:action?",{templateUrl:"public/app/views/collection.html",controller:"collectionController",resolve:{isLoggedIn:["authService",function(e){return e.isLoggedIn()}],session:["storageService",function(e){return e.getStorageService(!0)}]}}).otherwise({redirectTo:"/"}),o.setPrefix("ac").setStorageCookieDomain("http://animal-crossing.github.io")}])}(),function(){"use strict";angular.module("app").controller("aboutController",["$scope",function(e){}])}(),function(){"use strict";angular.module("app").controller("authController",["$scope","$location","$log","userModel","userService","session","storageService",function(e,o,r,t,n,i,a){function s(){i&&a.createSession(i)}function l(e){n.userCollection.query({userCollection:e.collection},function(o){n.userModel.id=e.id,n.userModel.name=e.name,n.userModel.username=e.username,n.userModel.avatar=e.avatar,n.userModel.collection=e.collection,s(),n.userModel.cards=o,c(n.userModel.username)})}function c(e){n.destroyNeighbor(),n.userModel.preview=!1,o.path("/"+e)}i&&a.populateStorageData(i),t=n.userModel,t.id?t.collection?l(t):n.Users.query(function(e){var o=TAFFY(e),r=o({id:t.id}).first();r?l(r):n.postUserCollection.save(t.cards,function(e){for(t.collection=e.uri.substr(e.uri.lastIndexOf("/")+1);o({username:t.username}).first();)t.username=t.username+Math.floor(900*Math.random())+100;o.insert({id:t.id,name:t.name,username:t.username,avatar:t.avatar,collection:t.collection}),n.Users.update({},o().stringify()),s(),c(t.username)})}):c("")}])}(),function(){"use strict";angular.module("app").factory("authService",["$location","$q","userService","storageService",function(e,o,r,t){return{auth:function(){var e=o.defer(),n=r.userModel,i=t.getStorageService();return!n.id||i&&!i.get("id")?hello("google").login().then(function(o){n.access_token=o.authResponse.access_token,n.client_id=o.authResponse.client_id,n.network=o.network,i.set("access_token",o.authResponse.access_token),i.set("client_id",o.authResponse.client_id),i.set("network",o.network),hello(o.network).api("/me").then(function(o){o.name&&e.resolve(""),n.id=o.id,n.name=o.name;var r=o.name.replace(/\s+/g,"");r.length>15&&(r=o.first_name.split(" ")[0].slice(0,15)),n.username=r,n.avatar=o.image.url.slice(0,-2)+"150",i.set("id",n.id),i.set("name",n.name),i.set("username",n.username),i.set("avatar",n.avatar),e.resolve(!0)})},function(o){e.resolve(!1)}):hello("google").logout().then(function(){r.init(),i.clearAll(),e.resolve("")}),e.promise},isLoggedIn:function(){var e=o.defer(),n=t.getStorageService();return n&&!r.userModel.id&&t.populateStorageData(n),r.userModel.id?e.resolve(!0):e.resolve(!1),e.promise}}}])}(),function(){"use strict";angular.module("app").controller("mainController",["$scope","userService","session","storageService","$location",function(e,o,r,t,n){if(e.series=1,r&&r.get("id"))t.populateStorageData(r),n.path("/"+r.get("username"));else{var i=o.userModel;i.cards?e.cards=i.cards:o.getDefaultCollection.get(function(o){i.cards=o.cards,e.cards=o.cards})}}])}(),function(){"use strict";angular.module("app").controller("menuController",["$scope","userService",function(e,o){e.isCollapsed=!0,e.$watch(function(){return o.userModel},function(o,r){e.userModel=o},!0),e.$watch(function(){return o.neighbor},function(o,r){e.neighbor=o},!0),e.collapse=function(){e.isCollapsed=!0}}])}(),function(){"use strict";angular.module("app").factory("storageService",["localStorageService","userService","$q",function(e,o,r){return{getStorageService:function(o){var o=o||!1,t=r.defer();if(e.isSupported){if(!o)return e;t.resolve(e)}else if(e.cookie.isSupported){if(!o)return e.cookie;t.resolve(e.cookie)}else{if(!o)return!1;t.resolve(!1)}return t.promise},populateStorageData:function(e){o.userModel.id=e.get("id"),o.userModel.name=e.get("name"),o.userModel.username=e.get("username"),o.userModel.avatar=e.get("avatar"),o.userModel.collection=e.get("collection"),o.userModel.access_token=e.get("access_token"),o.userModel.network=e.get("network"),o.userModel.client_id=e.get("client_id")},createSession:function(e){e.set("id",o.userModel.id),e.set("name",o.userModel.name),e.set("username",o.userModel.username),e.set("avatar",o.userModel.avatar),e.set("collection",o.userModel.collection),e.set("access_token",o.userModel.access_token),e.set("network",o.userModel.network),e.set("client_id",o.userModel.client_id)}}}])}(),function(){"use strict";angular.module("app").factory("userService",["$resource",function(e){var o="https://api.myjson.com/bins",r={};return r.init=function(){r.userModel={id:"",name:"",username:"",avatar:"",cards:!1,collection:"",access_token:"",network:"",client_id:"",preview:!1,changed:!1,serie:1}},r.destroyNeighbor=function(){r.neighbor={avatar:"",username:"",cards:!1,collection:""}},r.init(),r.destroyNeighbor(),r.Users=e(o+"/1wizj",{},{update:{method:"PUT",isArray:!0}}),r.getDefaultCollection=e(o+"/5325p"),r.userCollection=e(o+"/:userCollection",{userCollection:"@collection"},{update:{method:"PUT",isArray:!0}}),r.getSeries2=e(o+"/1u829"),r.postUserCollection=e(o),r}])}(),function(){"use strict";angular.module("app").controller("villageController",["$scope","users","$location",function(e,o,r){e.villager={username:""},e.limit=25,e.showMore=function(){e.limit+=25},e.users=o,e.goToVillage=function(e){r.path("/"+e+"/collection")}}])}(),function(){"use strict";angular.module("app").controller("collectionController",["$scope","userService","isLoggedIn","$location","$routeParams",function(e,o,r,t,n){function i(r,t){r.cards.length<200&&!t?o.getSeries2.query(function(t){e.collection=r.cards.concat(t),c.cards=e.collection,o.userCollection.update({userCollection:c.collection},e.collection)}):e.collection=r.cards,e.avatar=r.avatar,e.username=r.username}function a(o){c.changed=o,e.changed=c.changed}function s(){e.series=c.serie}angular.element(document).ready(function(){new ShareButton({url:"animal-crossing.github.io/#/"+n.user+"/"+n.action,description:"Check "+n.user+" "+n.action+" Animal Crossing cards",networks:{pinterest:{enabled:!1},linkedin:{enabled:!1},reddit:{enabled:!1},email:{enabled:!1}}})});var l=n.user;e.action=n.action;var c=o.userModel,u=o.neighbor;e.changed=c.changed,s(),l!=c.username?c.preview&&l==u.username?i(u,!0):o.Users.query(function(e){var r=TAFFY(e),n=r({username:l}).first();n?o.userCollection.query({userCollection:n.collection},function(e){u.cards=e,u.username=n.username,u.avatar=n.avatar,u.collection=n.collection,i(u,!0),c.preview=!0}):(c.preview=!1,o.destroyNeighbor(),t.path("/"))}):i(c),r&&l==c.username&&(o.destroyNeighbor(),c.preview=!1),r&&l==c.username&&!c.cards&&o.userCollection.query({userCollection:c.collection},function(e){c.cards=e,i(c)}),e.$watch(function(){return o.userModel.preview},function(o,r){e.preview=o}),e.updateOwn=function(e){e.own=!e.own,a(!0)},e.updateFav=function(e){e.favorite=!e.favorite,a(!0)},e.updateRepeated=function(e){e.repeated=!e.repeated,a(!0)},e.saveChanges=function(){o.userCollection.update({userCollection:c.collection},c.cards),a(!1)},e.changeSeries=function(e){c.serie=e}}])}(),function(){"use strict";angular.module("app").filter("byAction",function(){return function(e,o,r){var t=[];return void 0===o?e:(angular.forEach(e,function(e){switch(o){case"collection":e.own?t.push(e):!1;break;case"favorites":e.favorite?t.push(e):!1;break;case"missing":r?!e.own&&e.favorite?t.push(e):!1:e.own?!1:t.push(e);break;case"repeated":e.repeated?t.push(e):!1}}),t)}}).filter("bySerie",function(){return function(e,o){if(e){var r=[];return void 0===o&&(o=1),angular.forEach(e,function(e){switch(o){case 1:1==e.release_set?r.push(e):!1;break;case 2:2==e.release_set?r.push(e):!1}}),r}}})}();