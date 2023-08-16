<script setup>
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import BtnDefault from '@/components/BtnDefault.vue'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header>
    <p>Salut {{ authStore.currentUser?.name }} !</p>

    <nav>
      <ul>
        <li><RouterLink to="/me">Ma liste</RouterLink></li>
        <li><RouterLink to="/chépas">Mes autres listes</RouterLink></li>
        <li><RouterLink to="/users">Voir toutes les listes</RouterLink></li>
      </ul>
    </nav>

    <BtnDefault @click="logout" :border="true" class="btn">Me déconnecter</BtnDefault>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-primary);
  padding: 1em 0;
  margin-bottom: 1em;
}

nav {
  display: contents;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  font-size: 0.8em;

  ul {
    display: contents;
    list-style-type: none;
  }

  a {
    transition: all ease-in-out 0.3s;
    text-shadow: 0 0 4rem transparent;
    color: inherit;
    text-decoration: none;
    padding: 0.5em;

    &:hover {
      text-shadow: 0 0 4rem rgba(var(--color-primary-rgb), 0.7);
    }

    &[aria-current='page'] {
      font-weight: bolder;
      text-shadow: 0 0 4rem rgba(var(--color-primary-rgb), 0.7);
    }
  }
}

.btn {
  font-size: 0.6em;
  border-width: 1px;
}
</style>
