<template>
  <h1 class="fade">Redmine yearly review</h1>
  <form @submit.prevent="getUser">
    <img :src='require(`../assets/computer.svg`)'>
    <div class="form-container">
      <label for="api-token">API kulcs</label>
      <input placeholder="API kulcs" v-model="apiKey" id="api-token" name="api-token" type="text">
      <button>Bejelentkezés</button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import RedmineService from '@/services/RedmineService.js'

export default {
  name: "Login",
  emits: ["userLoad"],
  setup(_,{ emit }) {
    const apiKey = ref('')
    let user = ref('')

    async function getUser() {
      user.value = (await RedmineService.getUser(apiKey.value)).data
      emit('userLoad', user);
    }

    return {
      apiKey,
      user,
      getUser
    }
  }
}
</script>

<style>
form {
  height: 100%;
  padding: 10px;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.form-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 300px;
}

img {
  z-index: 0;
}

form > button {

}

form > label {

}

form > input {
  
}
</style>
