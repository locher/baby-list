<script setup>
import { ref } from 'vue'
import BtnDefault from "@/components/BtnDefault.vue";
import {updateUser} from "@/apis/users.js";

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

// Refs
const description = ref(props.description)
const birthdayDate = ref(new Date(props.birthdayDate).toLocaleDateString("sv-SE"))

// Emits
const emit = defineEmits(['userUpdated'])

// Methods
const updateAccountInfos = async () => {
    await updateUser(1, description.value, birthdayDate.value).then(() => {
      emit('userUpdated', {description, birthdayDate})
    })
}


</script>

<template>
  <form class="wrapper" @submit.prevent="updateAccountInfos()">

    <div class="form__single">
      <label for="name" class="form__label">Date du terme</label>
      <input type="date" id="name" v-model="birthdayDate"/>
    </div>

      <div class="form__single">
          <label for="description" class="form__label">Description</label>
          <textarea v-model="description"></textarea>
      </div>

      <BtnDefault>Modifier le compte</BtnDefault>
  </form>
</template>

<style scoped lang="scss">
  textarea{
    min-height: 50vh;
  }
</style>
