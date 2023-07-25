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

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('message from cs', msg);
  tabId = sender.tab.id;
  if (msg.action === "get-stuff") {
    sendResponse({ listeners: tab_listeners });
  }
  // Add other message handling if needed
});

chrome.tabs.onUpdated.addListener(function (tabId, props) {
  // Implementation of tabs.onUpdated event handling (unchanged)
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // Implementation of tabs.onActivated event handling (unchanged)
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // Implementation of query active tab (unchanged)
});
