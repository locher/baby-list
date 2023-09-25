<script setup>

import BtnDefault from "@/components/BtnDefault.vue";
import {ref} from "vue";
import {requestPassword} from "@/apis/login.js";
import LoginForm from "@/views/LoginForm.vue";
import LoginFormTemplate from "@/components/LoginFormTemplate.vue";

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

    <LoginFormTemplate @submit.prevent="resetPassword">
        <template #title>Mot de passe oublié ?</template>

        <template #inputs>
            <div class="form__single">
                <label for="email" class="form__label">E-mail</label>
                <input type="email" autofocus v-model.trim="email"/>
            </div>
        </template>

        <template #footer>
            <BtnDefault>Réinitialiser mon mot de passe</BtnDefault>
            <p v-if="error" v-html="error" class="error"></p>
            <p v-if="validation" class="valid">Un email t'a été envoyé !</p>
        </template>
    </LoginFormTemplate>
</template>
