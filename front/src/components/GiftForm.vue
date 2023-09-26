<script setup>
import { insertItem, updateItem } from '@/apis/item'
import { computed, reactive, ref } from 'vue'
import BtnDefault from '@/components/BtnDefault.vue'
import IconNoPicture from '@/components/icons/IconNoPicture.vue'
import IconSpinner from '@/components/icons/IconSpinner.vue'
import ModalItem from '@/components/ModalItem.vue'

import { VITE_OPENGRAPH_TOKEN } from '../config/constants'

const OPENGRAPH_TOKEN = VITE_OPENGRAPH_TOKEN

// Props
const props = defineProps({
  idUser: {
    type: Number,
    required: true
  },
  itemToUpdate: {
    type: Object,
    required: false
  }
})

// Emits
const emit = defineEmits(['giftAdded', 'giftUpdated'])

// Refs
const item = reactive(props.itemToUpdate)
const isLoading = ref(false)
const allImages = ref([])
const isModalImagesOpen = ref(false)

// Computed

const formattedPrice = computed(() => {
  const numericValue = item.price?.toString().replace(/[^0-9.]/g, '') // Garde seulement les chiffres et le point décimal
  return parseFloat(numericValue) // Convertit la chaîne en nombre à virgule flottante
})

// Methods
const addItem = async () => {
  try {
    const result = await insertItem({
      title: props.itemToUpdate.title,
      description: props.itemToUpdate.description,
      link: props.itemToUpdate.link,
      id_user_owner: props.idUser,
      price: formattedPrice.value,
      image: props.itemToUpdate.image
    })

    //Emit the new gift
    if (result) {
      clearForm()
      // Émettre l'événement vers le parent
      emit('giftAdded', result)
    }

    return result
  } catch (error) {
    console.error(error)
  }
}

const updateTheItem = async () => {
  try {
    const result = await updateItem({
      title: props.itemToUpdate.title,
      description: props.itemToUpdate.description,
      link: props.itemToUpdate.link,
      id: props.itemToUpdate.id,
      price: formattedPrice.value,
      id_user_owner: props.idUser,
      image: props.itemToUpdate.image
    })

    if (result) {
      emit('giftUpdated', result)
    }
  } catch (error) {
    console.error(error)
  }
}

const clearForm = () => {
  props.itemToUpdate.title = null
  props.itemToUpdate.description = null
  props.itemToUpdate.link = null
  props.itemToUpdate.price = null
}

const submitForm = () => {
  // Ajout
  if (!props.itemToUpdate.id) {
    addItem()
  } else {
    updateTheItem()
  }
}

const fetchImageMeta = async () => {
  const regexURL = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i

  // si l'url est pas vide et que c'est bien une url, on récupère les meta
  if (props.itemToUpdate.link && regexURL.test(props.itemToUpdate.link)) {
    try {
      isLoading.value = true
      const encodedUrl = encodeURIComponent(props.itemToUpdate.link)

      const response = await fetch(
        `https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${OPENGRAPH_TOKEN}`
      )

      const data = await response.json()

      // Récupère le titre
      const title = data?.openGraph?.title || data.hybridGraph?.title || ''
      if (!props.itemToUpdate.title) {
        props.itemToUpdate.title = title
      }

      // Récupère l'image
      const image = data?.openGraph?.image?.url || data.hybridGraph?.image || ''
      props.itemToUpdate.image = image

      // Récupère le prix
      if (!props.itemToUpdate.price) {
        props.itemToUpdate.price = data?.hybridGraph?.products[0]?.offers[0]?.price || ''
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
    }
  }
}

const loadAllImages = async () => {

  if(props.itemToUpdate.link){
      try {
          isLoading.value = true
          const encodedUrl = encodeURIComponent(props.itemToUpdate.link)

          const response = await fetch(
              `https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${OPENGRAPH_TOKEN}`
          )

          const data = await response.json()

          allImages.value = data?.htmlInferred?.images

          if (allImages.value.length > 0) {
              isModalImagesOpen.value = true
          }

          isLoading.value = false
      } catch (error) {
          console.error("Une erreur s'est produite lors de la récupération des données.", error)
          isLoading.value = false
      }
  }

}

const changeImage = (image) => {
  props.itemToUpdate.image = image
  isModalImagesOpen.value = false
}
</script>

<template>
  <div class="wrapper">

    <ModalItem v-if="isModalImagesOpen" @close-modal="() => isModalImagesOpen = false">
      <div class="modal__imgChoice">
        <img v-for="image in allImages" :src="image" alt="" @click="changeImage(image)" />
      </div>
    </ModalItem>

    <form class="gift gift--edit" @submit.prevent="submitForm">
      <div class="gift__left">
        <div class="gift__image">
          <img :src="props.itemToUpdate.image" alt="" v-if="props.itemToUpdate.image" />
          <IconNoPicture v-else />
        </div>
        <BtnDefault :border="true" size="tiny" @click.prevent="loadAllImages" v-if="props.itemToUpdate.link"
          >Modifier l'image</BtnDefault
        >
      </div>

      <div class="gift__right">
        <div class="gift--edit__content">
          <input
            type="text"
            placeholder="Lien"
            v-model.trim="props.itemToUpdate.link"
            @blur="fetchImageMeta"
          />
          <div class="gift__header">
            <input type="text" placeholder="Désignation" v-model.trim="props.itemToUpdate.title" />
          </div>
          <textarea
            placeholder="Description"
            v-model.trim="props.itemToUpdate.description"
            rows="3"
          ></textarea>
          <input type="text" placeholder="Prix" v-model.trim="props.itemToUpdate.price" />

          <div class="gift__buttons">
            <BtnDefault v-if="props.itemToUpdate.id">Modifier le cadeau</BtnDefault>
            <BtnDefault v-else>Ajouter à la liste</BtnDefault>
          </div>
        </div>
      </div>

      <div class="disabled" v-if="isLoading">
        <IconSpinner />
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.gift--edit {
  margin-top: var(--gap);
  position: relative;

  &__form {
    display: grid;
    grid-template-columns: 2fr 5fr;
    gap: 1rem;
    margin-bottom: var(--gap);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gift__left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .disabled {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(var(--color-primary-rgb), 0.2);
    border-radius: 0.5em;
    backdrop-filter: blur(0.2rem);

    .icon-spinner {
      position: absolute;
      width: 40px;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);

      svg {
        fill: var(--color-primary);
      }
    }
  }

  .gift__image {
    svg {
      transform: none;
    }
  }
}

.modal__imgChoice {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gap);

  img {
    width: 100%;
    aspect-ratio: 1;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
}
</style>
