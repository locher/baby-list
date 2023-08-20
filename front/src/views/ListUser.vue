<script setup>
    import {getUser} from "@/apis/users.js";
    import UserDetails from "@/components/UserDetails.vue";
    import GiftList from "@/components/GiftList.vue";

    import {onBeforeMount, ref} from "vue";

    const user = ref()
    const gifts = ref([])

    onBeforeMount(async () => {
        user.value = await getUser(1)
        gifts.value = await user.value.getGifts()
    })

</script>

<template>
    <h1>User</h1>

    <GiftList v-if="gifts.length > 0" :items="gifts" :is-admin="false">
        <h2>cadeaux</h2>
    </GiftList>

</template>


<style lang="scss"></style>
