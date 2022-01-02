<template>
  <article class="entires-container">
    <div class="entries-numbers">
      <div>
        <p>Összesen</p>
        <h3> {{ timeEntries.length }} </h3>
        <p>rögzítés</p>
      </div>

      <div>
        <p>Összesen</p>
        <h3> {{ hoursSum }} </h3>
        <p>óra</p>
      </div>

      <div>
        <p>Átlagosan</p>
        <h3> {{ (hoursSum / timeEntries.length).toFixed(2) }} </h3>
        <p>óra/jegy</p>
      </div>

      <div>
        <p>A {{ maxProject[0] }} projectre összesen </p>
        <h3> {{ maxProject[1] }} </h3>
        <p>órát rögzítettél</p>
      </div>
    </div>
    <div class="graphs-container">
      <div class="graph-container">
        <apexchart height="380" type="bar" :options="options1" :series="series1"></apexchart>
      </div>

      <div class="graph-container">
        <apexchart height="380" type="bar" :options="options2" :series="series2"></apexchart>
      </div>

      <div class="graph-container">
        <apexchart width="480" type="pie" :options="options3" :series="series3"></apexchart>
      </div>
    </div>
  </article>
</template>

<script>
import { ref } from 'vue'
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'Entries',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    entries: Array
  },
  setup(props) {
    let timeEntries = ref(props.entries)
    let daysCounts = ref()
    let daysCountHours = ref()
    let maxProject = ref()
    console.log(timeEntries)

    function aggregateData(array) {
      const result = array.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {})

      return result
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
      title: {
        text: 'Melyik nap hány alkalommal rögzítettél'
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
      title: {
        text: 'Melyik napra hány órát rögzítettél'
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
      title: {
        text: 'Melyik projektre hány órát fordítottál'
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
      daysCountHours
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
    justify-content: space-around;
    align-items: center;
  }

  .graphs-container {
    .graph-container {
      margin-block: 2rem;
      background-color: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 30rem;
  }
}

@media screen and (max-width: 1200px) {
  .entires-container {
    .entries-numbers {
      flex-direction: column;
      height: 100%;
      align-items: center;

      div {
        margin-block-start: 1rem;
      }
    }

    .graphs-container {
      flex-direction: column;
      height: 100%;
      align-items: center;

      .graph-container {
        width: 480px;
        padding-inline: 2rem;
        padding-block-start: 1.5rem;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .entires-container {
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
