import Web3 from "web3";
import FaucetBuild from "./../truffle/build/contracts/Faucet.json";

let isInitialize = false;
let FaucetContract;
let web3, selectAccount;

export {web3, FaucetContract};
export const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== "undefined") {
        // MetaMask is installed

        await provider
            .request({method: "eth_requestAccounts"})
            .then((accounts) => {
                selectAccount = accounts[0];
                console.log(`current account is ${selectAccount}`);
            })
            .catch((err) => {
                console.error(err);
                return;
            });

        window.ethereum.on("accountsChanged", function (accounts) {
            selectAccount = accounts[0];
            console.log(
                `current account changed to ${selectAccount}`
            );
        });

        // instance the web3 client
        web3 = new Web3();
        web3.setProvider(provider);

        const networkId = await web3.eth.net.getId();
        FaucetContract = new web3.eth.Contract(
            FaucetBuild.abi,
            FaucetBuild.networks[networkId].address
        );

        isInitialize = true;
    }
}

export const getBalance = async (address) => {
    return web3.eth.getBalance(address);
}

export const withdraw = async (amount, address, callbacks = {}) => {
    if (!isInitialize || !Web3.utils.isAddress(address))
        return;

    const {onSent, onReceipt, onConfirmation, onError} = callbacks;

    // can't direct return promiEvent via async function(it would return Promise directly),
    // this would be fixed at web3.js 2.0
    // https://github.com/web3/web3.js/issues/1547
    const contract = FaucetContract.methods
        .withdraw(Web3.utils.toWei(amount, "ether"), address)
        .send({from: selectAccount});

    if (onSent) contract.once("sent", onSent);
    if (onReceipt) contract.once("receipt", onReceipt);
    if (onConfirmation) contract.once("confirmation", onConfirmation);
    if (onError) contract.once("error", onError);

    return contract;
}

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
}

export const subscribeWithdrawal = (address, callbacks = {}) => {

    const {onData, onChanged, onError} = callbacks;
    let currentBlockNum;
    web3.eth.getBlockNumber().then(n => currentBlockNum = n + 1);

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
}

export const unSubscribeWithdrawal = (subsciption) => {
    subsciption.off("data")
    subsciption.off("error")
    subsciption.off("changed")
}
