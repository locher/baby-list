<script setup>
import GiftSingle from '@/components/GiftSingle.vue'

// Props
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  }
})

//
</script>

<template>
  <section class="gifts wrapper">

    <div class="gifts__filter">
        <label for="">Filtrer par tranche de prix</label>
        <select name="" id="">
            <option>Tous les prix</option>
            <option>Moins de 30€</option>
            <option>Entre 30€ et 100€</option>
            <option>Plus de 100€</option>
        </select>
    </div>

    <slot></slot>

    <div class="gifts__list">
      <GiftSingle
        v-for="item in items"
        :key="`item${item.id}`"
        :item="item"
        :isAdmin="isAdmin"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">

.gifts{
  margin-top: 4rem;

  &__filter{
    margin-bottom: 4rem;
    display: flex;
    align-items: center;
    gap:2rem;
  }

  &__list{
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--gap);
  }
}

</style>
