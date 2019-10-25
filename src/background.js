if (typeof browser === "undefined") {
  // Google Chrome
  browser = chrome;
}

var Choosy = {
  promptAll: function(url) {
    this.call("prompt.all", url);
  },

  call: function (method, url) {
    browser.runtime.sendNativeMessage(
      "com.choosyosx.choosy.nativemessaging",
      {"method": method, "url": url},
      function (response) {
        if (!response.ok) {
          console.error(response);
        }
      }
    );
  }
};

browser.browserAction.onClicked.addListener(function (tab) {
  Choosy.promptAll(tab.url);
});

browser.contextMenus.onClicked.addListener(function (info) {
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
