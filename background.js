let tab_listeners = {};
let tab_push = {};
let tab_lasturl = {};
let selectedId = -1;

function refreshCount(tabId) {
  const txt = tab_listeners[tabId] ? tab_listeners[tabId].length : 0;
  chrome.browserAction.setBadgeText({ text: '' + txt, tabId: tabId });
  chrome.browserAction.setBadgeBackgroundColor({
    color: txt > 0 ? [255, 0, 0, 255] : [0, 0, 255, 0]
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
    } catch (e) { }
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('message from cs', msg);
  const tabId = sender.tab.id;
  if (msg.listener) {
    if (msg.listener === 'function () { [native code] }') return;
    msg.parent_url = sender.tab.url;
    if (!tab_listeners[tabId]) tab_listeners[tabId] = [];
    tab_listeners[tabId].push(msg);
    logListener(msg);
  }
  if (msg.pushState) {
    tab_push[tabId] = true;
  }
  if (msg.changePage) {
    delete tab_lasturl[tabId];
  }
  if (msg.log) {
    console.log(msg.log);
  } else {
    refreshCount(tabId);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, props) {
  console.log(props);
  if (props.status === "complete") {
    if (tabId === selectedId) refreshCount(tabId);
  } else if (props.status) {
    if (tab_push[tabId]) {
      // This was a pushState, ignore
      delete tab_push[tabId];
    } else {
      // This is to handle the case of hash changes
      if (!tab_lasturl[tabId]) {
        // Wipe on other statuses, but only if last page is not set (aka, changePage did not run)
        tab_listeners[tabId] = [];
      }
    }
  }
  if (props.status === "loading") {
    tab_lasturl[tabId] = true;
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  selectedId = activeInfo.tabId;
  refreshCount(selectedId);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  selectedId = tabs[0].id;
  refreshCount(selectedId);
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.action === "get-stuff") {
      port.postMessage({ listeners: tab_listeners, checkLater: checkLaterInteractions });
    }
  });
});
