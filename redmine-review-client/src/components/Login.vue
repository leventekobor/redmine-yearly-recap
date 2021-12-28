<template>
  <section class="login-container">
    <h2>Redmine yearly recap</h2>
    <form @submit.prevent="getUser" class="form-control">
      <q-input outlined  v-model="username" id="username" name="username" type="text"></q-input>
      <q-input outlined  v-model="password" id="password" name="password" type="password" autocomplete="on"></q-input>
      <div class="devider">
        <div class="line"></div>
        <p>Or with API key</p>
        <div class="line"></div>
      </div>
      <p class="info">Fill in API key for login. API key is available at the link below: <button class="as-link" @click="getAPILink">API key</button></p>
      <q-input outlined class="" v-model="apiKey" id="api-token" name="api-token" type="text" label="API key"></q-input>
      <button class="action">LOG IN</button>
    </form>
  </section>
</template>

<script>
import { ref } from 'vue'
import RedmineService from '@/services/RedmineService.js'

export default {
  name: "Login",
  emits: ["userLoad"],
  setup(_,{ emit }) {
    const apiKey = ref('')
    const username = ref('')
    const password = ref('')
    let user = ref('')
    let isActive = ref(false)

    async function getUser() {
      try {
        if(username.value && password.value) {
          let response = await RedmineService.getUserByPassword({
            "username": username.value, 
            "password": password.value 
          })
          user.value = response.data
          emit('userLoad', user);
        } else {
          const response = (await RedmineService.getUser(apiKey.value))
          user.value = response.data
          emit('userLoad', user);
        }
      } catch (error) {
          isActive.value = true
          setTimeout(() => isActive.value = false, 2000)
          apiKey.value = ""
          username.value = ""
          password.value = ""
      }
    }

    async function getAPILink() {
      const response = await RedmineService.getRedmineUrl()
      const apiKeyUrl = response.data + "/my/account"
      window.open(apiKeyUrl)
    }

    return {
      user,
      isActive,
      getUser,
      username,
      password,
      getAPILink,
      apiKey
    }
  }
}
</script>


<style lang="scss" scoped>
.login-container {
  display: flex;
  width: 37.5rem;
  height: 40rem;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);

  .form-control {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 28.125rem;
  }

  .hidden-text {
    -webkit-text-security: disc;
  }

  h2 {
    font-size: 2rem;
    line-height: 2.125rem;
    font-weight: 400;
    margin: 0px;
  }

  .as-link {
    border: none;
    background: transparent;
    color: darkblue;
    padding: 0px;
  }

  .devider {
    padding-block-start: 2rem;
    padding-block-end: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: #666;
      width: 100%;
      margin: 0px;
      padding-inline-start: 1rem;
      padding-inline-end: 1rem;
    }

    .line {
      border-bottom: 1px solid #666;
      width: 100%;
    }
  } 
}

@media screen and (max-width: 480px) {
  .login-container {
    width: 18rem;
  }
}


</style>
