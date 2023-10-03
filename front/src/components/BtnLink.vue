<script setup></script>

<template>
  <button class="btLink">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.btLink {
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.3rem;
  line-height: 1em;
  color: var(--color-grey);
}
</style>
