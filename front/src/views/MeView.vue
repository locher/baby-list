<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserDetails from '@/components/UserDetails.vue'
import GiftList from '@/components/GiftList.vue'
import GiftForm from '@/components/GiftForm.vue'
import User from '@/classes/User'
import UserForm from '@/components/UserForm.vue'
import { getUsers } from '@/apis/users'

// Stores
const authStore = useAuthStore()
const user = new User(authStore.currentUser)
const parentList = ref([])

// Refs
const gifts = ref([])
const lists = ref([])
const donations = ref([])
const openForm = ref(false)
const itemToUpdate = ref({})
const isEditFormOpen = ref(false)

// Hooks
onBeforeMount(async () => {
  try {
    // Get all users
    const allParents = await getUsers({ children: 0 })
    parentList.value = allParents.map((user) => new User(user))
  } catch (error) {
    console.error(error)
  }
})

onMounted(async () => {
  gifts.value = await user.getGifts()
  lists.value = await user.getLists()
  donations.value = await user.getDonation()
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

console.log(user)
</script>

<template>
  <div class="wrapper">
    <UserDetails v-if="user" :user="user" />

    <button @click="editProfil">Éditer le compte</button>

    <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="true" @update-item="updateItem">
      <h2>Mes cadeaux</h2>
    </GiftList>
    <GiftList
      v-if="donations.length > 0"
      :items="donations"
      :is-admin="true"
      @update-item="updateItem"
    >
      <h2>Mes dons</h2>
    </GiftList>
    <GiftList v-if="lists.length > 0" :items="lists" :is-admin="true" @update-item="updateItem">
      <h2>Mes listes</h2>
    </GiftList>
  </div>

  <button
    @click="toggleForm"
    v-html="openForm ? 'Fermer la fenêtre' : 'Ajouter un cadeau'"
  ></button>

  <GiftForm v-if="openForm" :id-user="user.id" :itemToUpdate="itemToUpdate" />

  <UserForm v-if="isEditFormOpen" :parents="parentList" :user="user" />
</template>

<style lang="scss"></style>
