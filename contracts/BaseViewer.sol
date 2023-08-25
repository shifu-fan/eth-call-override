// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./base.sol";

contract BaseViewer is BaseContract{

    error SetTestNumber(uint256 newNum, uint256 oldNum);

    function getNumber() external view returns(uint256) {
        return number;
    }

    function setTestNumber(uint256 n) external {
        uint256 old = number;
        number = n;
        revert SetTestNumber(n, old);
    } 
}