<template>
  <main class="d-flex flex-column w-100">
    <div class="h-100 d-flex flex-column justify-content-between align-items-center">
      <section>
        <PlayingCard v-for="(card, i) in dealer.cards" :key="i" :card="card" :isFaceDown="card.isFaceDown" />
      </section>
      <section>
        <PlayingCard v-for="(card, i) in player.cards" :key="i" :card="card" :isFaceDown="card.isFaceDown" />
      </section>
    </div>
    <div>
      {{ roundStatus }}
    </div>
    <TheControl @hit="onHit" @stand="onStand" @double="onDoubleDown" />

    <!-- Modal -->
    <div :class="['modal', isModalOpen ? 'open show d-block' : 'fade']" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"><span v-if="roundStatus !== 'undeterminted'">You {{
              roundStatus }}. </span>Make a New Game?</h5>
          </div>
          <div class="modal-body">
            <div>click New Game to play another game</div>
            <div>click Exit to redeem all your money</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="startGameUI">New Game</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$router.push('/dex')">Redeem
              Token</button>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import TheControl from "./TheGameArea/TheControl.vue"
import PlayingCard from "./TheGameArea/GameHand/PlayingCard.vue"
import { GAME_STATUS } from "../variables.js"
import { web3, getRoundStatus, startNewGame, getPlayerCards, getDealerCards, hit, stand, doubleDown, unSubscribeRoundStatus, subscribeRoundStatus } from "../web3Provider.js"

export default {
  data() {
    return {
      isModalOpen: true,
      roundStatus: GAME_STATUS.UNDETERMINED,
      dealer: {
        cards: []
      },
      player: {
        cards: []
      }
    }
  },
  components: {
    TheControl,
    PlayingCard
  },
  methods: {
    async startGameUI() {
      await startNewGame()
      this.isModalOpen = false;
      this.roundStatus = await getRoundStatus();
    },
    async onHit() {
      console.log("hit");
      await hit();
      this.handlePlayerOperation();
    },
    async onStand() {
      console.log("stand");
      await stand();
      this.handlePlayerOperation();
    },
    async onDoubleDown() {
      console.log("double");
      await doubleDown();
      this.handlePlayerOperation();
    },
    toggleNewGameModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    async handlePlayerOperation() {
      this.roundStatus = await getRoundStatus();
      // wait for event and get new card info
      this.roundStatus = await getRoundStatus();
      if (this.roundStatus !== GAME_STATUS.UNDETERMINED) {
        this.toggleNewGameModal()
      }
    },
    async updateCards() {
      [this.player.cards, this.dealer.cards] = await Promise.all([getPlayerCards(), getDealerCards()]);
    }
  },
  async mounted() {
    this.updateCards();
    subscribeRoundStatus({
      onData: function (rawEvent) {
        let event = web3.eth.abi.decodeParameters(['uint', 'uint', 'string'], rawEvent.data);
        console.log(event)
        let round = event[0], step = event[1];
        this.roundStatus = event[2];
        if (this.roundStatus !== GAME_STATUS.UNDETERMINED) {
          this.toggleNewGameModal()
        }
      }.bind(this)
    })
  }
}
</script>

<style lang="scss" scoped></style>
