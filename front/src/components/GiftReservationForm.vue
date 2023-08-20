<script setup>
  import BtnDefault from "@/components/BtnDefault.vue";
</script>

<template>
    <form action="#">
        <label for="">Ton nom ?</label>
        <input type="text">

        <label for="">Ton mail ?</label>
        <span>Pour valider ou annuler la réservation</span>
        <input type="text">

        <BtnDefault>Réserver</BtnDefault>
    </form>
</template>

<style scoped>

</style>