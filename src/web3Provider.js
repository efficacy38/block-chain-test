import Web3 from "web3";
import FaucetBuild from "./../truffle/build/contracts/Faucet.json";
import JHTokenDexBuild from "./../truffle/build/contracts/JHTokenDEX.json";
import JHTokenBuild from "./../truffle/build/contracts/JHToken.json";
import BlackJackBuild from "./../truffle/build/contracts/BlackJack.json";
import { GAME_STATUS } from "./variables.js";

let isInitialize = false;
let FaucetContract, JHTokenDexContract, JHTokenContract, BlackJackContract;
let web3, selectAccount;
let JHTokenAddress, JHTokenDexAddress, BlackJackAddress;

export {
    web3,
    FaucetContract,
    selectAccount,
    JHTokenAddress,
    JHTokenDexAddress,
};

// get the token's balance
export const getBalance = async (address) => {
    return web3.eth.getBalance(address);
};

export const getJHTBalance = async (address) => {
    let balance = await JHTokenContract.methods.balanceOf(address).call();
    return balance;
};

export const getAllowance = async (owner) => {
    return JHTokenContract.methods.allowance(owner, JHTokenDexAddress).call();
};

export const getDexBalance = async () => {
    const networkId = await web3.eth.net.getId();

    return getBalance(JHTokenDexBuild.networks[networkId].address);
};

export const getDexJHTBalance = async () => {
    const networkId = await web3.eth.net.getId();

    return getJHTBalance(JHTokenDexBuild.networks[networkId].address);
};

export const getAddress = async (contractBuild) => {
    const networkId = await web3.eth.net.getId();
    return getJHTBalance(contractBuild.networks[networkId].address);
};

// init the web3 provider
export const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== "undefined") {
        // MetaMask is installed

        await provider
            .request({ method: "eth_requestAccounts" })
            .then((accounts) => {
                selectAccount = accounts[0];
                console.log(`current account is ${selectAccount}`);
            })
            .catch((err) => {
                console.error(err);
                return;
            });

        window.ethereum.on("accountsChanged", function(accounts) {
            selectAccount = accounts[0];
            console.log(`current account changed to ${selectAccount}`);
        });

        // instance the web3 client
        web3 = new Web3();
        web3.setProvider(provider);

        const networkId = await web3.eth.net.getId();
        FaucetContract = new web3.eth.Contract(
            FaucetBuild.abi,
            FaucetBuild.networks[networkId].address
        );

        JHTokenContract = new web3.eth.Contract(
            JHTokenBuild.abi,
            JHTokenBuild.networks[networkId].address
        );

        JHTokenDexContract = new web3.eth.Contract(
            JHTokenDexBuild.abi,
            JHTokenDexBuild.networks[networkId].address
        );

        BlackJackContract = new web3.eth.Contract(
            BlackJackBuild.abi,
            BlackJackBuild.networks[networkId].address
        );

        JHTokenAddress = JHTokenBuild.networks[networkId].address;
        JHTokenDexAddress = JHTokenDexBuild.networks[networkId].address;
        BlackJackAddress = BlackJackBuild.networks[networkId].address;
        isInitialize = true;
        return true;
    } else {
        return false;
    }
};

export const withdraw = async (amount, address, callbacks = {}) => {
    const { onSent, onReceipt, onConfirmation, onError } = callbacks;

    // can't direct return promiEvent via async function(it would return Promise directly),
    // this would be fixed at web3.js 2.0
    // https://github.com/web3/web3.js/issues/1547
    const contract = FaucetContract.methods
        .withdraw(Web3.utils.toWei(amount, "ether"), address)
        .send({ from: selectAccount });

    if (onSent) contract.once("sent", onSent);
    if (onReceipt) contract.once("receipt", onReceipt);
    if (onConfirmation) contract.once("confirmation", onConfirmation);
    if (onError) contract.once("error", onError);

    return contract;
};

export const getWithdrawal = async (address) => {
    // console.log(FaucetContract.getPastEvent('Withdrawal'))
    if (!Web3.utils.isAddress(address)) return;

    // console.log(Web3.utils.padLeft(this.recipient, 64));
    return FaucetContract.getPastEvents("Withdrawal", {
        fromBlock: 0,
        // filter: {to: this.recipient},
        toBlock: "latest",
        topics: [
            Web3.utils.sha3("Withdrawal(address,uint256,uint256)"),
            Web3.utils.padLeft(address, 64),
        ],
    });
};

