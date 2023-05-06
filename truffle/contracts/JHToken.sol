// contracts/JHToken.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./Faucet.sol";

contract JHToken is ERC20Burnable, Mortal {
    // generate the initial
    constructor() ERC20("JHToken", "JHT") {
        _mint(msg.sender, 700 * (10**decimals()));
    }

    function mint(uint256 mint_amount, address recipiant) public onlyOwner {
        _mint(payable(recipiant), mint_amount);
    }
}

contract JHTokenDEX is Mortal {
    // uint256 exchangeRate = 10;
    JHToken public JHTokenStore;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor(address JHTokenDEXAddress) {
        JHTokenStore = JHToken(JHTokenDEXAddress);
    }

    function buy() public payable {
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = JHTokenStore.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        JHTokenStore.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function approveToSell(uint256 amount) public {
        JHTokenStore.approve(address(this), amount);
        // emit approve to sell
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = JHTokenStore.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        JHTokenStore.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    receive() external payable {}
}
