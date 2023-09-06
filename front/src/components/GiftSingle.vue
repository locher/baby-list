<script setup>
import BtnDefault from '@/components/BtnDefault.vue'
import { computed, ref } from 'vue'
import { deleteItem, deleteReservation, insertItem, reserveItem } from '@/apis/item'
import GiftReservationForm from "@/components/GiftReservationForm.vue";
import PriceRange from "@/components/PriceRange.vue";
import IconNoPicture from "@/components/icons/IconNoPicture.vue";

// Emits
const emit = defineEmits(['updateItem'])

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// Refs
const isDeleted = ref(false)

// Methods
const deleteTheGift = async () => {
  isDeleted.value = true

  if (await deleteItem(props.item?.id)) {
    console.log('gift deleted')
  } else {
    console.error('gift pas deleted')
    isDeleted.value = false
  }
}

const restoreItem = async () => {
  await insertItem(props.item)
  isDeleted.value = false
}

const reserveTheItem = async () => {
  console.log('reserve item')
}

const cancelReservation = async () => {
  await deleteReservation(props.item)
  props.item.id_user_reservation = null
}

// Computed

const isReservedByAuthUser = computed(() => {
  return props.item.id_user_reservation === authStore.currentUser.id
})

const isReservedByOther = computed(() => {
  return props.item.id_user_reservation !== authStore.currentUser.id
})

const reservationName = computed(() => {
  // Pas réservé
  if (!props.item.isReserved) return false

  // Réservé par guest
  if (props.item.guest_name) return props.item.guest_name

  // Réservé par moi
  if (isReservedByAuthUser.value) {
    return 'moi'
  }

  // Réservé par un autre
  if (isReservedByOther.value) {
    return usersStore.users.filter((user) => user.id === props.item.id_user_reservation)[0]?.name
  }
})

const priceRange = computed(() => {
    if (props.item.price < 30) return 1;
    else if (props.item.price >= 30 && props.item.price < 100) return 2;
    else if (props.item.price >= 100) return 3;
});

</script>

<template>
  <div :class="`gift ${isDeleted ? 'deleted' : ''} ${props.item.isReserved ? 'reserved' : ''}`">

    <div class="gift__left">
        <div class="gift__image">
            <img :src="props.item.image" alt="" v-if="props.item.image">
            <IconNoPicture v-else />
            <BtnDefault
                    v-if="props.item.link && !isDeleted"
                    type="a"
                    :href="props.item.link"
                    target="_blank"
                    size="tiny"
            >Voir</BtnDefault
            >
        </div>
    </div>

    <div class="gift__right">
            <div class="gift__content">
                <h3 class="gift__title">{{ props.item.title }}</h3>
                <p v-if="props.item.description" class="gift__description">{{ props.item.description }}</p>
            </div>

            <div v-if="props.isAdmin && !isDeleted" class="gift__edit">
                <BtnDefault color="red" size="tiny" :border="true" @click="deleteTheGift"
                >Supprimer</BtnDefault
                >
                <BtnDefault size="tiny" :border="true" @click="emit('updateItem', props.item)"
                >Modifier</BtnDefault
                >
            </div>

            <div v-if="!props.isAdmin && !isDeleted" class="gift__edit">
                <BtnDefault
                        v-if="!props.item.isReserved"
                        @click="reserveTheItem"
                        :border="true"
                >Réserver</BtnDefault
                >
                <PriceRange :range="priceRange" v-if="props.item.price > 0"/>
            </div>
    </div>

    <!-- Réservé -->
    <div v-if="!props.isAdmin && !isDeleted && props.item.isReserved">
      <p>Réservé par {{ reservationName }}</p>
    </div>

    <div v-if="isDeleted" class="gift__deleted-message">
      <p>Cadeau supprimé !</p>
      <BtnDefault size="tiny" :border="true" @click="restoreItem"
        >Annuler la suppression</BtnDefault
      >
    </div>
  </div>

  <GiftReservationForm style="display: none"/>

</template>

<style lang="scss">
.gift {
  --bg-color: rgba(var(--color-primary-rgb), .1);
  --text-color: var(--color-primary);
  --border-color: transparent;

  transition: all ease-in-out 0.2s;
  padding: var(--gap);
  background-color: var(--bg-color);
  border-radius: 10px;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  flex-shrink: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 14rem auto;
  gap: var(--gap);

  &.deleted {
    --bg-color: var(--color-disabled-bg);
    --text-color: var(--color-disabled-text);
  }

  &.reserved {
    background-color: transparent;
    color: var(--color-primary);

    .border-pink-bt {
      color: var(--color-primary) !important;
    }
  }

  &__content{
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  &__edit {
    color: var(--color-white);
    display: flex;
    align-items: center;
    margin-top: 1rem;

    form {
      margin-right: 0.8rem;
    }

    .priceRange{
      flex-grow: 1;
      justify-content: right;
    }
  }

  &__deleted-message {
    display: flex;
    align-items: center;
    gap: 2rem;

    p {
      color: var(--color-primary);
      flex: 1;
    }
  }

  &__title{
    font-weight: 400;
    line-height: 1.35;
  }

  &__description{
    font-weight: 300;
    line-height: 1.4em;
    margin-top: .3em;
  }

  &__image{
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    background-color: var(--bg-color);
    border-radius: 1rem;
    overflow: hidden;
    display: flex;

    img{
      object-fit: cover;
      width: 100%;
      height: 100%;

    }

    svg{
      margin: auto;
      width: 6rem;
      height: 3rem;
    }

    a{
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
