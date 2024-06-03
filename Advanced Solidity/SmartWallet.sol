// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartWallet {
    address public owner;

    event Deposit(address indexed sender, uint amount);
    event Transfer(address indexed to, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the wallet owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function sendFunds(address payable to, uint amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Transfer(to, amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
