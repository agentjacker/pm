var tab_listeners = {};
var tab_push = {};
var tab_lasturl = {};
var selectedId = -1;

function refreshCount() {
  // Implementation of refreshCount (unchanged)
}

function logListener(data) {
  // Implementation of logListener (unchanged)
}

chrome.runtime.onConnect.addListener(function(port) {
  console.log("Port connected.");
  port.onMessage.addListener(function(msg) {
    console.log('message from cs', msg);
    tabId = port.sender.tab.id;
    if (msg.listener) {
      // Implementation of message handling (unchanged)
    }
    if (msg.pushState) {
      // Implementation of pushState handling (unchanged)
    }
    if (msg.changePage) {
      // Implementation of changePage handling (unchanged)
    }
    if (msg.log) {
      console.log(msg.log);
    } else {
      refreshCount();
    }
  });

  port.onDisconnect.addListener(function() {
    console.log("Port disconnected.");
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  // Implementation of tabs.onUpdated event handling (unchanged)
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // Implementation of tabs.onActivated event handling (unchanged)
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // Implementation of query active tab (unchanged)
});
