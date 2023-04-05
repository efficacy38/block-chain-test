// SPDX-License-Identifier: CC-BY-SA-4.0

// Version of Solidity compiler this program was written for
pragma solidity ^0.8.4;

import {Faucet, Mortal} from "./Faucet.sol";

contract Token is Mortal {
    Faucet _faucet;

    constructor(address _f) {
        _faucet = Faucet(payable(_f));
        // transfer to current contract
        _faucet.withdraw(0.1 ether, address(this));
    }
}
