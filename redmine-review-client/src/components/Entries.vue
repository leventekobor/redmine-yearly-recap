<template>
  <section class="entries">
    <h2>2020-ban összesen {{ Object.keys(timeEntries).length }}  alkalommal rögzítettél időt ❤</h2>
    <div class="entries-container">
      <div>
        
         
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    timeEntriesCount: Object
  },
  setup(props) {
    const timeEntries = ref(props.timeEntriesCount)
    console.log(Object.keys(timeEntries).length)

    return {
      timeEntries
    }
  }
}
</script>

<style scoped>
section {
  width: 520px;
}

.entries-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 120px;
}

.entries-container > div {
  transition: 1s;
}

.entries-container > div:hover {
  font-size: 20px;
  background-color: #1D4049;
  color: white;
  border-radius: 3px;
  padding: 5px;
}
</style>
