<template>
    <h3>user profile</h3>
    <span>{{ redmineUser }}</span>
</template>


<script>
import { ref } from 'vue'
//import RedmineService from '@/services/RedmineService.js'

export default {
  name: "ConfirmUser",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    let redmineUser = ref ({})
    redmineUser.value = props
    console.log(props)
    console.log(redmineUser)

    return {
      redmineUser
    }
  }
}
</script>


<style>
    
</style>