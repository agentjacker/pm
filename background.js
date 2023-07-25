const tab_listeners = {};
const tab_push = {};
const tab_lasturl = {};
let selectedId = -1;

function refreshCount() {
  const txt = tab_listeners[selectedId] ? tab_listeners[selectedId].length : 0;
  chrome.tabs.get(selectedId, function(tab) {
    if (chrome.runtime.lastError) {
      return; // Error occurred while getting the tab info, handle it if needed.
    }

    chrome.browserAction.setBadgeText({ text: '' + txt, tabId: selectedId });
    if (txt > 0) {
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 0] });
    }
  });
}

function logListener(data) {
  chrome.storage.sync.get({
    log_url: ''
  }, function(items) {
    const log_url = items.log_url;
    if (!log_url.length) return;
    data = JSON.stringify(data);
    try {
      fetch(log_url, {
        method: 'post',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: data
      });
    } catch (e) {
      console.error('Error sending data:', e);
    }
  });
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log('message from cs', msg);
  const tabId = sender.tab.id;
  if (msg.listener && msg.listener !== 'function () { [native code] }') {
    msg.parent_url = sender.tab.url;
    tab_listeners[tabId] = tab_listeners[tabId] || [];
    tab_listeners[tabId].push(msg);
    logListener(msg);
  }

  if (msg.pushState) {
    tab_push[tabId] = true;
  }

  if (msg.changePage) {
    delete tab_lasturl[tabId];
  }

  if (!msg.log) {
    refreshCount();
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  console.log(props);
  if (props.status === "complete") {
    if (tabId === selectedId) {
      refreshCount();
    }
  } else if (props.status) {
    if (tab_push[tabId]) {
      // This was a pushState, ignore
      delete tab_push[tabId];
    } else {
      //if (props.url && tab_lasturl[tabId] && props.url.split('#')[0] == tab_lasturl[tabId]) {
        // Same URL as before, only a hash change, ignore
      //} else 
      if (!tab_lasturl[tabId]) {
        // Wipe on other statuses, but only if last page is not set (i.e., changePage did not run)
        tab_listeners[tabId] = [];
      }
    }
  }

  if (props.status === "loading") {
    tab_lasturl[tabId] = true;
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  selectedId = activeInfo.tabId;
  refreshCount();
});

// Initial setup
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  selectedId = tabs[0].id;
  refreshCount();
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage({ listeners: tab_listeners });
  });
});
