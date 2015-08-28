var myAppModule = angular.module('myApp', ['ui.router']);
myAppModule.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    //$urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('landing', {
            url: "/",
            templateUrl: "../templates/landing.html"
        })
        .state('collection', {
            url: "/collection",
            templateUrl: "../templates/collection.html"
        })
        .state('album', {
            url: "/album",
            templateUrl: "../templates/album.html"
        })
});

myAppModule.factory('coolthings', function () {
    return { coolThings:
        [
    {name: 'fiorst cool thing'},
    {name: 'second cool thing'}
        ]
    }
})

myAppModule.controller('album', ['$scope, $interval, coolthings', function ($scope, $interval, coolthings) {
    $scope.albumPicaso = albumPicaso;
    $scope.coolthings = coolthings.coolThings;
}]);