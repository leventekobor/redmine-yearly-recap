<template>
  <section class="login-container">
    <img :src='require(`../../public/tigra.png`)'/>
    <h2>Redmine {{ year }} Összefoglaló</h2>
    <form @submit.prevent="getUser" class="form-control">
      <q-input outlined v-model="username" id="username" name="username" type="text" label="Felhasználónév" autocomplete="username"/>
      <q-input outlined v-model="password" id="password" name="password" :type="isPwd ? 'password' : 'text'" autocomplete="new-password" label="Jelszó">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <button class="action">Bejelentkezés</button>
    </form>
  </section>
  <div v-bind:class="{ active: isActive }" class="toast" id="errorToast">Bejelentkezés sikertelen</div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: "Login",
  emits: ["userLoad"],
  setup(_,{ emit }) {
    const username = ref('')
    const password = ref('')
    let user = ref('')
    let isActive = ref(false)
    let isPwd = ref(true)
    let RedmineService
    let year = process.env.VUE_APP_YEAR

    watch(username, (username) => {
      if(username.length > 0 && typeof RedmineService === 'undefined') {
        import('../services/RedmineService.js').then(val => {
          RedmineService = val.default
        })
      }
    })
    
    async function getUser() {
      try {
          let response = await RedmineService.getUserByPassword({
            "username": username.value, 
            "password": password.value 
          })
          user.value = response.data
          emit('userLoad', user);
      } catch (error) {
          isActive.value = true
          setTimeout(() => isActive.value = false, 2000)
          username.value = ""
          password.value = ""
      }
    }

    return {
      isActive,
      getUser,
      username,
      password,
      isPwd,
      year
    }
  }
}
</script>


<style lang="scss" scoped>
.login-container {
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  width: 29.5rem;
  height: 30rem;
  border-radius: 10px;
  padding: 2.25rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);

  img {
    height: 1.5rem;
    width: fit-content;
  }

  .form-control {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-block-start: 2rem;
    height: 100%;
    
    button {
      cursor: pointer;
      display:inline-block;
      padding: 0.35em 1.2em;
      height: 2.75rem;
      border: none;
      margin-top: 5px;
      border-radius: 3px;
      box-sizing: border-box;
      text-decoration:none;
      font-weight:300;
      color:#FFF;
      text-align:center;
      background-color: #084c61;
      transition: all 1s;
    }
    button:disabled {
      cursor: wait;
    }
    button:hover{
      color:#FFF;
      background-color:#2b9348;
    }
  }

  .hidden-text {
    -webkit-text-security: disc;
  }

  h2 {
    padding-block-start: 1rem;
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

@media screen and (max-width: 560px) {
  .login-container {
    width: 20rem;

    .form-control {
      width: 16rem;
    }
  }
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
  background-color: #e76f51;
}

.active {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
  z-index: 5;
}

</style>
