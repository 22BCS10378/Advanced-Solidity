// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SmartWallet.sol";

contract WalletFactory {
    event WalletCreated(address indexed owner, address walletAddress);

    mapping(address => address) public wallets;

    function createWallet() public {
        require(wallets[msg.sender] == address(0), "Wallet already exists for this address");
        SmartWallet wallet = new SmartWallet(msg.sender);
        wallets[msg.sender] = address(wallet);
        emit WalletCreated(msg.sender, address(wallet));
    }

    function getWallet(address owner) public view returns (address) {
        return wallets[owner];
    }
}
