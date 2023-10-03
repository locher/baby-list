<script setup>
// Emits
const emit = defineEmits(['closeModal'])

const closeModal = () => {
  emit('closeModal')
}
</script>

<template>
  <div class="modal__background" @click="closeModal"></div>
  <div class="modal" @keydown.esc="closeModal" @click.self="closeModal">
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" class="modal__inner">
      <button class="modal__closeBtn closeBtn" @click="closeModal">
        <span class="closeBtn__title">Fermer la modale</span>
        <span class="closeBtn__icon">×</span>
      </button>
      <div role="document">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  &__background {
    background-color: var(--color-primary);
    backdrop-filter: blur(20px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    opacity: 0.7;
  }

  &__inner {
    position: fixed;
    z-index: 10000;
    background-color: var(--color-white);
    padding: clamp(2rem, calc(2rem + 5vw), 7rem);
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: clamp(30rem, calc(30rem + 30vw), 100rem);
    height: clamp(30rem, calc(30rem + 50vh), 90vh);
    max-width: 90%;
    border-radius: 1rem;
    overflow-y: scroll;
    box-shadow: 0 0 40rem var(--color-primary);
  }

  &__closeBtn {
    position: fixed;
    top: 0;
    right: 0;
  }
}

.closeBtn {
  border: 0;
  background: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;

  &:hover {
    .closeBtn__icon {
      text-shadow: 0 0 15px rgba(#545454, 0.9);
      color: var(--color-secondary);
    }
  }

  &__title {
    display: none;
  }

  &__icon {
    transition: all ease-in-out 0.4s;
    font-size: 1.5em;
    color: #545454;
    padding: 1em;
    display: block;
    text-shadow: 0 0 5px rgba(#545454, 0);
  }
}
</style>
