// extension popup when clicked
chrome.browserAction.onClicked.addListener(function(tab) {
  alert('working?');
});
