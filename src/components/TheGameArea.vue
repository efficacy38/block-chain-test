<template>
  <main class="d-flex flex-column w-100">
    <section>
      dealer-side
    </section>
    <section>
      player-side
    </section>

    <TheControl />
  </main>
</template>

<script>
import TheControl from "./TheGameArea/TheControl.vue"

export default {
  components: {
    TheControl,
  }
}
</script>

<style lang="scss" scoped></style>
