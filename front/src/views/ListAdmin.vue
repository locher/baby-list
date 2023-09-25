<script setup>
import {getUser} from '@/apis/users.js'
import GiftList from '@/components/GiftList.vue'

import {onBeforeMount, ref} from 'vue'
import GiftForm from '@/components/GiftForm.vue'
import UserInfos from '@/components/UserInfos.vue'
import BtnDefault from '@/components/BtnDefault.vue'
import LoaderBlock from "@/components/LoaderBlock.vue";
import ModalItem from "@/components/ModalItem.vue";

// Refs
const user = ref({})
const gifts = ref([])
const openForm = ref(false)
const itemToUpdate = ref({})
const isLoading = ref(true)

// Hooks
onBeforeMount(async () => {
    user.value = await getUser(1)
    gifts.value = await user.value.getGifts()

    if (user.value && gifts.value) {
        isLoading.value = false
    }
})

// Method
const updateItem = (item) => {
    itemToUpdate.value = item
    openForm.value = true
}

const toggleForm = () => {
    openForm.value = !openForm.value
    itemToUpdate.value = {}
}

const editProfil = () => {
    openForm.value = true
}

const updateGiftsList = (newGift) => {
    gifts.value.push(newGift)
    openForm.value = false // Fermez le formulaire après l'ajout du cadeau si nécessaire
}

const updateGiftsListAfterUpdate = (updatedGift) => {
    // Changer les infos de la liste des gifts
    gifts.value.map((item) => {
        if (item?.id === updatedGift.id) {
            return updatedGift
        } else {
            return item
        }
    })
    openForm.value = false // Fermez le formulaire après l'ajout du cadeau si nécessaire
}
</script>

<template>
    <Transition>
        <LoaderBlock v-if="isLoading"/>
    </Transition>
    <UserInfos :user="user" :is-admin="true"/>

    <GiftList
            v-if="gifts.length > 0"
            :items="gifts"
            :is-admin="true"
            @update-item="(item) => updateItem(item)"
    />

    <GiftForm
            v-if="openForm"
            :id-user="user.id"
            :itemToUpdate="itemToUpdate"
            @gift-added="updateGiftsList"
            @gift-updated="(item) => updateGiftsListAfterUpdate(item)"
    />

    <div class="admin__addGift">
        <BtnDefault @click="toggleForm" v-html="openForm ? 'Fermer la fenêtre' : 'Ajouter un cadeau'" :border="true"/>
    </div>
</template>

<style lang="scss" scoped>
.admin__addGift {
  display: flex;
  justify-content: center;
  margin-top: var(--gap);
  margin-bottom: var(--gap);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
