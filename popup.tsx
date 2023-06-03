import React, { useEffect, useState } from 'react';
import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

function DappInfo({ appURL, apiKey }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const encodedURL = encodeURIComponent(appURL);
        fetch(`https://api.dappradar.com/xs3c89q0fi5chjwa/dapps/search?website=${encodedURL}`, {
            headers: {
                "X-BLOBR-KEY": apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data", data)
                setLoading(false);
                if (data.success) {
                    setStats(data.results[0]);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error("Error fetching dapp stats:", error);
            });
    }, [appURL]);

    if (!stats && loading) {
        return (
            <div className="flex flex-col place-content-center py-16">
                <h3 className="text-accent text-lg text-center"> 🔎 Looking for data</h3>
                <Loader />
            </div>
        )
    }

    if (!loading && stats) {
        return (
            <div>
                <Header
                    logo={stats.logo}
                    name={stats.name}
                    categories={stats.categories}
                    description={stats.description}
                    chains={stats.chains}
                />
                <DataStats dappId={stats.dappId} apiKey={apiKey} />
                <CallToAction name={stats.name} url={stats.link}/>
            </div>
        );
    }
    return <NothingFound />
}



function DataStats({ dappId, apiKey }) {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        fetch(`https://api.dappradar.com/xs3c89q0fi5chjwa/dapps/${dappId}`, {
            headers: {
                "X-BLOBR-KEY": apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setStats(data.results);
                }
            })
            .catch(error => {
                console.error("Error fetching dapp stats:", error);
            });
    }, [dappId]);

    if (!stats) {
        return "Something was wrong. Please try again in a new tab.";
    }

    return (
        <div className="py-2">
            <Stats stats={stats.metrics} name={stats.name} categories={stats.categories}/>
        </div>
    );
}


function IndexPopup() {
    const [appURL, setAppURL] = useState(null);
    const [apiKey] = useStorage<string>("apiKey")
    const [apiConnected] = useStorage<string>("apiKey")


    useEffect(() => {
        chrome.runtime.sendMessage({ action: "getCurrentAppURL" }, (response) => {
            if (response.currentAppURL) {
                setAppURL(response.currentAppURL);
            }
        });
    }, []);

    if (!appURL) {
        return <NotValidURL />;
    }

    return (
        <div>
            <Navbar user={user ? user.user : null}/>
            {apiConnected && <div className="container px-2">
                                <DappInfo appURL={appURL} apiKey={apiKey} />
                            </div>
            }
            {!apiConnected && <Onboarding />}
        </div>
    );
}


