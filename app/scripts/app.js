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

myAppModule.controller('AlbumController', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.currentAlbum = SongPlayer.currentAlbum;
    $scope.currentSoundFile = SongPlayer.currentSoundFile;
    $scope.currentSongIndex = SongPlayer.currentSongIndex;
    $scope.isPlaying = SongPlayer.playing;
    SongPlayer.trackTime();
    $scope.currentSongTime = SongPlayer.currentSongTime;
    $scope.currentSongInAlbum = $scope.currentAlbum.songs[$scope.currentSongIndex];

    //alert($scope.currentAlbum.name + "  " + $scope.currentSongInAlbum.name);

    $scope.playPause = function(songIndex){
        SongPlayer.isPlaying(songIndex);
        if (songIndex !== SongPlayer.currentSongIndex) {
            SongPlayer.setSong(songIndex);
        }

        if(SongPlayer.playing){
            SongPlayer.pause();
        }
        else{
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
    };

    $scope.nextSong = function() {
        SongPlayer.nextSong();
    };

    $scope.previousSong = function() {
        SongPlayer.previousSong();
    };

    $scope.playSong = function(){
        //$scope.isPlaying = SongPlayer.playing;
        if(SongPlayer.playing){
            SongPlayer.pause();
        }
        else{
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
    };
}]);

myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentSongIndex: -1,
        currentSongInAlbum: null,
        currentVolume: 50,
        currentSongTime: 0,
        playing: false,
        pause: function() {
            this.playing = false;
            this.paused = true;
            this.currentSoundFile.pause();
        },
        play: function(){
            this.playing = true;
            this.paused = false;
            this.currentSoundFile.play();
        },
        nextSong: function(){
            this.currentSongIndex +=1;
            //check for the last song
            if(this.currentSongIndex === this.currentAlbum.songs.length){
                this.currentSongIndex = 0;
            }
            this.setSong(this.currentSongIndex);
            this.play();
        },
        previousSong: function(){
            this.currentSongIndex -=1;
            //check for the first song
            if(this.currentSongIndex === -1){
                this.currentSongIndex = this.currentAlbum.songs.length -1;
            }
            this.setSong(this.currentSongIndex);
            this.play();
        },
        setSong: function(songIndex){
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }

            this.currentSongIndex = songIndex;
            this.currentSoundFile = new buzz.sound(albumPicasso.songs[songIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            this.setVolume(this.currentVolume);
        },
        isPlaying: function(songIndex){
            if(this.currentSongIndex === songIndex && this.paused === false) {
                this.playing = true;
            }
            else
                this.playing = false;
        },
        setVolume: function(volume) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setVolume(volume);
            }
        },
        setTime: function(time) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setTime(time);
            }
        },
        trackTime: function() {
            if (this.currentSoundFile) {
                this.currentSongTime = this.currentSoundFile.getTime();
            }
        }
    }
});