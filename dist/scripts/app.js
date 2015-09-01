var myAppModule = angular.module('myApp', ['ui.router']);
myAppModule.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('landing', {
            url: "/",
            templateUrl: "../templates/landing.html",
            controller: 'LandingController'
        })
        .state('collection', {
            url: "/collection",
            templateUrl: "../templates/collection.html",
            controller: 'CollectionController'
        })
        .state('album', {
            url: "/album",
            templateUrl: "../templates/album.html",
            controller: 'AlbumController'
        })
});

myAppModule.controller('LandingController', ['$scope', function($scope) {
    $scope.mainTitle = "Turn the music up!";
}]);

myAppModule.controller('CollectionController', ['$scope', function($scope) {
    var albumsArray = [];
    for (var i = 0; i < 8; i++) {
        var currentAlbum = angular.copy(albumPicasso);
        albumsArray.push(currentAlbum);
    }

    $scope.albums = albumsArray;
}]);

myAppModule.controller('AlbumController', ['$scope', function($scope) {
    $scope.albumPicasso = albumPicasso;
}]);