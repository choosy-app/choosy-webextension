var callChoosy;

if (typeof browser === "undefined") {
  // Google Chrome
  browser = chrome;
  callChoosy = function (url, sourceTab) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    document.body.appendChild(iframe);
  };
} else {
  // Mozilla Firefox
  callChoosy = function (url, sourceTab) {
    browser.tabs.create({
      "url": url,
      "openerTabId": sourceTab.id,
      "active": false
    }).then(function (tab) {
      browser.tabs.remove(tab.id);
    });
  };
}

var Choosy = {
  promptAll: function(url, sourceTab) {
    callChoosy("x-choosy://prompt.all/" + escape(url), sourceTab);
  }
};

browser.browserAction.onClicked.addListener(function (tab) {
  Choosy.promptAll(tab.url, tab);
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "choosy-menu-item") {
    Choosy.promptAll(info.linkUrl, tab);
  }
});

browser.runtime.onInstalled.addListener(function () {
  browser.contextMenus.create({
    id: "choosy-menu-item",
    title: "Open with Choosy",
    contexts: ["link"]
  });
});
