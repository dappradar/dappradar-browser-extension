import { Storage } from "@plasmohq/storage"
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;
const storage = new Storage()

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
chrome.cookies.onChanged.addListener((changeInfo) => {
    if (changeInfo.cookie.domain.includes("dappradar.com")) {
        console.log("Cookie changed on DappRadar")
        isLoggedIn();
    }
});
const isLoggedIn = async () => {
    const user = await storage.get("user");
    // const [jwt, setJwt] = useStorage<object>("jwt")
    console.log("is logged in running")
    chrome.cookies.get({ url: 'https://dappradar.com', name: 'jwt' }, (cookie) => {
        if (cookie) {
            const jwtToken = cookie.value;
            // Use the JWT token for authentication
            fetch(`https://auth.dappradar.com/apiv4/users/identify`, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(jwtToken)
                    console.log("Data", data)
                    if (data.status === "success") {
                        if (data.token !== user.token) {
                            storage.set("user", data)
                        }
                    }
                })
                .catch(error => {
                    console.error("Error fetching user info:", error);
                });
        } else {
            // Cookie not found or expired
            console.log("Cookie not found or expired")
            storage.set("user", null)
        }
    })
}

isLoggedIn();

export {}