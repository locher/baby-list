<script setup>
import BtnDefault from '@/components/BtnDefault.vue'
import { computed, ref } from 'vue'
import { deleteItem, insertItem } from '@/apis/item'
import GiftReservationForm from '@/components/GiftReservationForm.vue'
import PriceRange from '@/components/PriceRange.vue'
import IconNoPicture from '@/components/icons/IconNoPicture.vue'
import ModalItem from '@/components/ModalItem.vue'

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
  },
  isPreview: {
    type: Boolean,
    default: false
  }
})

// Refs
const isDeleted = ref(false)
const isReserveForm = ref(false)

// Methods
const deleteTheGift = async () => {
  isDeleted.value = true

  // si problème lors de la suppression
  if (!(await deleteItem(props.item?.id))) {
    isDeleted.value = false
  }
}

const restoreItem = async () => {
  await insertItem(props.item)
  isDeleted.value = false
}

const reserveTheItem = async () => {
  isReserveForm.value = true
}

const reservationDone = (args) => {
  isReserveForm.value = false
  props.item.reservation_name = args.reservation_name
}

// Computed

const priceRange = computed(() => {
  if (props.item.price < 30) return 1
  else if (props.item.price >= 30 && props.item.price < 100) return 2
  else if (props.item.price >= 100) return 3
})
</script>

<template>
  <div :class="`gift ${isDeleted ? 'deleted' : ''} ${props.item.isReserved ? 'reserved' : ''}`">
    <div class="gift__left">
      <div class="gift__image">
        <img :src="props.item.image" alt="" v-if="props.item.image" />
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
        <p v-if="props.item.description" class="gift__description">
          {{ props.item.description }}
        </p>
      </div>

      <div v-if="props.isAdmin && !isDeleted" class="gift__edit">
        <BtnDefault color="red" size="tiny" :border="true" @click="deleteTheGift"
          >Supprimer</BtnDefault
        >
        <BtnDefault size="tiny" :border="true" @click="emit('updateItem', props.item)"
          >Modifier</BtnDefault
        >
      </div>

      <div v-if="!props.isAdmin && !isDeleted && !isPreview" class="gift__edit">
        <BtnDefault v-if="!props.item.isReserved" @click="reserveTheItem" :border="true"
          >Réserver</BtnDefault
        >
        <PriceRange :range="priceRange" v-if="props.item.price > 0 && !props.item.isReserved" />
      </div>

      <!-- Réservé -->
      <div v-if="!isDeleted && props.item.isReserved">
        <p class="reserved__message">Réservé par {{ item?.reservation_name }}</p>
      </div>
    </div>

    <div v-if="isDeleted" class="gift__deleted-message">
      <p>Cadeau supprimé !</p>
      <BtnDefault size="tiny" :border="true" @click="restoreItem"
        >Annuler la suppression</BtnDefault
      >
    </div>
  </div>

  <ModalItem
    :isOpen="isReserveForm"
    v-if="isReserveForm"
    class="gift__modalResa"
    @close-modal="isReserveForm = false"
  >
    <h2 class="gift__modalResa__title">
      Réserver <span>{{ props.item.title }}</span>
    </h2>
    <GiftReservationForm
      class="gift__modalResa__form"
      :item="item"
      @reservation-done="(args) => reservationDone(args)"
    />
    <GiftSingle :item="props?.item" :isPreview="true" class="gift__modalResa__gift" />
  </ModalItem>
</template>

<style lang="scss">
.gift {
  --bg-color: rgba(var(--color-primary-rgb), 0.1);
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

  &--edit {
    border: 2px solid var(--color-primary);
  }

  &.deleted {
    > :not(.gift__deleted-message) {
      filter: grayscale(1);
    }

    background-color: var(--color-disabled-bg);
  }

  &.reserved {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);

    .gift__title,
    .gift__left {
      opacity: 0.4;
    }
  }

  .reserved__message {
    background-color: var(--color-primary);
    color: var(--color-white);
    display: inline-flex;
    padding: 0.2em 0.4em;
    margin-top: 1rem;
  }

  &__content {
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

    .priceRange {
      flex-grow: 1;
      justify-content: right;
    }
  }

  &__deleted-message {
    display: flex;
    align-items: center;
    gap: 2rem;
    grid-column-start: 1;
    grid-column-end: 3;

    p {
      color: var(--color-primary);
      flex: 1;
    }
  }

  &__title {
    font-weight: 400;
    line-height: 1.35;
    font-size: var(--p-font-size);
    color: var(--color-secondary);
  }

  &__description {
    font-weight: 300;
    line-height: 1.4em;
    margin-top: 0.3em;
    color: var(--color-secondary);
    font-size: 0.85em;
  }

  &__image {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    background-color: var(--bg-color);
    border-radius: 1rem;
    overflow: hidden;
    display: flex;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    svg {
      margin: auto;
      width: 6rem;
      height: 3rem;
    }

    a {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.gift__modalResa {
  &__title {
    font-size: 2em;
    font-weight: 700;
    margin-bottom: 3rem;
    line-height: 1em;

    span {
      font-weight: 300;
      font-size: 0.8em;
    }
  }

  &__form {
    margin-bottom: 3rem;
  }
}
</style>
