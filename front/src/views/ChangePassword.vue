<script setup>

import BtnDefault from "@/components/BtnDefault.vue";
import { ref } from "vue";
import {useRoute} from "vue-router";
import {changePassword} from "@/apis/login.js";
import router from "@/router/index.js";

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
    <div class="wrapper">
        <form @submit.prevent="changePasswordSubmit">
            <h1>Changer mon mot de passe</h1>

            <div class="form__single">
                <label for="password" class="form__label">Nouveau mot de passe</label>
                <input type="password" autofocus v-model.trim="password"/>
            </div>

            <div class="footer">
                <BtnDefault>Modifier mon mot de passe</BtnDefault>
                <p v-if="error" v-html="error" class="error"></p>
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
