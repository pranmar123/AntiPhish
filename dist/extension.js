(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
        });
    });
}

},{}]},{},[1]);
