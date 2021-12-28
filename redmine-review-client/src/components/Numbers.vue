<template>
  <section class="numbers">
    <h2>2020-ban összesen {{issueNumbers}} jeggyel foglalkoztál! 🏆</h2>
    <div class="numbers-container">
      <div>
        <h3>{{ Math.ceil(issueNumbers /  254)}} 🏁</h3>
          issue naponta
      </div>
      <div>
        <h3>{{ Math.ceil(issueNumbers /  52) }} 🏁</h3>
          issue hetente
      </div>
      <div>
        <h3>{{ Math.ceil(issueNumbers /  12) }} 🏁</h3>
        issue havonta
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    issueCount: Number
  },
  setup(props) {
    const issueNumbers = ref(props.issueCount)

    return {
      issueNumbers
    }
  }
}
</script>

<style>
.numbers-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 120px;
}

.numbers-container > div {
  transition: 1s;
}

.numbers-container > div:hover {
  font-size: 20px;
  background-color: #1D4049;
  color: white;
  border-radius: 3px;
  padding: 5px;
}
</style>
