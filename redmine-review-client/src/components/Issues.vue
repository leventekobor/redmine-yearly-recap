<template>
  <article class="issues-container">
    <header>
      <h2> {{ redmineIssues.length }} </h2>
      <p>különböző jegyen dolgoztál</p>
    </header>
  </article>
</template>

<script>
import { ref } from 'vue'
//import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'Issues',
  components: {
    //apexchart: VueApexCharts,
  },
  props: {
    issues: Array
  },
  setup(props) {
    let redmineIssues = ref(props.issues)

    return {
      redmineIssues
    }
  }
}
</script>

<style lang="scss" scoped>
.issues-container {
  h2 {
    margin-block: 0rem;
  }

  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

</style>
