<template>
  <div class="game">
    <TheStars />
    <!-- <TheSidebar /> -->
    <!-- <TheGameArea /> -->
    <!-- <TheMenuButton /> -->
    <!-- <TheTitleScreen v-if="$store.state.isTitleShowing" /> -->
  </div>
</template>


<script>
import TheStars from "../components/TheGameArea/TheStars.vue"
// import TheSidebar from "../components/TheSideBar.vue"

export default {
  components: {
    TheStars,
    // TheSidebar
  },
}
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  flex-flow: row nowrap;
}

html,
body {
  overflow: hidden;
}

.game {
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

html {
  font-size: 16px;
}

@media (max-height: 768px) {
  html {
    font-size: calc(5px + 0.5vh);
  }
}

.game {
  background: $primary-color;
  font-family: 'Helvetica', 'Arial', sans-serif;
}

:focus {
  outline: 0 !important;
}

* {
  user-select: none;
}

.text-red {
  color: #E04030;
}

.text-secondary-color {
  color: rgb(12, 36, 48);
}

.text-gold {
  color: #E1AE0F;
}

.text-white {
  color: $white;
}
</style>
