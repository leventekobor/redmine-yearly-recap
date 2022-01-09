<template>
  <article class="entires-container">
    <div class="entries-numbers">
      <div>
        <p>Összesen</p>
        <h3> {{ timeEntries.length }} </h3>
        <p>alkalommal rögzítettél időt</p>
      </div>

      <div>
        <p>Összesen</p>
        <h3> {{ hoursSum }} </h3>
        <p>órát rögzítettél</p>
      </div>

      <div>
        <p>Átlagosan</p>
        <h3> {{ (hoursSum / timeEntries.length).toFixed(2) }} </h3>
        <p>órát rögzítettél egy jegyre</p>
      </div>

      <div>
        <p>A legnépszerűbb projektedre</p>
        <h3> {{ maxProject[1] }} </h3>
        <p>órát rögzítettél</p>
      </div>
    </div>
    <div class="graphs-container">
      <div class="graph-container">
        <h3>Megmutatja, hogy melyik nap hány különböző jegyre rögzítettél órát</h3>
        <apexchart height="380" type="bar" :options="options1" :series="series1"></apexchart>
      </div>

      <div class="graph-container">
        <h3>Megmutatja, hogy melyik napra hány órát rögzítettél</h3>
        <apexchart height="380" type="bar" :options="options2" :series="series2"></apexchart>
      </div>

      <div class="graph-container">
        <h3>Megmutatja, hogy melyik projektre hány órát fordítottál</h3>
        <apexchart width="480" type="pie" :options="options3" :series="series3"></apexchart>
      </div>

      <div class="graph-container">
        <Feedback @feedbackRecived="reciveFeedback" v-if="!gaveFeedback" :userId="userId"></Feedback>
        <Feedbacks v-if="gaveFeedback"></Feedbacks>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import VueApexCharts from "vue3-apexcharts"
import Feedback from "@/components/Feedback"
import Feedbacks from '@/components/Feedbacks'
import FeedbackService from '@/services/FeedbackService.js'

export default {
  name: 'Entries',
  components: {
    apexchart: VueApexCharts,
    Feedback,
    Feedbacks
  },
  props: {
    entries: Array,
    userApiKey: String
  },
  setup(props) {
    const timeEntries = ref(props.entries)
    const userId = ref(props.userApiKey)
    const daysCounts = ref()
    const daysCountHours = ref()
    const maxProject = ref()
    const gaveFeedback = ref(false)

    function aggregateData(array) {
      const result = array.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {})

      return result
    }

    function reciveFeedback(indicator) {
      gaveFeedback.value = indicator
    }

    const hoursSum = ref(timeEntries.value.reduce((acc, obj) => {
      return acc + obj.hours
    }, 0))

    const maxHour = ref(Math.max(...timeEntries.value.map(o => o.hours), 0))

    let days = timeEntries.value.map(entrie => new Date(entrie.spent_on).toLocaleString('hu-HU', {weekday:'long'}))
    daysCounts.value = aggregateData(days)

    let dayHours = timeEntries.value.reduce((r,v) => {
      r[new Date(v.spent_on).toLocaleString('hu-HU', {weekday:'long'})] = (r[new Date(v.spent_on).toLocaleString('hu-HU', {weekday:'long'})] || 0) + v.hours; 
      return r;
    }, {});

  
    let projectHours = timeEntries.value.reduce((r,v) => {
      r[v.project.name] = (r[v.project.name] || 0) + v.hours; 
      return r;
    }, {});

    maxProject.value = Object.entries(projectHours).sort((x,y)=>y[1]-x[1])[0]

    let options1 = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: Object.keys(daysCounts.value)
      }
    })

    let options2 = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: Object.keys(daysCounts.value)
      }
    })

    
    let options3 = ref({
      chart: {
        type: 'pie',
        toolbar: {
          show: false
        },
      },
      legend: {
        position: 'bottom'
      },
      labels: Object.keys(projectHours),
      responsive: [{
      breakpoint: 540,
        options: {
          chart: {
            width: 200,
            height: 560
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    })

    let series1 = ref([{
      name: 'rogzitett-orak',
      data: Object.values(daysCounts.value)
    }])

    let series2 = ref([{
      name: 'rogzitett-orak',
      data: Object.values(dayHours)
    }])

    let series3 = ref(Object.values(projectHours))

    onMounted(() => {
      FeedbackService.checkFeedback(userId.value.slice(2, 10)).then((response) => {
        if(response.data === false) {
          gaveFeedback.value = true
        }
        // false if user already gave feedback
      })
    })

    return {
      timeEntries,
      hoursSum,
      maxHour,
      maxProject,
      daysCounts,
      options1,
      options2,
      options3,
      series1,
      series2,
      series3,
      daysCountHours,
      gaveFeedback,
      reciveFeedback,
      userId
    }
  }
}
</script>

<style lang="scss" scoped>
.entires-container {
  width: 100%;
  h2, h3 {
    margin-block: 0rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 2.125rem;
    font-weight: 400;
  }

  h3 {
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: 300;
  }

  .entries-numbers {
    max-width: 1400px;
    div {
      width: 277px;
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .graphs-container {
    max-width: 1400px;
    
    .graph-container {
      height: 33rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      h3 {
        font-size: 1.05rem;
        line-height: 1.25rem;
        padding-block-start: 1rem;
        padding-block-end: 2rem;
        padding-inline: 1rem;
      }

      width: 600px;
      margin-block: 2rem;
      background-color: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    width: 100%;
    
  }
}

@media screen and (max-width: 1400px) {
  .entires-container {
    .graphs-container {
      .graph-container {
        width: 542px;
      }
    }
  }
}


@media screen and (max-width: 1200px) {
  .entires-container {
    .entries-numbers {
      flex-direction: column;
      height: 100%;
      align-items: center;

      div {
        width: 460px;
        margin-block-start: 1rem;
      }
    }

    .graphs-container {
      flex-direction: column;
      height: 100%;
      align-items: center;

      .graph-container {
        width: 460px;
        padding-inline: 2rem;
        padding-block-start: 1.5rem;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .entires-container {
    .entries-numbers {
      flex-direction: column;
      height: 100%;
      align-items: center;

      div {
        width: 320px
      }
    }

    .graphs-container {
      flex-direction: column;
      height: 100%;
      align-items: center;

      .graph-container {
        width: 320px!important;
        padding-inline: 2rem;
        padding-block-start: 1.5rem;
      }
    }
  }
}

</style>
