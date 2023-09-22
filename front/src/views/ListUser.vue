<script setup>
import {getUser} from '@/apis/users.js'
import GiftList from '@/components/GiftList.vue'

import {computed, onBeforeMount, ref} from 'vue'
import UserInfos from '@/components/UserInfos.vue'
import LoaderBlock from "@/components/LoaderBlock.vue";

const user = ref({})
const gifts = ref([])
const isLoading = ref(true)

onBeforeMount(async () => {
    user.value = await getUser(1)
    gifts.value = await user.value.getGifts()

    if (user.value && gifts.value) {
        isLoading.value = false
    }
})

</script>

<template>
    <Transition>
        <LoaderBlock v-if="isLoading"/>
    </Transition>
    <UserInfos :user="user"/>
    <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="false"/>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
