<script setup>
import { computed, ref, watch } from 'vue'
import { insertUser } from '@/apis/users'
import { format } from 'date-fns'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: {
      id: null,
      name: null,
      birthday_date: null,
      size_top: null,
      size_bottom: null,
      size_feet: null,
      picture_id: null,
      is_child_account: null,
      parent: null
    }
  }
})

// Refs
const id = ref(props.user.id)
const name = ref(props.user.name)
const birthday = ref(props.user.birthday_date || null)
const sizeTop = ref(props.user.size_top)
const sizeBottom = ref(props.user.size_bottom)
const sizeFeet = ref(props.user.size_feet)
const illustration = ref(props.user.picture_id)
const isChildAccount = ref(props.user.is_child_account)

// Computed
const isFormValid = computed(() => {
  return !!(name.value && illustration.value)
})

const formatedBirthday = computed(() => {
  return birthday.value != null ? format(birthday.value, 'yyyy-MM-dd') : ''
})

const isEditForm = computed(() => {
  return !!id.value
})

// Methods
const update = async () => {
  try {
    return await updateUser({
      id: id.value,
      name: name.value,
    })
  } catch (error) {
    console.error(error)
  }
}
const submitForm = () => {
  let result = updateUser()

  if (result) {
    clearForm()
  }
}

const clearForm = () => {
  name.value = null
  birthday.value = null
  sizeTop.value = null
  sizeBottom.value = null
  sizeFeet.value = null
  illustration.value = null
  isChildAccount.value = null
}

</script>

<template>
  <form>
    <div>
      <label for="name">Prénom</label>
      <input type="text" id="name" v-model="name" />
    </div>

    <button
      type="submit"
      @click.prevent="submitForm"
      :disabled="!isFormValid"
      v-html="isEditForm ? 'Modifier l\'utilisateur' : 'Ajouter l\'utilisateur'"
    ></button>
  </form>
</template>

<style scoped></style>
