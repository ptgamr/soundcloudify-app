(function(){
    'use strict';

    angular.module('soundCloudify')
        .factory("Messaging", MessagingService);

    function MessagingService() {
        var onTimeUpdate, onEnded, onTrackChanged, onError;

        var port = chrome.runtime.connect({name: "soundcloudify"});

        port.onMessage.addListener(function(event) {
            var data = event.data;

            switch(event.message) {
                case 'scd.timeupdate':
                    if(onTimeUpdate)
                        onTimeUpdate(data);
                    break;
                case 'scd.ended':
                    if(onEnded)
                        onEnded(data);
                    break;
                case 'scd.trackChangedFromBackground':
                    if(onTrackChanged)
                        onTrackChanged(data);
                    break;
                case 'scd.error':
                    if(onError)
                        onError();
                    break;
            }
        });
            
        return {
                registerErrorHandler: registerErrorHandler,
                registerTimeUpdateHandler: registerTimeUpdateHandler,
                registerEndedHandler: registerEndedHandler,
                registerTrackChangedFromBackgroundHandler: registerTrackChangedFromBackgroundHandler,

                sendPlayMessage: sendPlayMessage,
                sendNextMessage: sendNextMessage,
                sendPrevMessage: sendPrevMessage,
                sendPauseMessage: sendPauseMessage,
                sendClearMessage: sendClearMessage,
                sendResumeMessage: sendResumeMessage,
                sendSeekMessage: sendSeekMessage,
                sendVolumeMessage: sendVolumeMessage,

                sendLastFmAuthenticationMessage: sendLastFmAuthenticationMessage
        };

        function registerErrorHandler(callback) {
            onError = callback;
        }

        function registerTimeUpdateHandler(callback) {
            onTimeUpdate = callback;
        }

        function registerEndedHandler(callback) {
            onEnded = callback;
        }

        function registerTrackChangedFromBackgroundHandler(callback) {
            onTrackChanged = callback;
        }

        function sendPlayMessage(track) {
            port.postMessage({message: 'scd.play', data: {
                    track: track
            }});
        }

        function sendNextMessage() {
            port.postMessage({message: 'scd.next'});
        }

        function sendPrevMessage() {
            port.postMessage({message: 'scd.prev'}); 
        }

        function sendPauseMessage() {
            port.postMessage({message: 'scd.pause'});
        }

        function sendClearMessage() {
            port.postMessage({message: 'scd.clear'}); 
        }

        function sendResumeMessage() {
            port.postMessage({message: 'scd.resume'});
        }

        function sendSeekMessage(xpos) {
            port.postMessage({message: 'scd.seek', data: {
                    xpos: xpos
            }});
        }

        function sendVolumeMessage(volume) {
            port.postMessage({message: 'scd.volume', data: {
                    volume: volume
            }});
        }

        function sendLastFmAuthenticationMessage() {
            port.postMessage({message: 'lastfm.authentication'});
        }
    }    

}());