<script setup></script>

<template>
  <span></span>
</template>
<style scoped lang="scss">
span::after {
  content: '';
  display: block;
  z-index: -1;
  animation: morph 12s ease-in-out infinite;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  width: 60vw;
  height: 130vw;
  background-color: var(--color-primary);
}

@keyframes morph {
  0% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }

  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }

  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
}
</style>
