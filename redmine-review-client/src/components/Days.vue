<template>
  <section class="days">
    <h2>Melyik nap vagy a legaktívabb? 📅</h2>
    <div class="days-container">
      <apexchart
      width="420"
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
    const daysNumbers = ref(props.daysCounts)

    const chartOptions = {
      labels: Object.keys(daysNumbers.value)
    }
    const series = Object.values(daysNumbers.value)

    return {
      daysNumbers,
      chartOptions,
      series
    }
  }
}
</script>

<style>
.days {
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

.days-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 220px;
}

.days-container > div {
  transition: 1s;
}

</style>
