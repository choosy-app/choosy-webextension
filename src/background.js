"use strict";

class Choosy {
  promptAll({tab, ...request}) {
    this.call({
      method: "prompt.all",
      tab,
      url: tab.url,
      ...request,
    });
  }

  call(request) {
    this.nativeMessagingCall(request).catch((error) => {
      console.error("Native messaging failed: ", error);
      this.legacyCall(request);
    });
  }

  nativeMessagingCall({method, url}) {
    return new Promise((resolve, reject) => {
      try {
        host.runtime.sendNativeMessage(
          "com.choosyosx.choosy.nativemessaging",
          {method, url},
          (response) => {
            if (!response) {
              reject(host.runtime.lastError.message);
            } else if (response && !response.ok) {
              reject(response);
            } else {
              resolve();
            }
          }
        );
      } catch(e) {
        reject(e);
      }
    });
  }

  legacyCall({method, url, tab}) {
    host.tabs.update(
      tab.id,
      {url: "x-choosy://" + method + "/" + url},
    );
  }
};

const choosy = new Choosy();
const host = globalThis.browser || globalThis.chrome;

host.action.onClicked.addListener((tab) => choosy.promptAll({tab}));

host.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "choosy-menu-item") {
    choosy.promptAll({url: info.linkUrl, tab});
  }
});

host.runtime.onInstalled.addListener(() => host.contextMenus.create({
  id: "choosy-menu-item",
  title: "Open with Choosy",
  contexts: ["link"]
}));
