<template>
  <form class="inputForm wrapper">
    <div class="inputForm__content">
      <h1><slot name="title" /></h1>
      <slot name="inputs" />
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </form>
</template>

<style lang="scss">
.inputForm {
  margin: auto;
  min-height: 100vh;
  display: flex;

  h1 {
    margin-bottom: 1em;
  }
}

.inputForm__content {
  margin: auto;
  width: 100%;
  max-width: 50rem;
}

.footer {
  display: flex;
  align-items: center;
  gap: var(--gap);

  .error {
    font-weight: 500;
    font-size: 0.9em;
    color: var(--color-red);
  }

  .valid {
    font-weight: 500;
    font-size: 0.9em;
  }
}
</style>
