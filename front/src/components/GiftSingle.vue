<script setup>
import BtnDefault from '@/components/BtnDefault.vue'
import { computed, ref } from 'vue'
import { deleteItem, deleteReservation, insertItem, reserveItem } from '@/apis/item'
import GiftReservationForm from "@/components/GiftReservationForm.vue";

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
</script>

<template>
  <div :class="`gift ${isDeleted ? 'deleted' : ''} ${props.item.isReserved ? 'reserved' : ''}`">
    <div class="gift__header">
      <h3>{{ props.item.title }}</h3>
      <BtnDefault
        v-if="props.item.link && !isDeleted"
        type="a"
        :href="props.item.link"
        target="_blank"
        size="tiny"
        :border="true"
        color="secondary"
        >Voir</BtnDefault
      >
    </div>

    <div v-if="props.item.description" class="gift__description">
      <p>{{ props.item.description }}</p>
    </div>

    <div v-if="props.isAdmin && !isDeleted" class="gift__edit">
      <BtnDefault color="red" size="tiny" :border="true" @click="deleteTheGift"
        >Supprimer</BtnDefault
      >
      <BtnDefault color="white" size="tiny" :border="true" @click="emit('updateItem', props.item)"
        >Modifier</BtnDefault
      >
    </div>

    <!-- Réservé -->
    <div v-if="!props.isAdmin && !isDeleted && props.item.isReserved">
      <p>Réservé par {{ reservationName }}</p>
    </div>

    <div v-if="!props.isAdmin && !isDeleted" class="gift__edit">
      <BtnDefault
        v-if="!props.item.isReserved"
        color="white"
        size="tiny"
        :border="true"
        @click="reserveTheItem"
        >Réserver</BtnDefault
      >
    </div>

    <div v-if="isDeleted" class="gift__deleted-message">
      <p>Cadeau supprimé !</p>
      <BtnDefault size="tiny" :border="true" @click="restoreItem"
        >Annuler la suppression</BtnDefault
      >
    </div>
  </div>

  <GiftReservationForm/>

</template>

<style scoped lang="scss">
.gift {
  --bg-color: var(--color-primary);
  --text-color: var(--color-white);

  transition: all ease-in-out 0.2s;
  padding: calc(var(--padding-global) / 2.6);
  background-color: var(--bg-color);
  border-radius: 10px;
  border: 2px solid var(--bg-color);
  color: var(--text-color);
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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

  &__header {
    display: flex;
    align-items: center;

    h3 {
      font-size: 1.7rem;
      line-height: 1.2em;
      flex-grow: 1;
    }

    .bt {
      margin-left: 15px;
      flex-shrink: 0;
      align-self: flex-start;
    }
  }

  &__description {
    font-size: 1.3rem;
    line-height: 1.2em;
    margin-top: 0.5rem;
  }

  &__edit {
    margin-top: 2rem;
    color: var(--color-white);
    display: inline-flex;
    align-items: center;

    form {
      margin-right: 0.8rem;
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
}
</style>
