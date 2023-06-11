// SPDX-License-Identifier: MIT
import "./JHToken.sol";

pragma solidity ^0.8.7;

contract BlackJack {
    uint256[52] deck;
    uint256[] PlayerHand;
    uint256[] DealerHand;

    struct Game {
        uint256 round;
        uint256 step;
        string status;
        uint256 testCnt;
    }

    Game game;
    JHToken public JHTokenStore;

    event status(uint256 round, uint256 step, string status);

    constructor(address JHTokenDEXAddress) {
        JHTokenStore = JHToken(JHTokenDEXAddress);
    }

    function lockEstate() public {
        // check ether is enough
        uint256 allowance = JHTokenStore.allowance(msg.sender, address(this));
        require(
            allowance >= 2,
            "You need to set 2 token to allowance at least"
        );
        JHTokenStore.transferFrom(msg.sender, address(this), 2e18);
    }

    function releaseEstate(uint256 amount) internal {
        JHTokenStore.transfer(msg.sender, amount);
    }

    function returnTenToken(address target) public {
        JHTokenStore.transfer(target, 1e19);
    }

    function play() external {
        //初始化
        lockEstate();

        game = Game(0, 0, "undeterminted", 0);
        emit status(game.round, game.step, "undeterminted");
    }

    function fakeEnd() internal {
        emit status(game.round, game.step, "win");
        game.round++;
    }

    function deal() internal {}

    function hit() public {
        game.testCnt++;
        if (game.testCnt == 1) {
            fakeEnd();
        }
    }

    function stand() public {
        game.testCnt++;
        if (game.testCnt == 3) {
            fakeEnd();
        }
    }

    function doubleDown() public {
        game.testCnt++;
        if (game.testCnt == 4) {
            fakeEnd();
        }
    }

    // function PointOf(uint256[] storage Hand) internal view returns (uint256) {
    //     uint256 A = 0;
    //     uint256 point = 0;
    //     for (uint256 i = 0; i < Hand.length; i++) {
    //         if (Hand[i] % 13 == 1)
    //             //這張是A
    //             A++;
    //         point += 11;
    //         if (Hand[i] % 13 >= 9)
    //             //這張10分
    //             point += 10;
    //         else point += ((Hand[i] % 13) + 1); //數字多少就+幾分
    //     }
    //     while (
    //         point > 21 //分數超過21，有A的話要適當的當成1分
    //     ) {
    //         if (A > 0) {
    //             A--;
    //             point -= 10;
    //         }
    //     }
    //     if (point > 21) return 0;
    //     return point;
    // }
}

contract blackJack is Mortal {
    // uint256 exchangeRate = 10;

    receive() external payable {}
}
