<template>
  <section class="projects">
    <h2>Melyik projekten dolgoztál? 💻</h2>
    <div class="projects-container">
      <apexchart
      width="520"
      type="donut"
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
    projectCounts: Object
  },
  setup(props) {
    const projectNumbers = ref(props.projectCounts)

    const chartOptions = {
      labels: Object.keys(projectNumbers.value)
    }
    const series = Object.values(projectNumbers.value)

    return {
      projectNumbers,
      chartOptions,
      series
    }
  }
}
</script>

<style>
.projects {
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

.projects-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 220px;
}

.projects-container > div {
  transition: 1s;
}

</style>
