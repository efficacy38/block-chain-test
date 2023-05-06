<template>
  <div class="container h-100">
    <div class="row justify-content-between align-items-start text-center pt-5">
      <h1 class="text-white fw-light lh-1 mb-5">JHToken Dex</h1>

      <!-- Row 1 -->
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title text-start">Swap Tokens</h5>
            <div class="input-group my-3">
              <input type="text" class="form-control" v-model="swapAmount">
              <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                data-bs-toggle="dropdown">ETH</button>
              <ul class="dropdown-menu">
                <li><span class="dropdown-item">ETH</span></li>
                <li><span class="dropdown-item">JHT</span></li>
              </ul>
            </div>

            <div>To</div>

            <div class="input-group my-3">
              <input type="number" class="form-control" :value="swapAmount" disabled>
              <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                data-bs-toggle="dropdown">JHT</button>
              <ul class="dropdown-menu">
                <li><span class="dropdown-item">JHT</span></li>
                <li><span class="dropdown-item">ETH</span></li>
              </ul>
            </div>

            <button class="btn btn-outline-secondary w-100" type="button" @click="swapToken">Swap</button>
          </div>
        </div>
      </div>

      <div class="row col-md-6">
        <div class="col col-12 mb-3 card shadow">
          <div class="card-body">
            <h5 class="card-title text-start">Dex Status</h5>
            <div class="text-start">
              <h6>Current Amounts of JHT: {{ dex.JHTAmount }} JHT</h6>
              <h6>Current Amounts of ETH: {{ dex.ETHAmount }} ETH</h6>
            </div>
          </div>
        </div>
        <div class="col col-12 card shadow">
          <div class="card-body">
            <h5 class="card-title text-start">Your Status</h5>
            <div class="text-start">
              <h6>Current Amounts of JHT: {{ account.JHTAmount }} JHT</h6>
              <h6>Current Amounts of ETH: {{ account.ETHAmount }} ETH</h6>
            </div>
          </div>
        </div>
      </div>

      <!-- row 2 -->
      <div class="col-md-12 my-3">
        <div class="card shadow">
          <h3>history of the swaps</h3>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis id dicta sapiente ea delectus molestiae
          consectetur vel architecto nam eum doloribus exercitationem possimus ratione ut similique facere alias,
          commodi
          pariatur.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { buyJHT, getDexBalance, getDexJHTBalance } from "../web3Provider.js";
import web3 from "web3"
</script>
<script>
export default {
  methods: {
    swapToken() {
      console.log(this.swapAmount)
      buyJHT(this.swapAmount);
    }
  },
  mounted() {
    getDexBalance().then((amount) => { this.dex.ETHAmount = web3.utils.fromWei(amount) });
    getDexJHTBalance().then((amount) => { this.dex.JHTAmount = web3.utils.fromWei(amount) });
    this.account.JHTAmount = "";
    this.account.ETHAmount = "";
  },
  data() {
    return {
      swapAmount: "0",
      dex: {
        JHTAmount: "0",
        ETHAmount: "0",
      }, account: {
        JHTAmount: "0",
        ETHAmount: "0",
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div.swap-config {
  display: grid;
  grid-template-columns: max-content auto max-content;
  grid-gap: 5px;

  label {
    font-weight: 800;
    text-align: right;
    align-self: center;
    margin: 0;
  }
}
</style>
