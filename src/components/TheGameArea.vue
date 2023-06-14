<template>
  <main class="d-flex flex-column w-100">
    <div
      class="h-100 d-flex flex-column justify-content-between align-items-center"
    >
      <section>
        <PlayingCard
          v-for="(card, i) in dealer.cards"
          :key="i"
          :card="card"
          :isFaceDown="card.isFaceDown"
        />
      </section>
      <section>
        <PlayingCard
          v-for="(card, i) in player.cards"
          :key="i"
          :card="card"
          :isFaceDown="card.isFaceDown"
        />
      </section>
    </div>
    <TheControl @hit="onHit" @stand="onStand" @double="onDoubleDown" />

    <!-- Modal -->
    <SettleModal
      :isRestoreDone="isRestoreDone"
      :isModalOpen="isModalOpen"
      :roundStatus="game.roundStatus"
      :startStatus="startStatus"
      @startGameUI="startGameUI"
      @toggleNewGameModal="toggleNewGameModal"
    ></SettleModal>
  </main>
</template>

<script setup>
import { GAME_STATUS } from "../variables.js";
import TheControl from "./TheGameArea/TheControl.vue";
import PlayingCard from "./TheGameArea/GameHand/PlayingCard.vue";
import SettleModal from "./TheGameArea/SettleModal.vue";
import {
  web3,
  getRoundStatus,
  startNewGame,
  getPlayerCards,
  getDealerCards,
  hit,
  stand,
  doubleDown,
  unSubscribeRoundStatus,
  subscribeRoundStatus,
} from "../web3Provider.js";
</script>

<script>
export default {
  data() {
    return {
      isRestoreDone: true,
      game: {
        roundStatus: "",
        step: -1,
        round: -1,
      },
      isModalOpen: true,
      startStatus: {
        type: "",
        message: "",
      },
      dealer: {
        cards: [],
      },
      player: {
        cards: [],
      },
    };
  },
  components: {
    TheControl,
    PlayingCard,
    SettleModal,
  },
  methods: {
    setStartStatusDialog(type, message) {
      this.startStatus.type = type;
      this.startStatus.message = message;
    },
    async startGameUI() {
      let isStartOk = await startNewGame(this.setStartStatusDialog);
      if (isStartOk) {
        this.toggleNewGameModal();
      }
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
      this.game.roundStatus = await getRoundStatus();
      // wait for event and get new card info
      this.game.roundStatus = await getRoundStatus();
    },
    async updateCards() {
      [this.player.cards, this.dealer.cards] = await Promise.all([
        getPlayerCards(),
        getDealerCards(),
      ]);
      console.log("cards", this.payer, this.dealer);
    },
  },
  async mounted() {
    this.updateCards();
    subscribeRoundStatus({
      onData: function (rawEvent) {
        let event = web3.eth.abi.decodeParameters(
          ["uint", "uint", "string"],
          rawEvent.data
        );
        this.game.round = event[0];
        this.game.step = event[1];
        this.game.roundStatus = event[2];
        this.updateCards();

        if (this.game.roundStatus !== GAME_STATUS.UNDETERMINED) {
          this.isModalOpen = true;
        } else {
          this.isModalOpen = false;
        }
        // if (!this.isRestoreDone) {
        //   this.isRestoreDone = true;
        // }
      }.bind(this),
    });
  },
};
</script>

<style lang="scss" scoped></style>
