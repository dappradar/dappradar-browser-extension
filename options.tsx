import { useEffect, useState } from 'react';
import { useStorage } from "@plasmohq/storage/hook"
import coverImage from "data-url:./assets/cover-ext.jpeg"

import "./style.css"

function IndexOptions() {
    const [apiConnected, setApiConnected] = useStorage<string>("apiConnected")
    const [apiKey, setApiKey] = useStorage<string>("apiKey")
    const [inputKey, setInputKey] = useState('');

    useEffect(() => {
        setInputKey(apiKey || '');
    }, [apiKey]);

    const checkApiKey = async () => {
        try {
            let response = await fetch(`https://api.dappradar.com/xs3c89q0fi5chjwa/dapps/9495`, {
                headers: {
                    "X-BLOBR-KEY": inputKey
                }
            });
            let data = await response.json();

            if (data.success) {
                setApiKey(inputKey);
                setApiConnected(true);
            } else {
                setApiConnected(false);
                setApiKey(false);
            }
        } catch (error) {
            setApiConnected(false);
            setApiKey(false);
            console.error("Error fetching dapp stats:", error);
        }
    }

    const updateApiKey = (e) => {
        setInputKey(e.target.value);
    }

    return (
        <div className="h-screen w-screen flex flex-col place-items-center place-content-center">
            <div className="card card-compact min-w-min w-96 bg-primary-content/10 shadow-xl">
                <figure><img src={coverImage} alt="DappRadar" /></figure>
                <div className="card-body">
                    <h2 className="card-title">Settings</h2>
                    <p>You need a DappRadar API key to use this extension</p>
                    <p>
                        {apiConnected && `✅ Connected to the API`}
                        {!apiConnected && `❌ Not connected to the API`}
                    </p>
                    <div className="card-actions">
                        <input type="text"
                               value={inputKey}
                               onChange={updateApiKey}
                               placeholder="DappRadar API Key"
                               className="input input-bordered w-full max-w-xs"
                        />
                        <button onClick={checkApiKey} className="btn btn-primary btn-md">Save</button>
                        <a href="https://dappradar.com/api" target="_blank" className="btn btn-md btn-outline">GET AN API KEY</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndexOptions
