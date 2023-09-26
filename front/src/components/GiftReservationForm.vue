<script setup>
import BtnDefault from '@/components/BtnDefault.vue'
import { ref } from 'vue'
import { reserveItem } from '@/apis/item.js'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Refs
const name = ref()
const email = ref()

// Emits
const emit = defineEmits(['reservationDone'])

// Methods
const submitReserveItem = async () => {
  if (name.value !== '' && email.value !== '') {
    const reserve = await reserveItem(props.item?.id, name.value, email.value, props.item?.title)

    if (reserve) {
      emit('reservationDone', reserve)
    }
  }
}
</script>

<template>
  <form @submit.prevent="submitReserveItem">
    <div class="form__single">
      <label for="" class="form__label">Ton nom ?</label>
      <input type="text" class="form__input" v-model.trim="name" required />
    </div>

    <div class="form__single">
      <label for="" class="form__label">Ton mail ?</label>
      <input type="email" class="form__input" v-model.trim="email" required />
      <span class="form__notice">Pour valider ou annuler la réservation</span>
    </div>

    <BtnDefault buttonType="submit">Réserver</BtnDefault>
  </form>
</template>
