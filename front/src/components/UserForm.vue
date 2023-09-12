<script setup>
import { ref } from 'vue'
import BtnDefault from "@/components/BtnDefault.vue";

// Props
const props = defineProps({
    birthdayDate:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
})

// Emits
const description = ref(props.description)

</script>

<template>
  <form class="wrapper">
    <div>
      <label for="name">Date du terme</label>
      <input type="date" id="name" :value="props.birthdayDate"/>
    </div>

      <BtnDefault @click.prevent="">
          Modifier le compte
      </BtnDefault>
  </form>
</template>

<style scoped></style>
