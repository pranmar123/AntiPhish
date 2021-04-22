// courtesy of https://stackoverflow.com/questions/43050868/can-i-get-access-to-localstorage-of-site-from-chrome-extension
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        try {
            const key = "score"
    
            console.log("Made it here");
            
            // Execute script in the current tab
            fromPageLocalStore = chrome.tabs.executeScript(null, { code: "localStorage.getItem('score');"}, function(result){
                console.log(result);
                localStorage.setItem(key, result);
            });
            chrome.tabs.executeScript(null, { code: "document.documentElement.innerHTML;"}, function(result) {
                console.log(result);
            });
            console.log("Made it here 2");
        } 
        catch(err) {
            // Log exceptions
        }  
    }
});
