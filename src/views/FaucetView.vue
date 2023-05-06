<template>
    <div class="container h-100">
        <div class="row justify-content-center align-items-start text-center pt-5">
            <h1 class="text-white fw-light lh-1 mb-5">JERRY'S FAUCET</h1>
            <div class="col-12 col-md-9 col-lg-7 card mycard border-0 shadow rounded-xs py-3">
                <div class="row">
                    <div class="col m-3 w-100 alert alert-primary" v-if="isTransactionRun">
                        {{ this.message }}
                    </div>
                    <div class="col m-3 w-100 alert alert-primary" v-if="isLoading">
                        Loading!!
                    </div>
                    <!-- FIXME: add the loading spainner -->
                </div>
                <div class="row justify-content-center">
                    <div class="col-9">
                        <input type="text" class="form-control item" placeholder="your wallet address" v-model="recipient"
                            @change="changeRecipientHandler" />
                    </div>
                    <div class="col-3">
                        <button type="button" class="btn btn-primary w-100" @click="withdrawHandler"
                            :disabled="isTransactionRun">
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
                            <tr v-for="transation in formatedTransations" :key="transation.transactionHash">
                                <td>
                                    <a class="text-nowrap"
                                        :href="`https://sepolia.etherscan.io/tx/${transation.transactionHash}`"
                                        target="_blank">{{ transation.transactionHash }}</a>
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
    table-layout: fixed;
    /* 表格和欄寬將根據所給定的寬度來顯示*/
    min-width: 100px;
}

thead th:first-child,
tbody td:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 160px);
    padding-right: 0;
    padding-left: 0;
}

tbody td:first-child {
    color: var(--bs-link-color);
    text-decoration: underline;
    border-bottom: 1px solid transparent;
}

thead th:nth-child(2),
tbody td:nth-child(2) {
    width: 160px;
    /* 10 words width(16px each word) */
}
</style>

<script>
import Web3 from "web3";
import moment from "moment";
import {
    init,
    withdraw,
    getWithdrawal,
    subscribeWithdrawal,
    unSubscribeWithdrawal,
} from "../web3Provider.js";

export default {
    data() {
        return {
            message: "",
            transactions: [],
            formatedTransations: [],
            recipient: "",
            isLoading: false,
            isTransactionRun: false,
            withdrawalListener: null,
        };
    },

    mounted() {
        init();
        window.setInterval(this.formatTransations, 1000);
    },

    unmounted() {
        window.clearInterval(this.formatTransations);
    },

    methods: {
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

        async withdrawHandler() {
            const amount = "0.01";
            this.isTransactionRun = true;
            withdraw(amount, this.recipient, {
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
            if (this.withdrawalListener)
                unSubscribeWithdrawal(this.withdrawalListener);

            this.isLoading = true;
            await getWithdrawal(this.recipient)
                .then((events) => (this.transactions = events))
                .catch((err) => {
                    console.error(err);
                });

            this.formatTransations();
            this.isLoading = false;

            // subscribe the withdraw event
            this.withdrawalListener = subscribeWithdrawal(this.recipient, {
                onData: function (event) {
                    this.transactions.push(event);
                }.bind(this),
            });
        },
    },
};
</script>

