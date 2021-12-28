<template>
  <section class="projects">
    <h2>Melyik projekten dolgoztál a legtöbb órát? 💻</h2>
    <div class="projects-container">
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
    entriesProjectCount: Object
  },
  setup(props) {
    const projectNumbers = ref(props.entriesProjectCount)
    const topPojrectNumbers = projectNumbers.value.splice(0, 3)


    const chartOptions = {
      labels: Object.values(topPojrectNumbers.map(i => i.project))
    }
    const series = [{
      data: Object.values(topPojrectNumbers.map(i => i.hours))
    }]

    return {
      chartOptions,
      series
    }
  }
}
</script>

<style>
.projects-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 290px;
}

.projects-container > div {
  transition: 1s;
}

</style>
