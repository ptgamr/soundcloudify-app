'use strict';

// Listens for the app launching then creates the window
chrome.app.runtime.onLaunched.addListener(function() {
  var width = 660;
  var height = 448;

  chrome.app.window.create('index.html', {
    id: 'main',
    bounds: {
      width: width,
      height: height,
      left: Math.round((screen.availWidth - width) / 2),
      top: Math.round((screen.availHeight - height)/2)
    }
  });
});


