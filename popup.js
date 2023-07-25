var port = chrome.runtime.connect({ name: "Sample Communication" });
var checkLaterInteractions = [];

function loaded() {
  port.postMessage("get-stuff");
  port.onMessage.addListener(function(msg) {
    console.log("message received: ", msg);
    listListeners(msg.listeners[selectedId]);
    checkLaterInteractions = msg.checkLater || [];
    showCheckLaterInteractions();
  });
}

document.addEventListener('DOMContentLoaded', loaded);

function listListeners(listeners) {
  // Implementation of listing listeners in the popup (unchanged)
}

function showCheckLaterInteractions() {
  var y = document.getElementById('y');
  if (y) {
    y.parentElement.removeChild(y);
  }
  if (checkLaterInteractions.length === 0) {
    return; // No interactions needing further verification
  }

  y = document.createElement('div');
  y.id = 'y';
  var h = document.createElement('h3');
  h.innerText = 'Check Later to Verify';
  y.appendChild(h);

  var ul = document.createElement('ul');
  for (var i = 0; i < checkLaterInteractions.length; i++) {
    var interaction = checkLaterInteractions[i];
    var li = document.createElement('li');
    li.innerText = interaction.listener;
    ul.appendChild(li);
  }
  y.appendChild(ul);

  document.getElementById('content').appendChild(y);
}
