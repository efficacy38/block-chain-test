<template>
  <div class="container h-100">
    <div class="row justify-content-center align-items-start text-center pt-5">
      <h1 class="text-white fw-light lh-1 mb-5">JERRY'S FAUCET</h1>
      <div class="col-7 card border-0 shadow rounded-xs py-5">
        <div class="row">
          <div class="col-9">
            <input type="text" class="form-control item" placeholder="your wallet address" />
          </div>
          <div class="col-3">
            <button type="button" class="btn btn-primary w-100">Send the Eth</button>
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
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'

export default {
  data() {
    return {
      // FIXME: Provider URL is not worked right now
      providerURL: import.meta.env.PROVIDERURL || 'https://sepolia.infura.io/v3/${key}',
      connected: false,
      contractResult: '',
      web3: null,
      accounts: []
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    async connect() {
      let provider = window.ethereum
      let tmpAcc = []
      if (typeof provider !== 'undefined') {
        // MetaMask is installed
        await provider
          .request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            this.accounts = accounts
          })
          .catch((err) => {
            console.log(err)
          })
      }

      // FIXME: current only support metamask provider
      this.web3 = new Web3(provider)
      for (let accAddr of this.accounts) {
        let balance = await this.getBalance(accAddr)
        console.log(accAddr, balance)
      }

      // FIXME: this is the self defined provider
      // this.web3.setProvider(
      //   new this.web3.providers.HttpProvider(this.providerURL)
      // );
    },
    async getBalance(address) {
      return this.web3.eth.getBalance(address)
    },
    async withdraw() {}
  }
}
</script>

