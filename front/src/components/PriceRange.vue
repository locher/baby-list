<script setup>
import IconMoney from "@/components/icons/IconMoney.vue";

const props = defineProps({
    range: {
        type: Number,
        required: true
    }
})
</script>

<template>
  <div class="priceRange">
      <IconMoney :class="{ 'active': range >= 1 }" />
      <IconMoney :class="{ 'active': range >= 2 }" />
      <IconMoney :class="{ 'active': range >= 3 }" />
  </div>
</template>

<style scoped lang="scss">

.priceRange{
  display: flex;
  align-items: center;
  gap: .3rem;
  justify-content: flex-end;
  flex:1;

  svg{
    fill: var(--color-primary);

    &:not(.active){
      opacity: .5;
    }
  }
}

</style>