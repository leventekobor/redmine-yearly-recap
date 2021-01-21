<template>
 <form @submit.prevent="getUser">
    <label for="api-token">Api token</label>
    <input v-model="apiKey" id="api-token" name="api-token" type="text">
    <button>Request review</button>
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
