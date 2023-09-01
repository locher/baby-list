<script setup>
import GiftSingle from '@/components/GiftSingle.vue'
import {computed, ref} from "vue";

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

const range = [
    {
        title: "Tous les prix",
        value: 0
    },
    {
        title: "Moins de 30€",
        value: 1
    },
    {
        title: "Entre 30€ et 100€",
        value: 2
    },
    {
        title: "Plus de 100€",
        value: 3
    }
]

// Refs
const filter = ref(0)

// Computed
const filteredGifts = computed(() => {
    if(filter.value === 0) return props.items
    else if(filter.value === 1) return props.items.filter((item) => item.price < 30 && item.price > 0)
    else if(filter.value === 2) return props.items.filter((item) => item.price >= 30 && item.price < 100)
    else if(filter.value === 3) return props.items.filter((item) => item.price >= 100)
})

</script>

<template>
  <section class="gifts wrapper">

    <div class="gifts__filter">
        <label for="">Filtrer par tranche de prix</label>
        <select v-model="filter" id="filter">
            <option v-for="item in range" :value="item.value">{{item.title}}</option>
        </select>
    </div>

    <slot></slot>

    <div class="gifts__list">
      <GiftSingle
        v-for="item in filteredGifts"
        :key="`item${item.id}`"
        :item="item"
        :isAdmin="isAdmin"
      />

      <div class="noGift noGift--filter" v-if="filteredGifts.length === 0">Aucun cadeau dans cette tranche de prix :(</div>

      <div class="noGift" v-if="props.items.length === 0">Aucun cadeau pour le moment :(</div>

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
