function getTabListeners() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { action: "get-stuff" }, function (response) {
        if (response && response.listeners) {
          listListeners(response.listeners[tabId]);
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  getTabListeners();
});

function listListeners(listeners) {
  // Implementation of listing listeners in the popup (unchanged)
}
