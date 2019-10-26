if (typeof browser === "undefined") {
  // Google Chrome
  browser = chrome;
}

var Choosy = {
  promptAll: function(url, tab) {
    this.call("prompt.all", url, tab);
  },

  call: function (method, url, tab) {
    this.nativeMessagingCall(method, url).catch((error) => {
      console.error("Native messaging failed: ", error);
      this.legacyCall(method, url, tab);
    });
  },

  nativeMessagingCall: function (method, url) {
    return new Promise(function (resolve, reject) {
      browser.runtime.sendNativeMessage(
        "com.choosyosx.choosy.nativemessaging",
        {"method": method, "url": url},
        function (response) {
          if (!response) {
            reject(browser.runtime.lastError.message);
          } else if (response && !response.ok) {
            reject(response);
          } else {
            resolve();
          }
        }
      );
    });
  },

  legacyCall: function (method, url, tab) {
    browser.tabs.update(
      tab.id,
      {url: "x-choosy://" + method + "/" + url},
    );
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
