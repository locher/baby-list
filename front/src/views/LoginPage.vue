<script setup>
  import BtnDefault from "@/components/BtnDefault.vue";
  import {ref} from "vue";
  import {getLogin} from "@/apis/login.js";
  import {useAuthStore} from "@/stores/auth.js";
  import router from "@/router/index.js";
  import BtnLink from "@/components/BtnLink.vue";

  // Refs
  const email = ref()
  const password = ref()
  const error = ref()

  const auth = useAuthStore()

  // Methods
  const login = async () => {

      if (!email.value || email.value === '' || !password || password.value === ''){
          error.value = 'Email et mot de passe obligatoire&nbsp;!'
          return
      }

      const loginResult = await getLogin(email.value, password.value)
      const token = loginResult[0]?.token

      // If connection is impossible
      if (!loginResult){
          error.value = 'Connexion impossible, réessaie plus tard et préviens Loïc&nbsp;!'
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
    <div class="wrapper">
        <form @submit.prevent="login">
            <h1>Connexion à l'administration</h1>

            <div class="form__single">
                <label for="email" class="form__label">E-mail</label>
                <input type="email" autofocus v-model.trim="email"/>
            </div>

            <div class="form__single">
                <label for="password" class="form__label">Mot de passe</label>
                <input type="password" v-model.trim="password"/>
                <BtnLink @click.prevent="router.push({name:'passwordForgot'})" class="password--forget">Mot de passe oublié ?</BtnLink>
            </div>

            <div class="footer">
                <BtnDefault>Me connecter</BtnDefault>
                <p v-if="error" v-html="error"></p>
            </div>


        </form>
    </div>
</template>

<style lang="scss" scoped>
h1{
    margin-bottom: 1em;
}

.wrapper{
    margin: auto;
    min-height: 100vh;
    display: flex;
}

form{
    margin: auto;
    width: 100%;
    max-width: 50rem;
}

.footer{
    display: flex;
    align-items: center;
    gap: var(--gap);

    p{
        font-weight: 500;
        font-size: .9em;
        color: var(--color-red);
    }
}

.password--forget{
    margin-top: .5em;
}

</style>
