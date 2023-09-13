<script setup>

import { useRoute } from 'vue-router'
import router from '@/router'
import {deleteReservation} from "@/apis/item.js";
import {ref} from "vue";
import BtnDefault from "@/components/BtnDefault.vue";

const route = useRoute()

const uuid = route?.params?.uuid

// Refs
const message = ref();
// Methods

// Pas d'uuid, redirection sur la home
if(!uuid) router.push({name: 'list'})

if (uuid){
  deleteReservation(uuid).then(() => {
    message.value="Ta réservation a bien été annulée !"
  })
}

</script>

<template>
  {{ message }}
    <BtnDefault @click="router.push({name: 'list'})">Retour à la liste</BtnDefault>
</template>


<style lang="scss">

</style>
