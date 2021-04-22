"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

// =========================== code starts ===============//
const axios = require('axios');
const BASE_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyB4mOQvE8EZ_dapkEYxLzXCPsNzE04pEmc';

let options = {
    clientId: 'safe-browse-url-lookup',
    clientVersion: '1.0.0'
};

function checkMulti(urls) {
    let body = {
        client: {
            clientId: options.clientId,
            clientVersion: options.clientVersion
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION", "THREAT_TYPE_UNSPECIFIED"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map(u => Object.assign({}, { url: u }))
        }
    }

    return axios.post(BASE_URL, body)
        .then(body => {
            let matchingUrls = body.data.hasOwnProperty('matches') ? body.data.matches.map(m => m.threat.url) : [];
            return Object.assign({}, ...urls.map(url => {
                let entry = {};
                entry[url] = matchingUrls.includes(url);
                return entry;
            }));
        });
}

function checkSingle(url) {
    return checkMulti([url]).then(matches => matches[url]);
}

module.exports = (opts) => {
    if (!opts.apiKey) return console.log('[ERROR] You need to specify an API key.');
    Object.assign(options, opts);

    return {
        checkSingle: checkSingle,
        checkMulti: checkMulti
    }
};

// =========== code ends ===========//

function isUrgent(text) {
    if(hasUrgentKeywords(text)) {
        return true;
    }
    else
        false;


}

function hasUrgentKeywords(text){
    var urgentKeywords = ["irs", "Urgent", "Urgency", "suspended", "suspicious", "expire", "Expires", "expired", "expiring", "inactive", 
                            "inactivity", "activate", "reactivate", "ATTENTION"];
    if(iterateUrgentKeywordOverText(text, urgentKeywords)) {
        return true;
    }
    else
        return false;
        

}

function iterateUrgentKeywordOverText(text, urgentKeywords) {
    for(var i = 0; i < urgentKeywords.length; i++){
        if(checkIfKeywordsAreInList(text, urgentKeywords[i])) 
            return true;
        

    }
}

function checkIfKeywordsAreInList(text, Keyword) {
    if(text.includes(Keyword))
        return true;
    else
        return false;

}

function checkGrammar(text) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://textgears-textgears-v1.p.rapidapi.com/readability",
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "x-rapidapi-key": "57e71fd5f5msh828c30a877610afp18a4c4jsn086363988ac1",
      "x-rapidapi-host": "textgears-textgears-v1.p.rapidapi.com"
    },
    "data": {
      "text": text
    }
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

// actual extension-code
function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hello, " + userEmail + ". This is your extension talking!");

        gmail.observe.on("view_email", (domEmail) => {
            console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log("Email data:", emailData);

            var antiPhishScore = 99;
                
            if (isUrgent(emailData.content_html) || isUrgent(emailData.subject)){
                antiPhishScore -= 5;
                console.log("sub 5 " + antiPhishScore);
            }
            else
                console.log("looks Good");

            // Links extract

            var rawHTML = emailData.content_html;

            var doc = document.createElement("html");
            doc.innerHTML = rawHTML;
            var links = doc.getElementsByTagName("a")
            var urls = [];

            for (var i=0; i<links.length; i++) {
                urls.push(links[i].getAttribute("href"));
            }
            console.log(urls);

            
            if (urls != '') {
                checkMulti(urls)
                .then(urlMap => {
                    for (let url in urlMap) {
                        urlMap[url] ? antiPhishScore -= 60 : console.log(`${url} is safe.`);
                    }
                })
                .catch(err => {
                    console.log('Something went wrong.');
                    console.log(err);
                });
            }

            var safeDomains = [".edu", ".com", ".net", ".gov", ".io", ".co", ".us", ".org", ".mil", ".info", ".xyz"];
            if(urls == ''){
                console.log("NO URLS")
            }
            else {
                if(iterateUrgentKeywordOverText(urls[0], safeDomains)) {
                }
                else{
                    antiPhishScore -= 20;
                    console.log("sub 20 " + antiPhishScore);
                //alert(urls)
            }
            }
            console.log(antiPhishScore);

            



            
        });
    });
}
