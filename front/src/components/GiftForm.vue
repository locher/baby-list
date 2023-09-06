<script setup>

import { insertItem, updateItem } from '@/apis/item'
import {computed, reactive, ref} from 'vue'
import BtnDefault from "@/components/BtnDefault.vue";
import {OPENGRAPH_TOKEN} from "@/config/constants.js";
import IconNoPicture from "@/components/icons/IconNoPicture.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";

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
      price:'',
      image:''
    }
  }
})

// Emits
const emit = defineEmits(['giftAdded'])

// Refs
const item = reactive(props.itemToUpdate)
const isLoading = ref(false)

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
      price: formattedPrice.value,
        image: props.itemToUpdate.image
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

const fetchImageMeta = async () => {


    const regexURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

    // si l'url est pas vide et que c'est bien une url, on récupère les meta
    if(props.itemToUpdate.link && regexURL.test(props.itemToUpdate.link)){
        try {
            isLoading.value=true
            const encodedUrl=encodeURIComponent(props.itemToUpdate.link)

            const response = await fetch(`https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${OPENGRAPH_TOKEN}`);

            const data = await response.json();

            // Récupère le titre
            if(!props.itemToUpdate.title){ props.itemToUpdate.title = data?.openGraph?.title }

            // Récupère l'image
            props.itemToUpdate.image = data?.openGraph?.image?.url || ''

            // Récupère le prix
            if(!props.itemToUpdate.price){ props.itemToUpdate.price = data?.hybridGraph?.products[0]?.offers[0]?.price || '' }

            isLoading.value=false
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des données.', error);
            isLoading.value=false
        }
    }
}

</script>

<template>
    <div class="wrapper">


  <form class="gift gift--edit">

      <div class="gift__left">
          <div class="gift__image">
              <img :src="props.itemToUpdate.image" alt="" v-if="props.itemToUpdate.image">
              <IconNoPicture v-else />
          </div>
      </div>

      <div class="gift__right">
          <div class="gift--edit__content">
              <input type="text" placeholder="Lien" v-model.trim="props.itemToUpdate.link" @blur="fetchImageMeta"/>
              <div class="gift__header">
                  <input type="text" placeholder="Désignation" v-model.trim="item.title"/>
              </div>
              <textarea placeholder="Description" v-model.trim="props.itemToUpdate.description" rows="3"></textarea>
              <input type="text" placeholder="Prix" v-model.trim="props.itemToUpdate.price" />

              <div class="gift__buttons">
                  <BtnDefault v-if="props.itemToUpdate.id" @click.prevent="submitForm" :border="true">Modifier le cadeau</BtnDefault>
                  <BtnDefault v-else @click.prevent="submitForm" :border="true">Ajouter à la liste</BtnDefault>
              </div>
          </div>
      </div>

      <div class="disabled" v-if="isLoading">
          <IconSpinner/>
      </div>

  </form>
    </div>
</template>

<style lang="scss">
  .gift--edit{
      margin-top: var(--gap);
      position: relative;

      &__form{
          display: grid;
          grid-template-columns: 2fr 5fr;
          gap: 1rem;
          margin-bottom: var(--gap);
      }

      &__content{
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
      }

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

      .disabled{
          position: absolute;
          top: 0;
          left:0;
          height: 100%;
          width: 100%;
          background-color: rgba(var(--color-primary-rgb), .2);
          border-radius: .5em;
          backdrop-filter: blur(.2rem);

          .icon-spinner{
              position: absolute;
              width: 40px;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);

              svg{
                  fill: var(--color-primary);
              }
          }
      }

      .gift__image{
          svg{
              transform: none;
          }
      }
  }


</style>