const Navbar = ({user}) => (

    <div className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="125px" height="20px" viewBox="0 0 126.676 20.376"
                     className="hide-on-mobile" fill="#ffffff">
                    <path
    d="M22.615 9.167L17.905 1a2.036 2.036 0 00-1.753-1H6.731a2.025 2.025 0 00-1.753 1.012L.268 9.176a2.043 2.043 0 000 2.024l4.71 8.164a2.015 2.015 0 001.753 1.012h9.42a2.025 2.025 0 001.753-1.012l4.71-8.164a2.059 2.059 0 00.001-2.033zm-11.174 8.025v-1.4a5.609 5.609 0 10-5.609-5.609 5.539 5.539 0 001.143 3.384l1.012-.986a4.16 4.16 0 01-.75-2.4 4.213 4.213 0 114.213 4.213v-1.4a2.809 2.809 0 10-2.817-2.809 2.765 2.765 0 00.375 1.4l1.047-1.021a1.343 1.343 0 01-.052-.375 1.439 1.439 0 111.439 1.439 1.3 1.3 0 01-.41-.07l-3.62 3.532a.56.56 0 01-.113.087c-.009.009-.026.009-.035.017a.407.407 0 01-.087.044c-.017.009-.035.009-.052.017l-.079.026a.111.111 0 00-.049.01c-.026 0-.052.009-.07.009-.026 0-.052-.009-.079-.009a.17.17 0 01-.061-.009l-.079-.026c-.017-.009-.035-.009-.052-.017a.354.354 0 01-.079-.044.191.191 0 01-.044-.026.5.5 0 01-.07-.061c-.009-.009-.026-.017-.035-.035a7.007 7.007 0 115.015 2.12zM28.285 3.62h4.309c4.169-.044 7.24 2.652 7.179 6.542.061 3.812-3.009 6.682-7.179 6.62h-4.309zm4.283 10.738c2.652 0 4.431-1.657 4.431-4.187 0-2.556-1.736-4.108-4.431-4.108h-1.6v8.3h1.6zM49.647 16.791H47.17v-.959a4.089 4.089 0 01-3.009 1.195c-2.093 0-3.411-1.221-3.411-2.948 0-1.779 1.439-2.87 3.733-2.87h2.477v-.436a1.613 1.613 0 00-1.83-1.736 3.372 3.372 0 00-2.617 1.361l-1.4-1.657a5.365 5.365 0 014.317-2.033 3.88 3.88 0 014.23 4.23v5.853zm-2.7-3.812h-2.106c-.881 0-1.378.34-1.378.994s.558 1.073 1.413 1.073a1.965 1.965 0 002.076-1.954zM57.383 17.027a3.947 3.947 0 01-2.957-1.195v4.544h-2.7V6.919h2.477v1.237a3.741 3.741 0 013.18-1.457 4.844 4.844 0 014.789 5.146 4.874 4.874 0 01-4.789 5.182zm-.5-7.894a2.462 2.462 0 00-2.495 2.713 2.477 2.477 0 002.495 2.73 2.551 2.551 0 002.556-2.713 2.537 2.537 0 00-2.553-2.73zM69.429 17.027a3.947 3.947 0 01-2.957-1.195v4.544h-2.7V6.919h2.485v1.237a3.741 3.741 0 013.172-1.457 4.844 4.844 0 014.789 5.146 4.874 4.874 0 01-4.789 5.182zm-.5-7.894a2.462 2.462 0 00-2.495 2.713 2.477 2.477 0 002.495 2.73 2.551 2.551 0 002.556-2.713 2.532 2.532 0 00-2.553-2.73zM84.014 16.791l-3.411-4.649h-1.971v4.649h-2.7V3.62h4.946c2.756 0 4.745 1.718 4.745 4.248a4.081 4.081 0 01-2.311 3.751l3.733 5.164h-3.031zm-5.39-7.021h2.253a1.811 1.811 0 002-1.893 1.825 1.825 0 00-2-1.875h-2.25zM96.094 16.791h-2.477v-.959a4.089 4.089 0 01-3.009 1.195c-2.093 0-3.411-1.221-3.411-2.948 0-1.779 1.439-2.87 3.733-2.87h2.477v-.436a1.613 1.613 0 00-1.832-1.736 3.372 3.372 0 00-2.617 1.361l-1.4-1.657a5.365 5.365 0 014.309-2.032 3.88 3.88 0 014.23 4.23v5.853zm-2.7-3.812h-2.111c-.881 0-1.378.34-1.378.994s.558 1.073 1.413 1.073a1.965 1.965 0 002.076-1.954zM108.062 1.823v14.959h-2.477v-1.221a3.741 3.741 0 01-3.175 1.457 4.849 4.849 0 01-4.789-5.164 4.849 4.849 0 014.789-5.164 3.842 3.842 0 012.957 1.178V1.823zm-5.146 7.31a2.551 2.551 0 00-2.556 2.713 2.532 2.532 0 002.556 2.73 2.462 2.462 0 002.495-2.713 2.486 2.486 0 00-2.495-2.73zM118.511 16.791h-2.477v-.959a4.089 4.089 0 01-3.009 1.195c-2.093 0-3.411-1.221-3.411-2.948 0-1.779 1.439-2.87 3.733-2.87h2.477v-.436a1.613 1.613 0 00-1.832-1.736 3.372 3.372 0 00-2.617 1.361l-1.4-1.657a5.365 5.365 0 014.309-2.032 3.88 3.88 0 014.23 4.23v5.853zm-2.687-3.812h-2.11c-.881 0-1.378.34-1.378.994s.558 1.073 1.413 1.073a1.965 1.965 0 002.076-1.954zM126.667 9.29h-.715a2.385 2.385 0 00-2.652 2.573v4.928h-2.7V6.917h2.477v1.178a3.412 3.412 0 012.713-1.3 2.723 2.723 0 01.881.122V9.29z"/>
                </svg>
            </div>
        </div>
        <div className="navbar-end">
            {!user && <a href="https://dappradar.com/auth" target="_blank" className="btn btn-xs">Login</a>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex="0" className="btn btn-ghost btn-circle p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                    </svg>
                </label>
                <ul tabIndex="0" className="dropdown-content menu p-0.5 mt-1 shadow bg-primary rounded-box w-52">
                    {user && <li><a><img alt="user" style={{"width": "20px"}} src={user.avatar} />{user.email}</a></li>}
                    <li><a onClick={() => chrome.runtime.openOptionsPage()}>Settings</a></li>
                    <li><a href="https://dappradar.com/developers" target="_blank">Contribute</a></li>
                    <li><a href="https://dappradar.com/api" target="_blank">DappRadar API</a></li>
                </ul>
            </div>
        </div>
    </div>
)

const Header = ({logo, name, categories, description, chains}) => (
    <div className="flex flex-row py-2">
        <div className="basis-1/3">
            <div className="avatar">
                <div className="w-20 rounded-full">
                    <img alt="dapp-logo" src={logo}/>
                </div>
            </div>
        </div>
        <div className="basis-2/3">
            <h2 className="text-xl">{name}</h2>
            <div className="meta">
                {categories && categories.map((category, index) =>
                    <div key={index} className="badge badge-primary badge-sm">{categoryMapping(category)}</div>
                )}
                <ChainBadges chains={chains}/>
            </div>
            <div className="desc text-xs">
                {description}
            </div>
        </div>
    </div>
)

const Stats = ({stats, name, categories}) => (
    <div>
        <div className="alert alert-success shadow-lg mt-1">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>This website belongs to {name}</span>
            </div>
        </div>
        {categories.length && categories.includes("high-risk") &&
        <div className="alert alert-warning shadow-lg mt-1 mb-3">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Be cautious: This is a high-risk dapp!</span>
            </div>
        </div>}
        <div className="stats shadow">
            <div className="stat place-items-center">
                <div className="stat-title">UAW (24h)</div>
                <div className="stat-value text-sm">{formatCompactNumber(stats.uaw)}</div>
                <div className="stat-desc">{stats.uawPercentageChange}%</div>
            </div>

            <div className="stat place-items-center">
                    <div className="stat-title">Volume (24h)</div>
                    <div className="stat-value text-sm">${formatCompactNumber(stats.volume)}</div>
                    <div className="stat-desc">{stats.volumePercentageChange}%</div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Txs (24h)</div>
                <div className="stat-value text-sm">{formatCompactNumber(stats.transactions)}</div>
                <div className="stat-desc">{stats.transactionsPercentageChange}%</div>
            </div>
        </div>
    </div>
)

const CallToAction = ({name, url}) => (
    <div className="card bg-neutral text-neutral-content mb-4">
        <div className="card-body items-center text-center p-3">
            <p>Discover more about {name}! Access smart contracts, in-depth stats, news, and more.</p>
            <div className="card-actions justify-center">
                <a href={url} target="_blank" className="btn btn-sm btn-primary normal-case">
                    Dive deeper into {name}
                </a>
            </div>
        </div>
    </div>
)

const ChainBadges = ({chains}) => (
    <div className="inline-block">
        {chains.slice(0, 2).map((chain, index) =>
            <div key={index} className="badge badge-secondary badge-outline badge-sm ml-0.5">{chainMapping(chain)}</div>
        )}
        {chains.length > 2 && <div className="badge badge-secondary badge-outline badge-sm ml-0.5">+{chains.length - 2} more</div>}
    </div>
);

const NothingFound = () => (
    <div className="card bg-neutral text-neutral-content my-2">
        <div className="card-body p-3">
            <h2 className="card-title">Dapp website not found</h2>
            <p>Couldn't find any information related to this website. If you're sure it's a dapp, we'd love to include it in our database! <br/> <br/>Help us grow our community by submitting this dapp or requesting an update for an existing one on DappRadar.  <br/> <br/>Every contribution counts</p>
            <div className="card-actions justify-start">
                <a href="https://dappradar.com/developers" target="_blank" className="btn btn-sm btn-block btn-primary normal-case">
                    List this dapp
                </a>
            </div>
        </div>
    </div>
)

function formatCompactNumber(number) {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
}

const Loader = () => (
    <div className="flex py-2 place-content-center">
        <svg width="45" height="45" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
            <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="2">
                    <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"/>
                    </path>
                </g>
            </g>
        </svg>
    </div>
);

const Onboarding = () => (
    <div className="card bg-neutral text-neutral-content m-2">
        <div className="card-body p-3">
            <h2 className="card-title">No API Key found</h2>
            <p>Set up your extension with the DappRadar API Key.</p>
            <div className="card-actions justify-start">
                <a onClick={() => chrome.runtime.openOptionsPage()} className="btn btn-sm btn-block btn-primary normal-case">
                    Go to Settings
                </a>
            </div>
        </div>
    </div>
);

const NotValidURL = () => (
    <div className="card bg-neutral text-neutral-content m-2">
        <div className="card-body p-3">
            <h2 className="card-title">No valid URL</h2>
            <p>The URL you're accessing right now is not valid or there is an error. Try again in a new tab.</p>
        </div>
    </div>
);

const categoryMapping = (category) => {
    switch (category) {
        case "defi":
            return "DeFi";
        case "high-risk":
            return "High-Risk";
        default:
            return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

const chainMapping = (chain) => {
    switch (chain) {
        case "binance-smart-chain":
            return "BNB Chain";
        case "tron":
            return "TRON";
        case "immutable-x":
            return "Immutable X";
        default:
            return chain.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}


export default IndexPopup
