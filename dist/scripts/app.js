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
    $('body').css('background-image', 'none');
    $('body').css('padding-bottom', '0px');
    $scope.mainTitle = "Turn the music up!";

    var animatePoints = function () {
        var revealPoint = function () {
            $(this).css({
                opacity: 1,
                transform: 'scaleX(1) translateY(0)'
            });
        };

        $.each($('.point'), revealPoint);
    };

    $(window).load(function() {
        if ($(window).height() > 950) {
            animatePoints();
        }

        $(window).scroll(function(event) {
            if ($(window).scrollTop() >= 500) {
                animatePoints();
            }
        });
    });
}]);

myAppModule.controller('CollectionController', ['$scope', function($scope) {
    $('body').css('background-image', 'url("../assets/images/blurred_backgrounds/blur_bg_2.jpg")');
    $('body').css('padding-bottom', '0px');
    var albumsArray = [];
    for (var i = 0; i < 8; i++) {
        var currentAlbum = angular.copy(albumPicasso);
        albumsArray.push(currentAlbum);
    }

    $scope.albums = albumsArray;
}]);

myAppModule.controller('AlbumController', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $('body').css('background-image', 'url("../assets/images/blurred_backgrounds/blur_bg_2.jpg")');
    $('body').css('padding-bottom', '150px');

    $scope.currentAlbum = SongPlayer.currentAlbum;
    $scope.currentSoundFile = SongPlayer.currentSoundFile;
    $scope.currentSongIndex = SongPlayer.currentSongIndex;
    $scope.isPlaying = SongPlayer.playing;
    SongPlayer.trackTime();
    $scope.currentSongTime = SongPlayer.currentSongTime;

    $scope.songPlayer = SongPlayer;

    SongPlayer.onTimeUpdate(function(event, time) {
        $scope.$apply(function() {
            $scope.currentSongTime = time;
        });
    });

    var hoveredSongIndex = null;

    $scope.onSongHover = function(songIndex) {
        hoveredSongIndex = songIndex;
    };

    $scope.offSongHover = function() {
        hoveredSongIndex = null;
    };

    $scope.getSongClass = function(songIndex) {
        if (songIndex === SongPlayer.currentSongIndex && SongPlayer.playing) {
            return 'playing';
        }
        else if (songIndex === hoveredSongIndex || songIndex === SongPlayer.currentSongIndex) {
            return 'hovered';
        }
        return 'default';
    };

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
        $scope.currentSongName= SongPlayer.currentSongName;
        $scope.currentArtistName= SongPlayer.currentArtistName;
        $scope.currentSongTotalTime = SongPlayer.totalSongLength;
    };

    $scope.nextSong = function() {
        SongPlayer.nextSong();
    };

    $scope.previousSong = function() {
        SongPlayer.previousSong();
    };

    $scope.playSong = function(){
        if(SongPlayer.playing){
            SongPlayer.pause();
        }
        else{
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
    };
}]);

myAppModule.service('SongPlayer', [ '$rootScope', function($rootScope) {
    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentSongIndex: -1,
        currentSongInAlbum: null,
        currentVolume: 50,
        currentSongTime: 0,
        playing: false,
        currentSongName: null,
        totalSongLength: null,
        currentArtistName: null,
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

            this.currentSongName= albumPicasso.songs[songIndex].name;
            this.totalSongLength= albumPicasso.songs[songIndex].length;
            this.currentArtistName= albumPicasso.artist;
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
            this.currentVolume = volume;
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
        },
        seek: function(time) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setTime(time);
            }
        },
        onTimeUpdate: function(callback) {
            return $rootScope.$on('sound:timeupdate', callback);
        }
    }
}]);

myAppModule.directive('slider', ['$document', function($document){

    var getSliderPercentage = function($slider, event) {
        var offsetX = event.pageX - $slider.offset().left;
        var sliderWidth = $slider.width();
        var offsetXPercent = (offsetX / sliderWidth);
        offsetXPercent = Math.max(0,offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
    };

    var getNumericValue = function(input, defaultValue) {
        if (typeof input === 'number') {
            return input;
        }

        if (typeof input === 'undefined') {
            return defaultValue;
        }

        if (typeof input === 'string') {
            return Number(input);
        }
    };

    return{
        templateUrl: '../templates/slider.html',
        replace: true,
        restrict: 'E',
        scope: {
            onChange: '&'
        },
        link: function(scope, element, attributes) {
            scope.value = 0;
            scope.max = 100;

            var $seekBar = element;

            attributes.$observe('value', function(newValue) {
                scope.value = getNumericValue(newValue, 0);
            });

            attributes.$observe('max', function(newValue) {
                scope.max = getNumericValue(newValue, 100) || 100;
            });

            var percentString = function() {
                var value = scope.value || 0;
                var max = scope.max || 100;
                var percent = value / max * 100;
                return percent + "%";
            };

            scope.fillStyle = function() {
                return {width: percentString()};
            };

            scope.thumbStyle = function() {
                return {left: percentString()};
            };

            scope.onClickSlider = function(event) {
                var percent = getSliderPercentage($seekBar, event);
                scope.value = percent * scope.max;
                notifyCallback(scope.value);
            };

            scope.trackThumb = function() {
                $document.bind('mousemove.thumb', function(event) {
                    var percent = getSliderPercentage($seekBar, event);
                    scope.$apply(function() {
                        scope.value = percent * scope.max;
                        notifyCallback(scope.value);
                    });
                });

                $document.bind('mouseup.thumb', function() {
                    $document.unbind('mousemove.thumb');
                    $document.unbind('mouseup.thumb');
                });
            };

            var notifyCallback = function(newValue) {
                if (typeof scope.onChange === 'function') {
                    scope.onChange({value: newValue});
                }
            };
        }
    };
}]);

myAppModule.filter('timeFilter', function() {
    return function(input) {
        var secs = parseFloat(input);
        if (secs == undefined || Number.isNaN(secs)) {
            return '-:--';
        }

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.floor(divisor_for_seconds);

        if (seconds < 10){
            seconds = "0" + seconds;
        }
        input = minutes + ":" + seconds;
        return input;
    };
});