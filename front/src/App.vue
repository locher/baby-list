<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
}

main {
  width: 100%;
  min-height: 100vh;
}
</style>
