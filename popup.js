var port = chrome.runtime.connect({ name: "Sample Communication" });

function loaded() {
  port.onMessage.addListener(function (msg) {
    console.log("message received: ", msg);
    listListeners(msg.listeners[selectedId]);
    checkLaterInteractions = msg.checkLater || [];
    showCheckLaterInteractions();
  });

  port.postMessage({ action: "get-stuff" });
}

document.addEventListener('DOMContentLoaded', loaded);

// Function to list postMessage listeners in the popup (unchanged)
function listListeners(listeners) {
  // Implementation of listing listeners in the popup (unchanged)
}

// Function to show interactions that need further verification (unchanged)
function showCheckLaterInteractions() {
  // Implementation to show interactions needing further verification (unchanged)
}
