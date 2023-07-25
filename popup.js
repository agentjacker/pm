var port = chrome.runtime.connect({ name: "Sample Communication" });

function loaded() {
  port.onDisconnect.addListener(function() {
    console.error("Port disconnected. Please check your background script.");
  });

  port.postMessage({ action: "get-stuff" });
}

document.addEventListener('DOMContentLoaded', loaded);

function listListeners(listeners) {
  // Implementation of listing listeners in the popup (unchanged)
}

