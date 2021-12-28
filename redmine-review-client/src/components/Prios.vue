<template>
  <section class="prios">
    <h2>Milyen prioritású feladatokon dolgoztál? ✈</h2>
    <div class="prios-container">
      <apexchart
      width="520"
      type="bar"
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
    priorityCounts: Object
  },
  setup(props) {
    const priosNumbers = ref(props.priorityCounts)

    const chartOptions = {
      labels: Object.keys(priosNumbers.value)
    }
    const series = [{
      data: Object.values(priosNumbers.value)
      }]

    return {
      priosNumbers,
      chartOptions,
      series
    }
  }
}
</script>

<style>
.prios-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 320px;
}

.prios-container > div {
  transition: 1s;
}

</style>
