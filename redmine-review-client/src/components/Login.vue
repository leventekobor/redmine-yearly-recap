<template>
  <h1 class="fade">Redmine yearly review</h1>
  <form @submit.prevent="getUser">
    <img :src='require(`../assets/stats.svg`)'>
    <div class="form-container">
      <label for="api-token">API kulcs</label>
      <input placeholder="API kulcs" v-model="apiKey" id="api-token" name="api-token" type="text">
      <button>Bejelentkezés</button>
    </div>
  </form>
  <div v-bind:class="{ active: isActive }" class="toast" id="errorToast">Sikertelen bejelentkezés</div>
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
    let isActive = ref(false)

    async function getUser() {
      try {
        const response = (await RedmineService.getUser(apiKey.value))
        user.value = response.data
        emit('userLoad', user);
      } catch (error) {
        isActive.value = true
        setTimeout(() => isActive.value = false, 2000)
        apiKey.value = ""
      }
    }

    return {
      apiKey,
      user,
      isActive,
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
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
}

.form-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: flex-start;
  align-items: normal;
  margin-top: 10px;
}

img {
  z-index: 0;
  margin-top: 170px;
}

.form-container > button {
  height: 30px;
  margin-top: 10px;
}

.form-container > label {
  display: flex;
}

.form-container > input {
  height: 20px;
}

.toast {
  position: fixed;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  visibility: hidden;
  min-width: 250px;
  max-width: 300px;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  background-color: #FF4D4F;
}

.active {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

</style>
