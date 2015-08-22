var Choosy = {
  promptAll: function(url) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", "x-choosy://prompt.all/" + escape(url));
    document.body.appendChild(iframe);
  }
};

chrome.browserAction.onClicked.addListener(function(tab) {
  Choosy.promptAll(tab.url);
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "choosy-menu-item") {
    Choosy.promptAll(info.linkUrl);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "choosy-menu-item",
    title: "Open with Choosy",
    contexts: ["link"]
  });
});
