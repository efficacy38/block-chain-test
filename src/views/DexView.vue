<template>
  <div class="container h-100">
    <div class="row justify-content-between align-items-stretch text-center pt-5">
      <h1 class="col-12 text-white fw-light lh-1 mb-5">JHToken Dex</h1>

      <!-- Row 1 -->
      <div class="col-md-6">
        <div class="h-100 d-flex">
          <div class="card shadow m-2 d-flex flex-grow-1">
            <div class="card-body">
              <h5 class="card-title text-start">Swap Tokens</h5>
              <div class="w-100 alert alert-primary" v-if="message">
                {{ this.message }}
              </div>
              <div class="input-group my-3">
                <input type="text" class="form-control" v-model="swapAmount">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">{{
                  swapDirection == 0 ? "ETH" : "JHT" }}</button>
                <ul class="dropdown-menu">
                  <li><span class="dropdown-item" @click="() => { this.swapDirection = 0 }">ETH</span></li>
                  <li><span class="dropdown-item" @click="() => { this.swapDirection = 1 }">JHT</span></li>
                </ul>
              </div>

              <div>To</div>

              <div class="input-group my-3" style="padding-bottom: 70px">
                <input type="number" class="form-control" :value="swapAmount" disabled>
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">{{
                  swapDirection == 0 ? "JHT" : "ETH" }}</button>
                <ul class="dropdown-menu">
                  <li><span class="dropdown-item" @click="() => { this.swapDirection = 0 }">JHT</span></li>
                  <li><span class="dropdown-item" @click="() => { this.swapDirection = 1 }">ETH</span></li>
                </ul>
              </div>

              <div class="w-100" style="position: absolute; height: 70px; bottom: 0; left: 0; padding: inherit">
                <button class="btn btn-outline-secondary w-100 b-0" type="button" @click="swapToken">Swap</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 d-flex flex-column">
        <div class="d-flex m-2 card shadow">

          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="d-flex card-title text-start">Dex Status</h5>
              <div class="d-flex">
                <button class="m-1 p-1 btn btn-outline-secondary round" style="width: 40px; height: 40px" type="button"
                  @click="refreashBalance">
                  <font-awesome-icon :icon="['fas', 'rotate']" />
                </button>
              </div>
            </div>
            <div class="text-start">
              <h6>JHT address: {{ jhtAddress }}</h6>
              <h6>DEX address: {{ dexAddress }}</h6>
              <h6>JHT Balance: {{ dex.JHTAmount }} JHT</h6>
              <h6>ETH Balance: {{ dex.ETHAmount }} ETH</h6>
            </div>
          </div>
        </div>
        <div class="d-flex flex-1 m-2 card shadow">
          <div class="card-body">
            <h5 class="card-title text-start">Your Status</h5>
            <div class="text-start">
              <h6>JHT Balance: {{ account.JHTAmount }} JHT</h6>
              <h6>JHT Allowance: {{ account.JHTAllowance }} JHT</h6>
              <h6>ETH Balance: {{ account.ETHAmount }} ETH</h6>
            </div>
          </div>
        </div>
      </div>

      <!-- row 2 -->
      <!-- <div class="col-md-12 my-3"> -->
      <!--   <div class="m-2 card shadow"> -->
      <!--     <h3>history of the swaps</h3> -->
      <!--     Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis id dicta sapiente ea delectus molestiae -->
      <!--     consectetur vel architecto nam eum doloribus exercitationem possimus ratione ut similique facere alias, -->
      <!--     commodi -->
      <!--     pariatur. -->
      <!--   </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { JHTokenAddress, JHTokenDexAddress, approveJHT, buyJHT, getBalance, getAllowance, getJHTBalance, getDexJHTBalance, getDexBalance, selectAccount, sellJHT } from "../web3Provider.js";
import web3 from "web3"
</script>
<script>
export default {
  methods: {
    async swapToken() {
      if (this.swapDirection == 0) {
        this.message = "waiting for buy JHT";
        await buyJHT(this.swapAmount);
        this.message = "done";
      } else {
        this.message = "waiting for set allowance";
        await approveJHT(this.swapAmount);
        this.refreashBalance();
        this.message = "waiting for sellback contract";
        await sellJHT(this.swapAmount);
        this.message = "done";
      }
      this.refreashBalance();
    },
    refreashBalance() {
      getDexBalance().then(amount => {
        this.dex.ETHAmount = web3.utils.fromWei(amount)
      });
      getDexJHTBalance().then(amount => {
        this.dex.JHTAmount = web3.utils.fromWei(amount)
      });

      getBalance(selectAccount).then(amount => {
        this.account.ETHAmount = web3.utils.fromWei(amount)
      }
      );
      getJHTBalance(selectAccount).then(amount => {
        this.account.JHTAmount = web3.utils.fromWei(amount)
      });

      getAllowance(selectAccount).then((amount) => {
        console.log(amount)
        this.account.JHTAllowance = web3.utils.fromWei(amount)
      }
      )
    }
  },
  mounted() {
    this.refreashBalance();
  },
  data() {
    return {
      jhtAddress: JHTokenAddress,
      dexAddress: JHTokenDexAddress,
      swapAmount: "0",
      dex: {
        JHTAmount: "0",
        ETHAmount: "0",
      }, account: {
        JHTAmount: "0",
        ETHAmount: "0",
        JHTAllowance: "0",
      },
      // 0 stand for buy, 1 stand for sell
      swapDirection: "0",
      message: "",
    }
  }
}
</script>

<style lang="scss" scoped>
div.swap-config {
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
}
</style>
