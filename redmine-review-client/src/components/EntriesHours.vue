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
import { onMounted, ref } from 'vue'
import VueApexCharts from "vue3-apexcharts";
import RedmineService from '@/services/RedmineService.js'

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    entriesHoursCount: Object,
    apiToken: String
  },
  setup(props) {
    const projectNumbers = ref(props.entriesHoursCount)
    const token = ref(props.apiToken)
    let topPojrectNumbers = (projectNumbers.value.splice(0, 5))
    let labels = []

    async function getIssueName() {
      for(let i = 0; i < topPojrectNumbers.length; i++) {
        const response = (await RedmineService.getIssues(token.value, topPojrectNumbers[i].issue)).data
        Object.assign(topPojrectNumbers[i], {title: response.issues[0].subject});
        labels.push(topPojrectNumbers[i].title)
      }
    }
    console.log(labels)

    onMounted(getIssueName())



    const chartOptions = ref({
      labels: labels
    })

    const series = ref([{
      data: Object.values(topPojrectNumbers.map(i => i.hours))
    }])
    

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
