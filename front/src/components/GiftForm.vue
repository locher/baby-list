<script setup>
import { insertItem, updateItem } from '@/apis/item'
import { reactive } from 'vue'

// Props
const props = defineProps({
  idUser: {
    type: Number,
    required: true
  },
  itemToUpdate: {
    type: Object,
    required: false,
    default: {
      title: '',
      description: '',
      link: '',
      type: '',
      id: ''
    }
  }
})

// Refs
const item = reactive(props.itemToUpdate)

// Methods
const addItem = async () => {
  console.log(item)

  try {
    return await insertItem({
      title: props.itemToUpdate.title,
      description: props.itemToUpdate.description,
      link: props.itemToUpdate.link,
      id_user: props.idUser,
      type: props.itemToUpdate.type
    })
  } catch (error) {
    console.error(error)
  }
}

const updateTheItem = async () => {
  try {
    return await updateItem({
      title: props.itemToUpdate.title.value,
      description: props.itemToUpdate.description.value,
      link: props.itemToUpdate.link.value,
      id_user: props.itemToUpdate.props.idUser,
      type: props.itemToUpdate.type.value,
      id: props.itemToUpdate.id.value
    })
  } catch (error) {
    console.error(error)
  }
}

const clearForm = () => {
  props.itemToUpdate.title = null
  props.itemToUpdate.description = null
  props.itemToUpdate.link = null
}

const submitForm = () => {
  let result = null

  console.log(props.itemToUpdate)

  // Ajout
  if (!props.itemToUpdate.id) {
    result = addItem()
  } else {
    result = updateTheItem()
  }

  if (result) {
    clearForm()
  }
}
</script>

<template>
  <form>
    <div class="form-wrapper">
      <h2 v-if="!props.itemToUpdate.id">Ajouter un élément</h2>
      <h2 v-else>Modifier un élément</h2>
      <div class="wrap-form">
        <div class="label-wrap">
          <label for="">Type d'élément</label>
        </div>
        <input type="radio" name="type" value="gift" id="gift" v-model="item.type" />
        <label for="gift">Cadeau</label>
        <input type="radio" name="type" value="list" id="list" v-model="item.type" />
        <label for="list">Liste</label>
        <input type="radio" name="type" value="donation" id="donation" v-model="item.type" />
        <label for="donation">Don</label>
      </div>

      <div class="wrap-form">
        <div class="label-wrap">
          <label for="">Désignation</label>
        </div>
        <input type="text" name="designation" v-model.trim="item.title" />
      </div>

      <div class="wrap-form">
        <div class="label-wrap">
          <label for="">Lien</label>
          <span class="helper">Facultatif</span>
        </div>
        <input type="text" name="link" v-model.trim="props.itemToUpdate.link" />
      </div>

      <div class="wrap-form">
        <div class="label-wrap">
          <label for="">Description</label>
          <span class="helper">Facultatif</span>
        </div>
        <textarea name="description" v-model.trim="props.itemToUpdate.description"></textarea>
      </div>

      <div class="bt-wrapper">
        <button v-if="props.itemToUpdate.id" type="submit" @click.prevent="submitForm">
          Modifier
        </button>
        <button v-else type="submit" @click.prevent="submitForm">Ajouter</button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
