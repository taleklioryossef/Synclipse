document.getElementById('startBtn').addEventListener('click', async () => {
  const interval = parseInt(document.getElementById('interval').value);
  const duration = parseInt(document.getElementById('duration').value);
  
  if (interval < 1 || interval > 60) {
    alert('Please enter an interval between 1 and 60 seconds');
    return;
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('linkedin.com')) {
    alert('Please navigate to a LinkedIn page first');
    return;
  }
  
  chrome.runtime.sendMessage({
    action: 'start',
    tabId: tab.id,
    url: tab.url,
    interval: interval,
    duration: duration
  });
  
  updateStatus('Active');
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
  updateStatus('Stopped');
});

function updateStatus(text) {
  document.getElementById('status').textContent = text;
}

// Check status on popup open
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
  if (response && response.active) {
    updateStatus('Active');
  }
});