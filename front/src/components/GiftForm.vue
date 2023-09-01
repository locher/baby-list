<script setup>
import { insertItem, updateItem } from '@/apis/item'
import {computed, reactive} from 'vue'
import BtnDefault from "@/components/BtnDefault.vue";

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
      id: '',
      price:''
    }
  }
})

// Emits
const emit = defineEmits(['giftAdded'])

// Refs
const item = reactive(props.itemToUpdate)

// Computed

const formattedPrice = computed(() => {
    const numericValue = item.price?.toString().replace(/[^0-9.]/g, ''); // Garde seulement les chiffres et le point décimal
    return parseFloat(numericValue); // Convertit la chaîne en nombre à virgule flottante
})

// Methods
const addItem = async () => {
  console.log(item)

  try {
    const result = await insertItem({
      title: props.itemToUpdate.title,
      description: props.itemToUpdate.description,
      link: props.itemToUpdate.link,
      id_user_owner: props.idUser,
      price: formattedPrice.value
    })

    //Emit the new gift
    if (result) {
        clearForm();
        // Émettre l'événement vers le parent
        emit('giftAdded', result);
    }

    return result
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
      id: props.itemToUpdate.id.value,
      price: formattedPrice
    })
  } catch (error) {
    console.error(error)
  }
}

const clearForm = () => {
  props.itemToUpdate.title = null
  props.itemToUpdate.description = null
  props.itemToUpdate.link = null
  props.itemToUpdate.price =null
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
    <div class="wrapper">


  <form class="gift gift--edit">
      <div class="gift__header">
          <input type="text" placeholder="Désignation" v-model.trim="item.title" />
      </div>

      <input type="text" placeholder="Lien" v-model.trim="props.itemToUpdate.link" />
      <textarea placeholder="Description" v-model.trim="props.itemToUpdate.description" rows="3"></textarea>
      <input type="text" placeholder="Prix" v-model.trim="props.itemToUpdate.price" />

      <div class="gift__buttons">
          <BtnDefault v-if="props.itemToUpdate.id" @click.prevent="submitForm">Modifier le cadeau</BtnDefault>
          <BtnDefault v-else @click.prevent="submitForm">Ajouter à la liste</BtnDefault>
      </div>
  </form>
    </div>
</template>

<style scoped lang="scss">
  .gift{

    input[type="text"],
    input[type="number"],
    textarea{
      width: 100%;
      background-color: transparent;
      border: 1px solid var(--color-primary);
      outline: 0;
      padding: .5em;
      color: var(--color-primary);
      border-radius: .7rem;
      resize: none;
      appearance: textfield;

      &:focus{
        outline: 1px solid var(--color-primary);
      }
    }

      &__buttons{
        display: flex;
        align-items: center;
        justify-content: center;
      }

    &--edit{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: var(--gap);
    }

    &__header{
      font-size: 1.7rem;
      line-height: 1.2em;
    }
  }
</style>
