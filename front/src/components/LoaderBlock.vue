<script setup>
import IconSpinner from '@/components/icons/IconSpinner.vue'
</script>

<template>
  <div class="loader">
    <IconSpinner />
  </div>
</template>

<style lang="scss">
.loader {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(var(--color-primary-rgb), 0.5);
  backdrop-filter: blur(0.2rem);
  z-index: 100;

  .icon-spinner svg {
    width: 4rem;
    height: 4rem;
    fill: var(--color-secondary);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 101;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
