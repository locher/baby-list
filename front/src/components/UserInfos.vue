<script setup>
// Props
import { computed, ref } from 'vue'
import IlluBaby from '@/components/icons/IlluBaby.vue'
import IconBlob from '@/components/icons/IconBlob.vue'
import IconBaby from '@/components/icons/IconBaby.vue'
import BtnDefault from '@/components/BtnDefault.vue'
import ModalItem from '@/components/ModalItem.vue'
import UserForm from '@/components/UserForm.vue'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: {}
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  }
})

// Refs
const isEditFormOpen = ref(false)

// Computed
const formatedDescription = computed(() => {
  const paragraphs = props.user.description.split('\n')
  return paragraphs
    .map((paragraph) => {
      return paragraph.length > 1 ? `<p>${paragraph}</p>` : ''
    })
    .join('')
})

// Methods
const openEditForm = () => {
  isEditFormOpen.value = true
}

const userUpdated = (data) => {
  isEditFormOpen.value = false
  props.user.birthday_date = new Date(data.birthdayDate.value)
  props.user.description = data.description.value
}
</script>

<template>
  <div class="header wrapper">
    <div class="header__illustration">
      <IconBlob class="header__illustration__background" />
      <IlluBaby class="header__illustration__img" />
    </div>
    <div class="header__content">
      <h1>Liste de naissance <span v-if="isAdmin" class="header__content__admin">admin</span></h1>
      <div class="header__content__date">
        <IconBaby />
        <span>{{ user.birthdayDate }}</span>
      </div>
    </div>
  </div>

  <div class="description wrapper">
    <div v-if="user.description" v-html="formatedDescription" class="description__content"></div>
    <BtnDefault
      v-if="isAdmin"
      class="description__edit"
      size="tiny"
      :border="true"
      @click="openEditForm()"
      >Modifier les infos</BtnDefault
    >
  </div>

  <ModalItem
    :isOpen="isEditFormOpen"
    v-if="isEditFormOpen"
    @close-modal="
      () => {
        isEditFormOpen = false
      }
    "
  >
    <UserForm
      :birthday-date="user.birthday_date"
      :description="user.description"
      @user-updated="
        (data) => {
          userUpdated(data)
        }
      "
    />
  </ModalItem>
</template>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  gap: 2rem;

  &__illustration {
    position: relative;
    flex-shrink: 0;
    margin-top: 2rem;
    transform: scale(0.85);

    &__background {
      fill: var(--color-primary);
      position: absolute;
      left: -55%;
      top: -20%;
      z-index: -1;
      transform: scale(1.7);
    }
  }

  &__content {
    h1 {
      line-height: 1;
      font-size: 4rem;
    }

    &__date {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      color: var(--color-secondary);

      svg {
        stroke: var(--color-primary);
        fill: var(--color-primary);
        width: 2rem;
        height: auto;
      }
    }

    &__admin {
      font-size: 0.5em;
      background-color: var(--color-red);
      color: var(--color-white);
      padding: 0.3em 0.5em;
      border-radius: 0.5em;
      display: inline-flex;
    }
  }
}

.description {
  margin-top: 2.5rem;
  color: var(--color-secondary);

  &__content {
    p + p {
      margin-top: 0.8em;
    }
  }

  &__edit {
    margin-top: 2rem;
  }
}
</style>
