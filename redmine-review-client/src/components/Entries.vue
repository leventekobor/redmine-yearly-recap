<template>
  <article class="entires-container">
    <header>
      <h2> {{ timeEntries.length }} </h2>
      <p>alkalommal rögzítettél órát</p>
    </header>
    <div class="entries-numbers">
      <div>
        <p>Összesen</p>
        <h3> {{ hoursSum }} </h3>
        <p>óra</p>
      </div>

      <div>
        <p>Átlagosan</p>
        <h3> {{ (hoursSum / timeEntries.length).toFixed(2) }} </h3>
        <p>óra</p>
      </div>

      <div>
        <h3>Melyik nap hány alkalommal rögzítettél órát</h3>
        <apexchart width="500" type="bar" :options="options1" :series="series1"></apexchart>
      </div>

      <div>
        <h3>Melyik napra hány órát rögzítettél az évben</h3>
        <apexchart width="500" type="bar" :options="options1" :series="series2"></apexchart>
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

    console.log(dayHours)

    let options1 = ref({
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: Object.keys(daysCounts.value)
      }
    })

    let series1 = ref([{
      name: 'rogzitett-orak',
      data: Object.values(daysCounts.value)
    }])

    let series2 = ref([{
      name: 'rogzitett-orak',
      data: Object.values(dayHours)
    }])

    return {
      timeEntries,
      hoursSum,
      maxHour,
      daysCounts,
      options1,
      series1,
      series2,
      daysCountHours
    }
  }
}
</script>

<style lang="scss" scoped>
.entires-container {
  h2, h3 {
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
