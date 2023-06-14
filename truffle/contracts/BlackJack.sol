// SPDX-License-Identifier: MIT
import "./JHToken.sol";

pragma solidity ^0.8.7;

contract BlackJack {
    struct Game {
        uint256 round;
        uint256 step;
        string status;
        bool isDouble;
    }

    struct Card {
        string suit;
        uint256 num;
        bool isHidden;
    }

    uint256 initialNumber = 75248912;
    Card[] PlayerHand;
    Card[] DealerHand;
    Game game;
    JHToken public JHTokenStore;
    string[4] suit = ["S", "H", "D", "C"];

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

    function releaseEstate() internal {
        if (game.isDouble) {
            JHTokenStore.transfer(msg.sender, 4e18);
        } else {
            JHTokenStore.transfer(msg.sender, 3e18);
        }
    }

    function returnTenToken(address target) public {
        JHTokenStore.transfer(target, 1e19);
    }

    function play() external {
        //初始化
        lockEstate();

        //initialize
        game = Game(0, 0, "undeterminted", false);
        delete DealerHand;
        delete PlayerHand;
        //deal
        dealCard(false, false);
        dealCard(false, false);
        dealCard(true, true);
        dealCard(true, false);

        //check blackjack or not
        if (PointOf(DealerHand) == 21) {
            game.status = "lose";
        } else if (PointOf(PlayerHand) == 21) {
            game.status = "win";
            releaseEstate();
        }

        emit status(game.round, game.step, game.status);
    }

    function dealCard(bool isDealer, bool faceup) public {
        uint256 tmp = uint256(keccak256(abi.encodePacked(initialNumber++))) %
            52;
        if (isDealer) {
            DealerHand.push(Card(suit[tmp / 13], tmp % 13, faceup));
        } else {
            PlayerHand.push(Card(suit[tmp / 13], tmp % 13, faceup));
        }
    }

    function hit() public {
        dealCard(false, false);
        determint();
        //emit status(game.round, game.step, game.status);

        emit status(game.round, game.step, game.status);
        game.step++;
    }

    function stand() public {
        dealermove();
        score();

        emit status(game.round, game.step, game.status);
    }

    function doubleDown() public {
        game.isDouble = true;
        dealCard(false, false);
        score();
        emit status(game.round, game.step, game.status);
    }

    function flipDealerCard() internal {
        DealerHand[0].isHidden = false;
    }

    function determint() internal {
        uint256 playerpoint = PointOf(PlayerHand);
        uint256 dealerpoint = PointOf(DealerHand);
        if (playerpoint == 0) {
            game.status = "lose";
        } else if (dealerpoint == 0) {
            game.status = "win";
            releaseEstate();
        }
    }

    function dealermove() internal {
        uint256 tmpP = PointOf(DealerHand);
        while (tmpP < 17 && !(tmpP == 0)) {
            dealCard(true, false);
            tmpP = PointOf(DealerHand);
        }
    }

    function score() public {
        uint256 DealerPoint = PointOf(DealerHand);
        uint256 PlayerPoint = PointOf(PlayerHand);
        if (PlayerPoint > DealerPoint) {
            game.status = "win";
            flipDealerCard();
            releaseEstate();
        } else {
            game.status = "lose";
            flipDealerCard();
        }
    }

    function PointOf(Card[] storage Hand) internal view returns (uint256) {
        uint256 A = 0;
        uint256 point = 0;
        for (uint256 i = 0; i < Hand.length; i++) {
            if (Hand[i].num == 0) //這張是A
            {
                A++;
                point += 11;
            } else if (Hand[i].num >= 9) //這張10分
            {
                point += 10;
            } else {
                point += (Hand[i].num + 1); //數字多少就+幾分
            }
        }
        while (
            point > 21 && A > 0 //分數超過21，有A的話要適當的當成1分
        ) {
            if (A > 0) {
                A--;
                point -= 10;
            }
        }
        if (point > 21) return 0;
        return point;
    }

    function getPlayerCards() public view returns (Card[] memory) {
        return PlayerHand;
    }

    function getDealerCards() public view returns (Card[] memory) {
        return DealerHand;
    }
}
