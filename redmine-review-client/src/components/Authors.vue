<template>
  <section class="authors" id="szerzok">
    <h2>Ki hozta létre a jegyet amivel foglalkoztál? 🔍</h2>
    <div class="authors-container">
     {{ authorNumbers }}
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    authorsCounts: Object
  },
  setup(props) {
    const authorNumbers = ref(props.authorsCounts)

    return {
      authorNumbers
    }
  }
}
</script>

<style>
.authors {
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0px 25px 25px 25px;
  align-items: center;
  background: white;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  transition: 1s;
}

.authors-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 120px;
}

.authors-container > div {
  transition: 1s;
}

.authors-container > div:hover {
  font-size: 20px;
  background-color: #1D4049;
  color: white;
  border-radius: 3px;
  padding: 5px;
}
</style>
