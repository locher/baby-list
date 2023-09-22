import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {checkToken} from "@/apis/login.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: useLocalStorage('token', ''), email: useLocalStorage('email', '')
    }), actions: {
        login(token, email) {
            this.token = token
            this.email = email
            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
        }, logout() {
            this.token = ''
            this.email = ''
            localStorage.removeItem('token')
            localStorage.removeItem('email')
        }, async isAdmin() {

            // Si pas de token ou d'email, pas admin
            if (!this.token || !this.email) {
                return false
            }

            try {
                const result = await checkToken(this.token);
                return result === this.email;

            } catch (err) {
                return false;
            }
        }
    }
})
