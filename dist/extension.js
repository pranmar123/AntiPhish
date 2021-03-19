(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
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

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

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
            
            if (isUrgent(emailData.content_html) || isUrgent(emailData.subject))
                console.log("Has a Sense of Urgency");
            else
                console.log("looks Good");
            
            // this printes the extracted contents
            console.log("Looking at email:", domEmail);
            console.log("Email data:", emailData);
            console.log("Email data:", emailData.content_html);
        });

        checkSingle('http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/')
            .then(isMalicious => {
                console.log(isMalicious ? 'Hands off! This URL is evil!' : 'Everything\'s safe.');
            })
            .catch(err => {
                console.log('Something went wrong.');
                console.log(err);
            });

        checkMulti(['https://muetsch.io', 'https://kit.edu'])
            .then(urlMap => {
                for (let url in urlMap) {
                    console.log(urlMap[url] ? `${url} is evil!` : `${url} is safe.`);
                }
            })
            .catch(err => {
                console.log('Something went wrong.');
                console.log(err);
            });
            });
}

},{}]},{},[1]);
