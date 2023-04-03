<template>
    <div class="container h-100">
        <div
            class="row justify-content-center align-items-start text-center pt-5"
        >
            <h1 class="text-white fw-light lh-1 mb-5">JERRY'S FAUCET</h1>
            <div class="col-7 card border-0 shadow rounded-xs py-3">
                <div class="row">
                    <div
                        class="col m-3 w-100 alert alert-primary"
                        v-if="message"
                    >
                        {{ this.message }}
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-9">
                        <input
                            type="text"
                            class="form-control item"
                            placeholder="your wallet address"
                            v-model="recipient"
                        />
                    </div>
                    <div class="col-3">
                        <button
                            type="button"
                            class="btn btn-primary w-100"
                            @click="withdarwHandler"
                        >
                            Send the Eth
                        </button>
                    </div>
                </div>
                <hr />
                <div>
                    <h3>Your transations</h3>
                    <table class="table text-start">
                        <thead>
                            <tr>
                                <th scope="col" class="col-10">transation</th>
                                <th scope="col" class="col-2">time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="transation in formatedTransations"
                                :key="transation.blockHash"
                            >
                                <th scope="row">
                                    <a
                                        :href="`https://sepolia.etherscan.io/tx/${transation.blockHash}`"
                                        target="_blank"
                                        >{{ transation.blockHash }}</a
                                    >
                                </th>
                                <td>
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

<script>
import Web3 from "web3";
import FaucetBuild from "./../../truffle/build/contracts/Faucet.json";
import moment from "moment";

export default {
    data() {
        return {
            // FIXME: Provider URL is not worked right now
            contractResult: "",
            web3: null,
            accounts: [],
            FaucetContract: null,
            message: "",
            transations: [],
            formatedTransations: [],
            recipient: "",
        };
    },

    mounted() {
        this.connect();
        window.setInterval(this.formatTransations, 3000);
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
            // for (let accAddr of this.accounts) {
            //     let balance = await this.getBalance(accAddr);
            //     console.log(accAddr, balance);
            // }

            // FIXME: this is the self defined provider
            // this.web3.setProvider(
            //   new this.web3.providers.HttpProvider(this.providerURL)
            // );
            // console.log(FaucetContract.methods.withdraw, Web3.utils.toWei('0.1', "ether"))
            // FaucetContract.methods.withdraw(100000).send({from: this.accounts[0]})
            // FaucetContract.methods.withdraw(Web3.utils.toWei('0.1', "ether")).then(res => { console.log(res) }).catch((err) => console.log(err))
        },

        async getBalance(address) {
            return this.web3.eth.getBalance(address);
        },

        formatTransations() {
            this.formatedTransations = this.transations.map((trans) => {
                return {
                    ...trans,
                    date: moment(trans.date).fromNow(),
                };
            });
        },

        appendTransation(blockHash) {
            this.transations.push({ blockHash: blockHash, date: new Date() });
            this.formatTransations();
        },

        async withdraw(amount, address) {
            const networkId = await this.web3.eth.net.getId();
            const FaucetContract = new this.web3.eth.Contract(
                FaucetBuild.abi,
                FaucetBuild.networks[networkId].address
            );
            return FaucetContract.methods
                .withdraw(Web3.utils.toWei(amount, "ether"), address)
                .send({ from: this.accounts[0] });
        },

        async withdarwHandler() {
            const amount = "0.01";
            this.withdraw(amount, this.recipient)
                .then((msg) => {
                    console.log(msg);
                    this.appendTransation(msg.transactionHash);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
};
</script>

