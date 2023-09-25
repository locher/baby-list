<script setup>

import BtnDefault from "@/components/BtnDefault.vue";
import { ref } from "vue";
import {useRoute} from "vue-router";
import {changePassword} from "@/apis/login.js";
import router from "@/router/index.js";
import LoginFormTemplate from "@/components/LoginFormTemplate.vue";

const route = useRoute()
const uuid = route?.params?.uuid

// Refs
const password = ref('')
const error = ref('')

// Methods
const changePasswordSubmit = async () => {

    const rep = await changePassword(password.value, uuid)

    if(rep?.error){
        error.value = rep.errorReason
    }else{
        router.push({name: 'login'})
    }

}

</script>

<template>
    <LoginFormTemplate @submit.prevent="changePasswordSubmit">
        <template #title>Changer mon mot de passe</template>
        <template #inputs>
            <div class="form__single">
                <label for="password" class="form__label">Nouveau mot de passe</label>
                <input type="password" autofocus v-model.trim="password"/>
            </div>
        </template>
        <template #footer>
            <BtnDefault>Modifier mon mot de passe</BtnDefault>
            <p v-if="error" v-html="error" class="error"></p>
        </template>
    </LoginFormTemplate>
</template>
