var port = chrome.runtime.connect({ name: "Sample Communication" });
var checkLaterInteractions = [];

function loaded() {
  port.postMessage("get-stuff");
  port.onMessage.addListener(function(msg) {
    console.log("message received yea: ", msg);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      selectedId = tabs[0].id;
      listListeners(msg.listeners[selectedId]);
      checkLaterInteractions = msg.checkLater || [];
      showCheckLaterInteractions();
    });
  });
}

document.addEventListener('DOMContentLoaded', loaded);

function listListeners(listeners) {
  var x = document.getElementById('x');
  x.parentElement.removeChild(x);
  x = document.createElement('ol');
  x.id = 'x';
  document.getElementById('h').innerText = listeners.length ? listeners[0].parent_url : '';

  for (var i = 0; i < listeners.length; i++) {
    // Existing code (unchanged)
  }
  document.getElementById('content').appendChild(x);
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
