import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import WalletFactory from './contracts/WalletFactory.json';
import SmartWallet from './contracts/SmartWallet.json';

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [factoryContract, setFactoryContract] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const init = async () => {
            // Initialize Web3 instance
            const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
            setWeb3(web3);

            // Request user accounts
            const accounts = await web3.eth.requestAccounts();
            setAccounts(accounts);

            // Get the network ID and the deployed contract address
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = WalletFactory.networks[networkId];
            if (deployedNetwork) {
                const factoryInstance = new web3.eth.Contract(
                    WalletFactory.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setFactoryContract(factoryInstance);
            }
        };
        init();
    }, []);

    const createWallet = async () => {
        // Create a new wallet contract
        await factoryContract.methods.createWallet().send({ from: accounts[0] });
        // Get the wallet address associated with the current account
        const walletAddress = await factoryContract.methods.getWallet(accounts[0]).call();
        setWalletAddress(walletAddress);
        getBalance(walletAddress);
    };

    const getBalance = async (address) => {
        // Get the balance of the wallet contract
        const walletInstance = new web3.eth.Contract(SmartWallet.abi, address);
        const balance = await walletInstance.methods.getBalance().call();
        setBalance(web3.utils.fromWei(balance, 'ether'));
    };

    return (
        <div>
            <h1>Smart Contract Wallet</h1>
            <button onClick={createWallet}>Create Wallet</button>
            <div>
                <h2>Your Wallet</h2>
                <p>Address: {walletAddress}</p>
                <p>Balance: {balance} ETH</p>
            </div>
        </div>
    );
};

export default App;