export const subscribeWithdrawal = (address, callbacks = {}) => {
    const { onData, onChanged, onError } = callbacks;
    let currentBlockNum;
    web3.eth.getBlockNumber().then((n) => (currentBlockNum = n + 1));

    self = this;
    let subscription = FaucetContract.events.Withdrawal({
        topics: [
            Web3.utils.sha3("Withdrawal(address,uint256,uint256)"),
            Web3.utils.padLeft(address, 64),
        ],

        fromBlock: currentBlockNum,
    });

    if (onData) subscription.on("data", onData);
    if (onChanged) subscription.on("changed", onChanged);
    if (onError) subscription.on("error", onError);

    return subscription;
};

export const unSubscribeWithdrawal = (subsciption) => {
    subsciption.off("data");
    subsciption.off("error");
    subsciption.off("changed");
};

// exchange the coins
export const buyJHT = async (amount) => {
    return JHTokenDexContract.methods
        .buy()
        .send({ value: web3.utils.toWei(amount, "ether"), from: selectAccount });
};

export const approveJHT = async (amount) => {
    const networkId = await web3.eth.net.getId();

    return JHTokenContract.methods
        .approve(
            JHTokenDexBuild.networks[networkId].address,
            web3.utils.toWei(amount, "ether")
        )
        .send({ from: selectAccount });
};

export const sellJHT = async (amount) => {
    return JHTokenDexContract.methods
        .sell(web3.utils.toWei(amount, "ether"))
        .send({ from: selectAccount });
};

// game area
export let cnt = 0;
const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// game logic
export async function startNewGame(callback) {
    const networkId = await web3.eth.net.getId();
    callback("info", "0 / 2 - setting the allowance(2 JHT)");
    return JHTokenContract.methods
        .approve(
            BlackJackBuild.networks[networkId].address,
            web3.utils.toWei("2", "ether")
        )
        .send({ from: selectAccount })
        .then(async () => {
            let allowance = await JHTokenContract.methods
                .allowance(selectAccount, BlackJackAddress)
                .call();
            if (allowance < Web3.utils.toWei("2", "ether")) {
                throw new Error(
                    "not enough allowance, click use default(or set allowance to 2)"
                );
            }
        })
        .then(async () => {
            callback("info", "1 / 2 - allowance setting properly");
        })
        .then(() => {
            callback("info", "2 / 2 - lock your token(transfer to Game Contract)");
            return BlackJackContract.methods.play().send({ from: selectAccount });
        })
        .then(() => {
            callback("", "");
            return true;
        })
        .catch((err) => {
            console.log(err);
            callback("danger", err.message);
            return false;
        });
}

export async function getRoundStatus() {
    if (cnt === 0) return GAME_STATUS.UNDETERMINED;
}

export async function getPlayerCards() {
    return BlackJackContract.methods
        .getPlayerCards()
        .call()
        .then((rawCard) =>
            rawCard.map((card) => ({
                suit: card[0],
                value: card[1],
                isFaceDown: card[2],
            }))
        );
}

export async function getDealerCards() {
    return BlackJackContract.methods
        .getDealerCards()
        .call()
        .then((rawCard) =>
            rawCard.map((card) => ({
                suit: card[0],
                value: card[1],
                isFaceDown: card[2],
            }))
        );
}

// start the black jack
export async function start() {
    return;
}

export async function hit() {
    await BlackJackContract.methods.hit().send({ from: selectAccount });
}
export async function doubleDown() {
    await BlackJackContract.methods.doubleDown().send({ from: selectAccount });
}
export async function stand() {
    await BlackJackContract.methods.stand().send({ from: selectAccount });
}

export const subscribeRoundStatus = async (callbacks = {}) => {
    let currentBlockNum = await web3.eth.getBlockNumber().then((n) => n + 1);
    const { onData, onChanged, onError } = callbacks;

    let subscription = web3.eth.subscribe("logs", {
        topics: [Web3.utils.sha3("status(uint256,uint256,string)")],
        fromBlock: "0",
        toBlock: "latest",
    });

    if (onData) subscription.on("data", onData);
    if (onChanged) subscription.on("changed", onChanged);
    if (onError) subscription.on("error", onError);

    return subscription;
};

export const unSubscribeRoundStatus = (subsciption) => {
    subsciption.off("data");
};

export const addTokenToWallet = async () => {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20", // Initially only supports ERC20, but eventually more!
                options: {
                    address: JHTokenAddress, // The address that the token is at.
                    symbol: "JHT", // A ticker symbol or shorthand, up to 5 chars.
                    decimals: 18, // The number of decimals in the token
                },
            },
        });

        if (wasAdded) {
            console.log("Thanks for your interest!");
        } else {
            console.log("Your loss!");
        }
    } catch (error) {
        console.log(error);
    }
};
