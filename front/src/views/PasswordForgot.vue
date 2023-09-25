<script setup>

import BtnDefault from "@/components/BtnDefault.vue";
import {ref} from "vue";
import {requestPassword} from "@/apis/login.js";

// Refs
const email = ref('')
const error = ref('')
const validation = ref(false)

// Methods
const resetPassword = async () => {
    if(email.value !== ''){

        const req = await requestPassword(email.value)

        // Le mail n'existe pas
        if(!req?.emailExist){
            error.value = 'Cet email n\'existe pas'
        }

        // Le mail existe et le reset a bien été envoyé
        if(req?.emailExist && !!req?.message){
            validation.value = true
            email.value = ''
        }

    }

    // Le mail n'est pas renseigné
    else{
        error.value = 'L\'email est obligatoire'
    }
}

</script>

<template>
    <div class="wrapper">
        <form @submit.prevent="resetPassword">
            <h1>Mot de passe oublié ?</h1>

            <div class="form__single">
                <label for="email" class="form__label">E-mail</label>
                <input type="email" autofocus v-model.trim="email"/>
            </div>

            <div class="footer">
                <BtnDefault>Réinitialiser mon mot de passe</BtnDefault>
                <p v-if="error" v-html="error" class="error"></p>
                <p v-if="validation" class="valid">Un email t'a été envoyé !</p>
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

    .error{
        font-weight: 500;
        font-size: .9em;
        color: var(--color-red);
    }

    .valid{
        font-weight: 500;
        font-size: .9em;
    }
}

</style>
