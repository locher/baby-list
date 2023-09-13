<script setup>
  import BtnDefault from "@/components/BtnDefault.vue";
  import {ref} from "vue";
  import {reserveItem} from "@/apis/item.js";

  // Props
  const props = defineProps({
      item: {
          type: Object,
          required: true
      }
  })

  // Refs
  const name = ref()
  const email = ref()

  // Methods
  const submitReserveItem = async () => {
      if(name.value !== '' && email.value !== ''){
          await reserveItem(props.item?.id, name.value, email.value, props.item?.title)
      }
  }

</script>

<template>
    <form>
        <div class="form__single">
            <label for="" class="form__label">Ton nom ?</label>
            <input type="text" class="form__input" v-model.trim="name">
        </div>

        <div class="form__single">
            <label for="" class="form__label">Ton mail ?</label>
            <input type="email" class="form__input" v-model.trim="email">
            <span class="form__notice">Pour valider ou annuler la réservation</span>
        </div>

        <BtnDefault @click.prevent="submitReserveItem">Réserver</BtnDefault>
    </form>
</template>

<style scoped lang="scss">
    .form{
        &__single{
            margin-bottom: 1em;
        }

        &__label{
            display: block;
            font-size: 1.2em;
            margin-bottom: .2em;
        }

        &__input{

        }

        &__notice{
            display: block;
            font-size: .8em;
            margin-top: .3em;
        }
    }
</style>
