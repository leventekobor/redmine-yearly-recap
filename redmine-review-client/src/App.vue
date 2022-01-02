<template>
  <Login v-if="!apiKey" @userLoad="userData" />
  <Dashboard  v-else :apiKey="apiKey">
  </Dashboard>
</template>

<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

import { ref } from 'vue'
 
export default {
  name: 'app',
  components: {
    Login,
    Dashboard
  },

  setup () {
    let apiKey = ref()

    function userData(user) {
      apiKey.value = user.value.user.api_key
    }
 
    return {
      apiKey,
      userData
    }
  }
}
</script>



<style>

html, body, #q-app  {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #F8F9FF;
  scroll-behavior: smooth;
  font-size: 16px;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  z-index: 6;
  margin: auto;
  margin-top: 50px;
  animation: rotator 1.4s linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(270deg);}
}

.path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
}

@keyframes colors {
  0% {stroke: #4285f4;}
  25% {stroke: #de3e35;}
  50% {stroke: #f7c223;}
  75% {stroke: #1b9a59;}
  100% {stroke: #4285f4;}
}

@keyframes dash {
  0% {stroke-dashoffset: 187;}
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
    }
}
</style>
