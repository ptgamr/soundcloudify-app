(function(){
    'use strict';

    angular.module('soundcloudify.chromeapp')
        .service("YouTubePlayer", YouTubePlayer);

    function YouTubePlayer($rootScope, CLIENT_ID, $document, $window){
        var youtubeProgressTimer = null;
        var webview = document.getElementById('youtubeFrame');

        // webview.request.onBeforeRequest.addListener(
        //   function(details) { 
        //     return {cancel: true};
        //   },
        //   {urls: ["*://www.evil.com/*"]},
        //   ["blocking"]
        // );
    
        var iframeUrlPattern = 'https://www.youtube.com/embed/*';

        webview.request.onBeforeSendHeaders.addListener(function(info) {

            var refererRequestHeader;
            var referer = 'https://www.youtube.com/';

            info.requestHeaders.forEach(function(header) {
                if (header.name === 'Referer') {
                    refererRequestHeader = header;
                }
            });

            if (typeof refererRequestHeader === 'undefined') {
                info.requestHeaders.push({
                    name: 'Referer',
                    value: referer
                });
            } else {
                refererRequestHeader.value = referer;
            }

            return { requestHeaders: info.requestHeaders };

        }, {
            urls: [iframeUrlPattern]
        }, ['blocking', 'requestHeaders']);

        this.play = function(track) {
            postMessage({
                command: 'play',
                videoId: track.id
            });
        };
        this.resume = function() {
            postMessage({
                command: 'resume'
            });
        };
        this.pause = function() {
            postMessage({
                command: 'pause'
            });
        };
        this.stop = function() {
            postMessage({
                command: 'stop'
            });
        };
        this.replay = function() {
            postMessage({
                command: 'replay'
            });
        };
        this.seek = function(xpos) {
            postMessage({
                command: 'seek',
                xpos: xpos
            });
        };
        this.clear = function() {
            postMessage({
                command: 'clear'
            });
        };
        this.setVolume = function(volume) {
            postMessage({
                command: 'setVolume',
                volume: volume
            });
        };

        // on result from sandboxed frame:
        $window.addEventListener('message', function(event) {

            var command = event.data.command;

            switch(command) {
                case 'player.timeupdate':
                    clearTimeout(youtubeProgressTimer);
                    youtubeProgressTimer = setInterval(function() {
                        $rootScope.$broadcast('player.timeupdate', {
                            currentTime: event.data.currentTime,
                            duration: event.data.duration
                        });
                    }, 1000);
                    break;
                case 'player.ended':
                    $rootScope.$broadcast('player.ended');
                    break;
                case 'player.error':
                    $rootScope.$broadcast('player.error');
                    break;
            }
        });

        function postMessage(message) {
            if (webview) {
                webview.contentWindow.postMessage(message, '*');
            }
        }
    };

}());
