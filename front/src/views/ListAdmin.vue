<script setup>
    import {getUser} from "@/apis/users.js";
    import UserDetails from "@/components/UserDetails.vue";
    import GiftList from "@/components/GiftList.vue";

    import {onBeforeMount, ref} from "vue";
    import GiftForm from "@/components/GiftForm.vue";
    import UserForm from "@/components/UserForm.vue";

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


</script>

<template>
    <h1>Admin</h1>

    <UserDetails :user="user"/>

    <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="true">
        <h2>Liste de naissance</h2>
    </GiftList>

    <button
        @click="toggleForm"
        v-html="openForm ? 'Fermer la fenêtre' : 'Ajouter un cadeau'"
    ></button>

    <GiftForm v-if="openForm" :id-user="user.id" :itemToUpdate="itemToUpdate" />

    <UserForm v-if="isEditFormOpen" :user="user"/>

</template>


<style lang="scss"></style>
