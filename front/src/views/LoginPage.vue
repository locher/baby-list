<script setup>
  import BtnDefault from "@/components/BtnDefault.vue";
  import {ref} from "vue";
  import {getLogin} from "@/apis/login.js";
  import {useAuthStore} from "@/stores/auth.js";
  import router from "@/router/index.js";

  // Refs
  const email = ref()
  const password = ref()
  const error = ref()

  const auth = useAuthStore()

  // Methods
  const login = async () => {
      const loginResult = await getLogin(email.value, password.value)
      const token = loginResult[0]?.token

      // If connection is impossible
      if (!loginResult){
          error.value = 'Connexion impossible, réessaie plus tard :('
      }

      // Of email or password is wrong
      else if(loginResult.length === 0) {
          error.value = 'E-mail ou mot de passe incorrect'
      }

      // If login is correct
      else {
          if(token){
              auth.login(token, email.value)
              await router.push({name: 'admin'})
          }
      }

  }

</script>

<template>
    <form @submit.prevent="login">
        <div class="form__single">
            <label for="email" class="form__label">E-mail</label>
            <input type="email" v-model.trim="email"/>
        </div>

        <div class="form__single">
            <label for="password" class="form__label">Mot de passe</label>
            <input type="password" v-model.trim="password"/>
        </div>

        <BtnDefault>Me connecter</BtnDefault>

        <p v-if="error">{{ error }}</p>
    </form>
</template>

<style lang="scss"></style>
