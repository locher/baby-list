<script setup>
import { getUser } from '@/apis/users.js'
import GiftList from '@/components/GiftList.vue'

import { onBeforeMount, ref } from 'vue'
import UserInfos from '@/components/UserInfos.vue'

const user = ref({})
const gifts = ref([])

onBeforeMount(async () => {
  user.value = await getUser(1)
  gifts.value = await user?.value.getGifts()
})
</script>

<template>
  <UserInfos :user="user" />

  <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="false" />
</template>

<style lang="scss"></style>
