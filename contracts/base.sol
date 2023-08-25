// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BaseContract {
    uint256 public number;

    constructor() {
        number = 9527;
    }

    function setNumber(uint256 n) external {
        number = n;
    }
}