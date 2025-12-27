let refreshState = {
  active: false,
  tabId: null,
  url: null,
  interval: null,
  intervalId: null,
  endTime: null
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startRefreshing(request);
  } else if (request.action === 'stop') {
    stopRefreshing();
  } else if (request.action === 'getStatus') {
    sendResponse({ active: refreshState.active });
  }
  return true;
});

function startRefreshing(config) {
  stopRefreshing(); // Clear any existing refresh
  
  refreshState = {
    active: true,
    tabId: config.tabId,
    url: config.url,
    interval: config.interval,
    endTime: Date.now() + (config.duration * 60 * 1000)
  };
  
  refreshState.intervalId = setInterval(() => {
    if (Date.now() >= refreshState.endTime) {
      stopRefreshing();
      return;
    }
    
    chrome.tabs.get(refreshState.tabId, (tab) => {
      if (chrome.runtime.lastError) {
        stopRefreshing();
        return;
      }
      chrome.tabs.reload(refreshState.tabId);
    });
  }, config.interval * 1000);
}

function stopRefreshing() {
  if (refreshState.intervalId) {
    clearInterval(refreshState.intervalId);
  }
  refreshState = {
    active: false,
    tabId: null,
    url: null,
    interval: null,
    intervalId: null,
    endTime: null
  };
}