// ...

// Add a global array to store postMessage interactions that need further verification
var checkLaterInteractions = [];

// Function to check if origin verification is missing or weak
function checkOriginVerification(listener) {
  // Implement basic checks for missing or weak origin verification here
  // For demonstration purposes, we'll check if the listener uses "*"
  // which indicates no origin verification, or if it uses a fixed domain
  // with known weaknesses
  if (listener.listener.includes("'*'") || listener.listener.includes("example.com")) {
    return true; // Weak or missing origin verification detected
  }
  return false; // No issues found
}

// ...

// Update the 'l' function to check for origin verification
function l(listener, pattern_before, additional_offset) {
  // ...
  // Existing code to capture listener details

  var originVerificationStatus = checkOriginVerification(listener);
  if (originVerificationStatus) {
    listener.originVerification = "weak or missing";
    checkLaterInteractions.push(listener);
  }
  // ...
}

// ...

// Injected JS function (updated) to handle postMessage interactions
var injectedJS = function(pushstate, addeventlistener) {
  // ...
  // Existing code (unchanged)

  // Function to analyze postMessage listeners
  var analyzePostMessageListeners = function() {
    // Traverse through all listeners and check for postMessage interactions
    var allListeners = Object.getOwnPropertyNames(window);
    for (var i = 0; i < allListeners.length; i++) {
      var key = allListeners[i];
      var listener = window[key];
      if (typeof listener === "function" && listener.toString().includes("postMessage")) {
        var listenerStr = listener.toString();
        var listenerDetails = { listener: listenerStr };
        // Get additional details about the listener and store it for later verification
        l(listenerDetails);
      }
    }
    // Dispatch a custom event to notify the popup about postMessage interactions
    var storeEvent = new CustomEvent('postMessageTracker', { 'detail': { listeners: tab_listeners, checkLater: checkLaterInteractions } });
    document.dispatchEvent(storeEvent);
  };

  // ...

  // Call the postMessage listeners analysis function on load
  window.addEventListener('load', analyzePostMessageListeners);
  window.addEventListener('postMessageTrackerUpdate', analyzePostMessageListeners);
};

// Convert the injectedJS function to a string (as before)
injectedJS = '(' + injectedJS.toString() + ')(History.prototype.pushState, Window.prototype.addEventListener)';

// ...
