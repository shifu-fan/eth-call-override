// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./base.sol";

contract BaseViewer is BaseContract{

    function getNumber() external view returns(uint256) {
        return number;
    }
}