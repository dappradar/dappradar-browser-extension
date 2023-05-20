export {}

console.log("Hello from background script!")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCurrentAppURL") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const url = new URL(tabs[0].url);
                sendResponse({ currentAppURL: url.origin });
            } else {
                sendResponse({ currentAppURL: null });
            }
        });
        return true; // Required to use sendResponse asynchronously.
    }
});

