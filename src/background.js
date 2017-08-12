if (typeof browser === "undefined") {
  browser = chrome;
}

var Choosy = {
  promptAll: function(url) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", "x-choosy://prompt.all/" + escape(url));
    document.body.appendChild(iframe);
  }
};

browser.browserAction.onClicked.addListener(function(tab) {
  Choosy.promptAll(tab.url);
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "choosy-menu-item") {
    Choosy.promptAll(info.linkUrl);
  }
});

browser.runtime.onInstalled.addListener(function () {
  browser.contextMenus.create({
    id: "choosy-menu-item",
    title: "Open with Choosy",
    contexts: ["link"]
  });
});
