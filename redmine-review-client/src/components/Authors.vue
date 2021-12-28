<template>
  <section class="authors">
    <h2>Ki hozta létre a jegyet amivel foglalkoztál? 🔍</h2>
    <div class="authors-container">
      <apexchart
      width="400"
      type="pie"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    authorsCounts: Object
  },
  setup(props) {
    const authorNumbers = ref(props.authorsCounts)

    const chartOptions = {
      labels: Object.keys(authorNumbers.value)
    }
    const series = Object.values(authorNumbers.value)

    return {
      authorNumbers,
      chartOptions,
      series
    }
  }
}
</script>

<style>
.authors-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 280px;
}

.authors-container > div {
  transition: 1s;
}
</style>
