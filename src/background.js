"use strict";

class Choosy {
  promptAll = ({tab, ...request}) => this.call({
    method: "prompt.all",
    tab,
    url: tab.url,
    ...request,
  })

  call = (request) => this.nativeMessagingCall(request).catch((error) => {
    console.error("Native messaging failed: ", error);
    this.legacyCall(request);
  })

  nativeMessagingCall = ({method, url}) => new Promise((resolve, reject) => {
    browser.runtime.sendNativeMessage(
      "com.choosyosx.choosy.nativemessaging",
      {method, url},
      (response) => {
        if (!response) {
          reject(browser.runtime.lastError.message);
        } else if (response && !response.ok) {
          reject(response);
        } else {
          resolve();
        }
      }
    );
  })

  legacyCall = ({method, url, tab}) => browser.tabs.update(
    tab.id,
    {url: "x-choosy://" + method + "/" + url},
  )
};

const choosy = new Choosy();
const browser = window.browser || window.chrome;

browser.browserAction.onClicked.addListener((tab) => choosy.promptAll({tab}));

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "choosy-menu-item") {
    choosy.promptAll({url: info.linkUrl, tab});
  }
});

browser.runtime.onInstalled.addListener(() => browser.contextMenus.create({
  id: "choosy-menu-item",
  title: "Open with Choosy",
  contexts: ["link"]
}));
