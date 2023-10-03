<script setup>
import { useRoute } from 'vue-router'
import router from '@/router'
import { deleteReservation } from '@/apis/item.js'
import { ref } from 'vue'
import BtnDefault from '@/components/BtnDefault.vue'

const route = useRoute()

const uuid = route?.params?.uuid

// Refs
const message = ref()
// Methods

// Pas d'uuid, redirection sur la home
if (!uuid) router.push({ name: 'list' })

if (uuid) {
  deleteReservation(uuid).then(() => {
    message.value = 'Ta réservation a bien été annulée !'
  })
}
</script>

<template>
  <div class="delete-reservation">
    <div class="wrapper">
      <h1>{{ message }}</h1>
      <BtnDefault @click="router.push({ name: 'list' })">Retour à la liste</BtnDefault>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.delete-reservation {
  min-height: 100vh;
  width: 100vw;
  display: flex;

  .wrapper {
    margin: auto;
    text-align: center;
  }
}

h1 {
  font-size: 1.4em;
  margin-bottom: 0.4em;
}
</style>
