<template>
  <div :class="['modal', isModalOpen ? 'open show d-block' : 'fade']" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- restore old game -->
        <div class="modal-content" v-if="!isRestoreDone">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"><span v-if="roundStatus !== GAME_STATUS.UNDETERMINED">You {{
              roundStatus }}. </span>Restore Last Game</h5>
          </div>
          <div class="modal-body">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <div :class="['alert', 'alert-primary']">
              try to loading last game.
            </div>
          </div>
        </div>
        <!-- new game -->
        <div class="modal-content" v-else>
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"><span>You {{
              roundStatus }}. </span>Make a New Game?</h5>
          </div>

          <div class="modal-body">
            <div v-if="startStatus.type" :class="['alert', `alert-${startStatus.type}`]">
              <span> {{ startStatus.message }}</span>
            </div>
            <div>click New Game to play another game</div>
            <div>click Exit to redeem all your money</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="$emit('startGameUI')">New Game</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$router.push('/dex')">Redeem
              Token</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { GAME_STATUS } from "../../variables.js"
</script>

<script>
export default {
  props: {
    isModalOpen: Boolean,
    roundStatus: String,
    startStatus: Object,
    isRestoreDone: Boolean,
  }
}
</script>

<style lang="scss" scoped></style>
