<script setup>
import { RouterLink, RouterView } from "vue-router";
import { init } from "./web3Provider";
</script>

<template>
  <div class="h-100" v-if="isGame">
    <RouterView v-if="isInit" />
  </div>
  <div class="vw-100 vh-100 position-relative" v-else>
    <div class="stripe"></div>
    <nav class="navbar navbar-expand-lg navbar-white bg-transparent position-relative">
      <div class="mz-1 w-100 h-100 bg-white opacity-25 position-absolute"></div>
      <div class="container-fluid d-flex justify-content-center">
        <RouterLink class="navbar-brand d-flex btn bg-dark text-white mx-3" to="/faucet">Faucet</RouterLink>
        <RouterLink class="navbar-brand d-flex btn bg-dark text-white mx-3" to="/dex">Dex</RouterLink>
        <RouterLink class="navbar-brand d-flex btn bg-dark text-white mx-3" to="/game">Game</RouterLink>
      </div>
    </nav>
    <div class="container">
      <RouterView v-if="isInit" />
      <div v-else="isInit">
        waiting for login / not supported(only supported with metamask)
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isInit: false,
    };
  },
  mounted() {
    // init the metamask web3 provider
    init().then((i) => {
      this.isInit = i;
      console.log(this.isInit);
    });
  },
  computed: {
    isGame() {
      return this.$route.path === "/game" ? true : false;
    },
  },
};
</script>

<style>
.stripe {
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 70%;
  background:
    /* Color                         position     / width height */
    linear-gradient(#25dbf3,
      #25dbf3) center right / 30% 70px,
    linear-gradient(#1fa2ff, #1fa2ff) bottom left / 40% 70px,
    linear-gradient(#5533ff, #5533ff) top left / 30% 70px,
    linear-gradient(#4553ff, #4553ff) top left / 60% 70px,
    linear-gradient(#4f40ff, #4f40ff) top left / 100% 70px,
    /* main background*/
    linear-gradient(150deg, #53f 15%, #05d5ff 70%, #a6ffcb 94%);
  background-repeat: no-repeat;
  transform: skewY(-10deg);
  transform-origin: left;
}

.mz-1 {
  z-index: -1;
}
</style>
