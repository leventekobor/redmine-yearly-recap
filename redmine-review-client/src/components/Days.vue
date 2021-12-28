<template>
  <section class="days">
    <h2>Melyik nap voltál a legaktívabb? 📅</h2>
    <div class="days-container">
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
    daysCounts: Object
  },
  setup(props) {
    const daysNumbers = ref(Object.fromEntries(Object.entries(props.daysCounts).sort(([,a],[,b]) => a-b)))

    const chartOptions = {
      labels: Object.keys(daysNumbers.value)
    }
    const series = [{
      data: Object.values(daysNumbers.value)
      }]

    return {
      daysNumbers,
      chartOptions,
      series
    }
  }
}
</script>

<style>
.days-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 320px;
  transition: 1s;
}


.days-container > div {
  transition: 1s;
}

</style>
