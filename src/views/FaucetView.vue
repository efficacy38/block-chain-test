<template>
    <div class="container h-100">
        <div
            class="row justify-content-center align-items-start text-center pt-5"
        >
            <h1 class="text-white fw-light lh-1 mb-5">JERRY'S FAUCET</h1>
            <div
                class="col-12 col-md-9 col-lg-7 card mycard border-0 shadow rounded-xs py-3"
            >
                <div class="row">
                    <div
                        class="col m-3 w-100 alert alert-primary"
                        v-if="isTransactionRun"
                    >
                        {{ this.message }}
                    </div>
                    <div
                        class="col m-3 w-100 alert alert-primary"
                        v-if="isLoading"
                    >
                        Loading!!
                    </div>
                    <!-- FIXME: add the loading spainner -->
                </div>
                <div class="row justify-content-center">
                    <div class="col-9">
                        <input
                            type="text"
                            class="form-control item"
                            placeholder="your wallet address"
                            v-model="recipient"
                            @change="changeRecipientHandler"
                        />
                    </div>
                    <div class="col-3">
                        <button
                            type="button"
                            class="btn btn-primary w-100"
                            @click="withdarwHandler"
                            :disabled="isTransactionRun"
                        >
                            Send the Eth
                        </button>
                    </div>
                </div>
                <hr />
                <h3>Your transactions</h3>
                <div class="overflow-auto">
                    <table class="table text-start">
                        <thead class="sticky-top top-0 bg-white">
                            <tr>
                                <th scope="col">transation</th>
                                <th scope="col">time</th>
                            </tr>
                        </thead>
                        <tbody v-if="!isLoading">
                            <tr
                                v-for="transation in formatedTransations"
                                :key="transation.transactionHash"
                            >
                                <td>
                                    <a
                                        class="text-nowrap"
                                        :href="`https://sepolia.etherscan.io/tx/${transation.transactionHash}`"
                                        target="_blank"
                                        >{{ transation.transactionHash }}</a
                                    >
                                </td>
                                <td class="text-nowrap">
                                    {{ transation.date }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mycard {
    max-height: 40rem;
}

.table {
    table-layout: fixed; /* 表格和欄寬將根據所給定的寬度來顯示*/
    min-width: 100px;
}

thead th:first-child,
tbody td:first-child {
    overflow: hidden;
    width: calc(100% - 160px);
    padding-right: 0;
    padding-left: 0;
}

thead th:nth-child(2),
tbody td:nth-child(2) {
    width: 160px; /* 10 words width(16px each word) */
}
</style>

<script>
import Web3 from "web3";
import FaucetBuild from "./../../truffle/build/contracts/Faucet.json";
import moment from "moment";

export default {
    data() {
        return {
            // FIXME: Provider URL is not worked right now
            web3: null,
            accounts: [],
            FaucetContract: null,
            message: "",
            transactions: [],
            formatedTransations: [],
            recipient: "",
            isLoading: false,
            isTransactionRun: false,
        };
    },

    mounted() {
        this.connect();
        window.setInterval(this.formatTransations, 1000);
    },

    unmounted() {
        window.clearInterval(this.formatTransations);
    },

    methods: {
        async connect() {
            let provider = window.ethereum;

            if (typeof provider !== "undefined") {
                // MetaMask is installed

                await provider
                    .request({ method: "eth_requestAccounts" })
                    .then((accounts) => {
                        this.accounts = accounts;
                        console.log(`current account is ${this.accounts[0]}`);
                    })
                    .catch((err) => {
                        console.error(err);
                        return;
                    });

                window.ethereum.on("accountsChanged", function (accounts) {
                    this.accounts = accounts;
                    console.log(
                        `current account changed to ${this.accounts[0]}`
                    );
                });
            }

            // FIXME: current only support metamask provider
            this.web3 = new Web3();
            this.web3.setProvider(provider);
        },

        async getBalance(address) {
            return this.web3.eth.getBalance(address);
        },

        formatTransations() {
            if (this.transactions) {
                this.formatedTransations = this.transactions
                    .map((event) => ({
                        transactionHash: event.transactionHash,
                        date: new Date(event.returnValues.timestamp * 1000),
                    }))
                    .map((trans) => {
                        return {
                            ...trans,
                            date: moment(trans.date).fromNow(),
                        };
                    })
                    .reverse();
            }
        },

        async withdraw(amount, address, callbacks = {}) {
            const networkId = await this.web3.eth.net.getId();
            const FaucetContract = new this.web3.eth.Contract(
                FaucetBuild.abi,
                FaucetBuild.networks[networkId].address
            );

            const { onSent, onReceipt, onConfirmation, onError } = callbacks;

            // can't direct return promiEvent via async function(it would return Promise directly),
            // this would be fixed at web3.js 2.0
            // https://github.com/web3/web3.js/issues/1547
            const contract = FaucetContract.methods
                .withdraw(Web3.utils.toWei(amount, "ether"), address)
                .send({ from: this.accounts[0] });

            if (onSent) contract.once("sent", onSent);
            if (onReceipt) contract.once("receipt", onReceipt);
            if (onConfirmation) contract.once("confirmation", onConfirmation);
            if (onError) contract.once("error", onError);

            return contract;
        },

        async withdarwHandler() {
            const amount = "0.01";
            this.isTransactionRun = true;
            this.withdraw(amount, this.recipient, {
                onSent: () => {
                    this.message = "send this contract";
                },
                onReceipt: () => {
                    this.message = "get the receipt, wait for confirmation";
                },
                onConfirmation: (times) => {
                    this.message = `get ${times} confirmation`;
                    this.isTransactionRun = false;
                },
                onError: (err) => {
                    this.message = err;
                    this.isTransactionRun = false;
                },
            }).catch((err) => {
                console.error(err);
                this.isTransactionRun = false;
            });
        },

        async changeRecipientHandler() {
            if (!Web3.utils.isAddress(this.recipient)) return;

            this.isLoading = true;
            await this.getWithdrawal(this.recipient)
                .then((events) => (this.transactions = events))
                .catch((err) => {
                    console.error(err);
                })
                .finally((events) => {
                    console.log(events);
                });

            this.formatTransations();
            this.isLoading = false;

            // subscribe the withdraw event
            this.subscribeWithdrawal(this.recipient);
        },

        async subscribeWithdrawal(address) {
            const networkId = await this.web3.eth.net.getId();
            // FaucetContract.clearSubscriptions();

            const FaucetContract = new this.web3.eth.Contract(
                FaucetBuild.abi,
                FaucetBuild.networks[networkId].address
            );

            self = this;
            return FaucetContract.events
                .Withdrawal({
                    address: FaucetBuild.networks[networkId].address,
                    topics: [
                        Web3.utils.sha3("Withdrawal(address,uint256,uint256)"),
                        Web3.utils.padLeft(address, 64),
                    ],

                    fromBlock: await this.web3.eth.getBlockNumber(),
                })
                .on("connected", function (subscriptionId) {
                    // console.log(subscriptionId);
                    // console.log("connected")
                })
                .on("data", function (event) {
                    // console.log(event); // same results as the optional callback above
                    // console.log("data", event);
                    self.transactions.push(event);
                })
                .on("changed", function (event) {
                    // remove event from local database
                    console.log("changed");
                })
                .on("error", function (error, receipt) {
                    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    // console.log(error, receipt); // same results as the optional callback above
                    console.log("error");
                });
        },

        async getWithdrawal(address) {
            const networkId = await this.web3.eth.net.getId();
            const FaucetContract = new this.web3.eth.Contract(
                FaucetBuild.abi,
                FaucetBuild.networks[networkId].address
            );
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
        },
    },
};
</script>

