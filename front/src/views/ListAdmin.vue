<script setup>
    import {getUser} from "@/apis/users.js";
    import GiftList from "@/components/GiftList.vue";

    import {onBeforeMount, ref} from "vue";
    import GiftForm from "@/components/GiftForm.vue";
    import UserForm from "@/components/UserForm.vue";
    import UserInfos from "@/components/UserInfos.vue";

    // Refs
    const user = ref({})
    const gifts = ref([])
    const openForm = ref(false)
    const itemToUpdate = ref({})

    // Hooks
    onBeforeMount(async () => {
        user.value = await getUser(1)
        gifts.value = await user.value.getGifts()
        console.log(gifts.value)
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
        isEditFormOpen.value = true
    }

    const updateGifts = (newGift) => {
        console.log(newGift)
        gifts.value.push(newGift);
        openForm.value = false; // Fermez le formulaire après l'ajout du cadeau si nécessaire
    }


</script>

<template>
    <UserInfos :user="user" :is-admin="true"/>

    <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="true">   </GiftList>

    <GiftForm v-if="openForm" :id-user="user.id" :itemToUpdate="itemToUpdate" @gift-added="updateGifts"/>

    <button
        @click="toggleForm"
        v-html="openForm ? 'Fermer la fenêtre' : 'Ajouter un cadeau'"
    ></button>

    <UserForm v-if="isEditFormOpen" :user="user"/>

</template>


<style lang="scss"></style>
