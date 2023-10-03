<script setup>
import BtnDefault from '@/components/BtnDefault.vue'
import { ref } from 'vue'
import { getLogin } from '@/apis/login.js'
import { useAuthStore } from '@/stores/auth.js'
import router from '@/router/index.js'
import BtnLink from '@/components/BtnLink.vue'
import LoginFormTemplate from '@/components/LoginFormTemplate.vue'

// Refs
const email = ref()
const password = ref()
const error = ref()

const auth = useAuthStore()

// Methods
const login = async () => {
  if (!email.value || email.value === '' || !password || password.value === '') {
    error.value = 'Email et mot de passe obligatoire&nbsp;!'
    return
  }

  const loginResult = await getLogin(email.value, password.value)
  const token = loginResult[0]?.token

  // If connection is impossible
  if (!loginResult) {
    error.value = 'Connexion impossible, réessaie plus tard et préviens Loïc&nbsp;!'
  }

  // Of email or password is wrong
  else if (loginResult.length === 0) {
    error.value = 'E-mail ou mot de passe incorrect'
  }

  // If login is correct
  else {
    if (token) {
      auth.login(token, email.value)
      await router.push({ name: 'admin' })
    }
  }
}

const passwordLost = () => {
  router.push({ name: 'passwordForgot' })
}
</script>

<template>
  <LoginFormTemplate @keydown.enter.prevent="login">
    <template #title>Connexion à l'administration</template>
    <template #inputs>
      <div class="form__single">
        <label for="email" class="form__label">E-mail</label>
        <input type="email" autofocus v-model.trim="email" />
      </div>

      <div class="form__single">
        <label for="password" class="form__label">Mot de passe</label>
        <input type="password" v-model.trim="password" />
        <BtnLink
          @click.prevent="passwordLost"
          @keydown.enter.prevent="null"
          class="password--forget"
          >Mot de passe oublié ?</BtnLink
        >
      </div>
    </template>

    <template #footer>
      <BtnDefault :isSubmit="true" @click.prevent="login">Me connecter</BtnDefault>
      <p v-if="error" v-html="error" class="error"></p>
    </template>
  </LoginFormTemplate>
</template>

<style lang="scss" scoped>
.password--forget {
  margin-top: 0.5em;
}
</style>
