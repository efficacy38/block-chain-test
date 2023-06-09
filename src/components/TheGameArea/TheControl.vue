<template>
  <div class="d-flex justify-content-between control mt-auto mx-auto mb-2">
    <button class="form-control mx-3" @click="$emit('double')">double Down</button>
    <button class="form-control mx-3" @click="$emit('stand')">stand</button>
    <button class="form-control mx-3" @click="$emit('hit')">hit</button>
  </div>
</template>

<style lang="scss" scoped>
.control {
  width: 50%;
}
</style>
