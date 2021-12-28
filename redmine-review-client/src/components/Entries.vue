<template>
  <section class="entries">
    <h2>2020-ban összesen {{ Object.keys(timeEntries).length }}  alkalommal rögzítettél időt ❤</h2>
    <div class="entries-container">
      <div>
        A legtöbb órát a(z) {{ getAggregatedProjectHours().project }} projectre rögzítetted {{ getAggregatedProjectHours().hours }} órával 🥇
      </div>
      <div>
        A legtöbb órát a(z) {{ hoursIssue.title }} jegyre rögzítetted {{hoursIssue.hours }} órával 🥇
      </div>
    </div>
  </section>
</template>

<script>
import RedmineService from '@/services/RedmineService.js'
import { ref, onMounted } from 'vue'

export default {
  props: {
    timeEntriesCount: Object,
    apiToken: String
  },
  setup(props) {
    const timeEntries = ref(props.timeEntriesCount)
    const token = ref(props.apiToken)
    let hoursIssue = ref({})

    function getAggregatedProjectHours() {
      let arrayEntries = Object.entries(timeEntries)[0][1].map(i => { return {project: i.project.name, hours:i.hours}})
      
      let foo = arrayEntries.reduce(function(acc, val){
        var o = acc.filter(function(obj){
          return obj.project==val.project;
        }).pop() || {project:val.project, hours:0};
        
        o.hours += val.hours;
        acc.push(o);
        return acc;
      },[]);

      let finalResult = foo.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
      });

      finalResult.sort((a, b) => b.hours - a.hours)
      return finalResult[0]
    }

    async function getAggregatedIssueHours() {
      let arrayEntries = Object.entries(timeEntries)[0][1].map(i => { return {issue: i.issue.id, hours:i.hours}})
      
      let foo = arrayEntries.reduce(function(acc, val){
          var o = acc.filter(function(obj){
              return obj.issue==val.issue;
          }).pop() || {issue:val.issue, hours:0};
          
          o.hours += val.hours;
          acc.push(o);
          return acc;
      },[]);

      const finalResults = foo.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
      });

      finalResults.sort((a, b) => b.hours - a.hours)
      hoursIssue.value = finalResults[0]
      const response = (await RedmineService.getIssues(token.value, hoursIssue.value.issue)).data
      hoursIssue.value = {...hoursIssue.value, title: response.issues[0].subject}
    }

    onMounted(getAggregatedIssueHours)

    return {
      timeEntries,
      getAggregatedProjectHours,
      getAggregatedIssueHours,
      hoursIssue
    }
  }
}
</script>

<style scoped>
section {
  width: 520px;
}

.entries-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 170px;
  width: 330px;
}

.entries-container > div {
  padding: 5px;
  transition: 1s;
}

.entries-container > div:hover {
  font-size: 18px;
  background-color: #1D4049;
  color: white;
  border-radius: 3px;
  padding: 5px;
}
</style>
