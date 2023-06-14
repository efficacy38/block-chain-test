<template>
  <aside class="sidebar" :class="{ 'open': true }">
    <GameLogo />
    <p class="tagline">
      Built with
      <a href="https://vuejs.org/" title="vuejs.org" target="_blank">
        Vue.js
      </a>
    </p>
  </aside>
</template>

<script>
import GameLogo from './GameLogo.vue'
export default {
  components: {
    GameLogo
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex !important;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 320px;
  font-size: 1rem;
  color: $white;
  z-index: 100;
  background: $secondary-color;
  height: 100%;
  transition: transform 0.2s ease-in;
}

@media (max-width: 1199px) {
  .sidebar {
    // position: absolute;
    transform: translateX(-320px);
  }

  .sidebar.open {
    transform: translateX(0px);
  }
}

.tagline {
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.sidebar #logo {
  width: 85%;
}

.sidebar p {
  margin: 1rem 0;
  text-align: center;
}

.sidebar p a {
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.sidebar p a:hover {
  border-color: $white;
}
</style>
