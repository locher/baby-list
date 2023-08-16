<script setup>
import GiftSingle from '@/components/GiftSingle.vue'

// Emits
const emit = defineEmits(['updateItem'])

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

const emitUpdateItem = (item) => {
  emit('updateItem', item)
}

//
</script>

<template>
  <section class="">
    <slot></slot>
    <div class="list-gifts">
      <GiftSingle
        v-for="item in items"
        :key="`item${item.id}`"
        :item="item"
        :isAdmin="isAdmin"
        @update-item="emitUpdateItem"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.list-gifts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap);
}
</style>
