var myAppModule = angular.module('myApp', ['ui.router']);
myAppModule.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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