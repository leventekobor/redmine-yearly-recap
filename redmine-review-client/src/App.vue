<template>
  <Login v-if="!loggedInUser" @userLoad="userData" />
  <article  v-else>
    <div class="circle">
      {{ (loggedInUser.firstname)[0] }}  {{ (loggedInUser.lastname)[0] }}
    </div>
    <span>🦄 Name: {{ loggedInUser.firstname }} {{ loggedInUser.laststname }}</span>
    <span>🦄 Created: {{ (loggedInUser.created_on).split('T')[0] }}</span>
    <span>🦄 Issues: {{ issues.length }}</span>
    <button v-on:click="getIssues">Generate Report!</button>
    
  </article>
</template>

<script>
import RedmineService from '@/services/RedmineService.js'
import Login from './components/Login.vue'
import { ref } from 'vue'
 
export default {
  name: 'app',
  components: {
    Login
  },

  setup () {
    let loggedInUser = ref()
    let issues = ref([])
    let response = ref()
    let issueCount = ref()
    let projects
    let projectCounts
    let authors
    let authorsCounts
    let days
    let daysCounts
    let priority
    let priorityCounts

    Date.prototype.getWeek = function() {
      const onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    }

    function userData(user) {
      loggedInUser.value = {...user.value.user}
    }

    async function getIssues() {
      console.time('getting issues')
      response.value = (await RedmineService.getAllUpdatedIssuesIn2020(loggedInUser.value.api_key, 0)).data
      issues.value = response.value.issues
      issueCount.value = response.value.total_count
      if(response.value.total_count > 100) {
        let iterations = Math.ceil(response.value.total_count / 100)
        for(let i = 1; i < iterations; i++) {
          response.value = (await RedmineService.getAllUpdatedIssuesIn2020(loggedInUser.value.api_key, (i * 100))).data
          issues.value = [...issues.value, ...response.value.issues]
        }
      }
      console.timeEnd('getting issues')

      // projects aggregation 
      projects = issues.value.map(issue => issue.project.name)
      projectCounts = projects.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      console.log(projectCounts)

      // authors aggregation
      authors = issues.value.map(issue => issue.author.name)
      authorsCounts = authors.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      console.log(authorsCounts)

      // days aggregation
      // new Date(issue.updated_on).toLocaleString('hu-HU', {weekday:'long'})
      days = issues.value.map(issue => new Date(issue.updated_on).toLocaleString('en-us', {weekday:'long'}))
      console.log(days)
      daysCounts = days.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      console.log(daysCounts)

      // prios aggregation
      priority = issues.value.map(issue => issue.priority.name)
      priorityCounts = priority.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      console.log(priorityCounts)
    }

    return {
      loggedInUser,
      issues,
      getIssues,
      userData
    }
  }
}
</script>



<style>
html, 
body {
    margin: 0;
    padding: 0;
    background-color: #FFF2EB;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}



article {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 300px;
  height: 350px;
  background: white;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
article:hover {
  box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
}

.circle {
  width: 90px;
  height: 90px;
  line-height: 90px;
  border-radius: 50%;
  font-size: 50px;
  color: #ffc857;
  background-color: #323031;
  text-align: center;
  background: #000;

}

button {
  cursor: pointer;
  display:inline-block;
  padding:0.35em 1.2em;
  border: none;
  margin-top: 5px;
  border-radius:0.12em;
  box-sizing: border-box;
  text-decoration:none;
  font-family:'Roboto',sans-serif;
  font-weight:300;
  color:#FFF;
  text-align:center;
  background-color: #084c61;
  transition: all 1s;
}

button:hover{
  color:#FFF;
  background-color:#2b9348;
}



</style>
