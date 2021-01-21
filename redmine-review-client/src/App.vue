<template>
  <h1>Redmine yearly review</h1>
  <Login v-if="!loggedInUser" @userLoad="userData" />
  <article  v-else>
    <div class="circle">
      {{ (loggedInUser.firstname)[0] }}  {{ (loggedInUser.lastname)[0] }}
    </div>
    user: {{ loggedInUser }}
  </article>
</template>

<script>
import Login from './components/Login.vue'
import { ref } from 'vue'
 
export default {
  name: 'app',
  components: {
    Login
  },

  setup () {
    let loggedInUser = ref()

    function userData(user) {
      loggedInUser.value = {...user.value.user}
      console.log(loggedInUser)
    }

    return {
      loggedInUser,
      userData
    }
  }
}
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form {
  height: 100%;
  padding: 10px;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: center;
  align-items: center;
}

.circle {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  font-size: 10px;
  color: #fff;
  text-align: center;
  background: #000
}
</style>
