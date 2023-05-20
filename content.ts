import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://etherscan.io/address/*"]
}

const API_ENDPOINT = 'https://api.dappradar.com/xs3c89q0fi5chjwa/dapps/smart-contract/';
const API_KEY = 'azpexrC4SFHKq2JuWVEb7BvxZIdU2P1u';
const headers = {
    'Content-Type': 'application/json',
    'X-BLOBR-KEY': API_KEY
}

window.addEventListener("load", () => {
    run();
    async function run() {
        let url = window.location.href;
        let matches = window.location.href.match(/0x[a-fA-F0-9]{40}/i);
        let address = matches[0];
        let dapp = 'Not listed';

        console.log(matches);
        if (address.length === 42) {
            let response = await fetch(API_ENDPOINT + address, {headers});
            let data = await response.json();

            if (data.success && data.resultCount > 0) {
                let dappData = data.results[0];
                dapp = `<img alt="logo" src="${dappData.logo}" style="border-radius:50%" width="20" /> <a class="" target="_blank" href="${dappData.link}">${dappData.name}</a>`;
            }
        }

        let headings = Array.from(document.querySelectorAll('h3'));
        let targetHeading = headings.find(heading => heading.textContent.includes("More Info"));
        let cardBody = targetHeading.parentElement;
        let html = '';
        html += '<div id="ContentPlaceHolder1_tr_tokeninfo">';
        html += '<h4 class="text-cap mb-1">';'';
        html += '<span class="d-md-none d-lg-inline-block me-1">Listed on <a href="https://dappradar.com" target="_blank">DappRadar</a> <i class="fas fa-check-circle text-primary position-absolute" style="margin-left:5px"></i></span></h4>';
        html += '<div class="d-flex align-items-center gap-1 mt-2">';
        html += '<span id="dapp">' + dapp + '</span>';
        html += '</div>';
        html += '</div>';

        cardBody.insertAdjacentHTML('beforeend', html);
    }
})