<template>
  <header>
    <a v-if="issueCount > 0" href="#1">Számok</a>
    <a v-if="authorsCounts" href="#2">Szerzők</a>
    <a v-if="projectCounts" href="#3">Projektek</a>
    <img :src='require(`../public/tigra.png`)'>
  </header>
  <h1 class="fade">Redmine éves áttekintés</h1>
  <Login v-if="!loggedInUser" @userLoad="userData" />
  <article  v-else id="card">
    <div class="circle">
      {{ (loggedInUser.firstname)[0] }}  {{ (loggedInUser.lastname)[0] }}
    </div>
    <span>🦄 Név: {{ loggedInUser.firstname + " " + loggedInUser.lastname }}</span>
    <p>Ha megfelelő a név akkor sikeres volt az autentikálás! Már csak rá kell kattintanod a gombra ahhoz hogy megkapd az éves áttekintésed 🚀</p>
    <button v-on:click="getIssues" >Áttekintés elkészítése!</button>
  </article>
  <hr  v-if="issueCount">
  <Numbers id="1" v-if="issueCount" v-bind:issueCount="issueCount"/> 
  <Authors id="2" v-if="authorsCounts" v-bind:authorsCounts="authorsCounts"/>
  <Projects id="3" v-if="projectCounts" v-bind:projectCounts="projectCounts"/>
</template>

<script>
import RedmineService from '@/services/RedmineService.js'
import Authors from './components/Authors.vue'
import Numbers from './components/Numbers.vue'
import Login from './components/Login.vue'
import Projects from './components/Projects.vue'
import { ref } from 'vue'
 
export default {
  name: 'app',
  components: {
    Login,
    Numbers,
    Authors,
    Projects
  },

  setup () {
    let loggedInUser = ref()
    let issues = ref([])
    let response = ref()
    let issueCount = ref()
    let projects
    let projectCounts = ref()
    let authors
    let authorsCounts = ref()
    let days
    let daysCounts = ref()
    let priority
    let priorityCounts = ref()

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
      projectCounts.value = projects.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      //console.log(projectCounts)

      // authors aggregation
      authors = issues.value.map(issue => issue.author.name)
      authorsCounts.value = authors.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      console.log(authorsCounts.value)

      // days aggregation
      // new Date(issue.updated_on).toLocaleString('hu-HU', {weekday:'long'})
      days = issues.value.map(issue => new Date(issue.updated_on).toLocaleString('en-us', {weekday:'long'}))
      daysCounts.value = days.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      //console.log(daysCounts)

      // prios aggregation
      priority = issues.value.map(issue => issue.priority.name)
      priorityCounts.value = priority.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      //console.log(priorityCounts)
    }

    return {
      loggedInUser,
      issueCount,
      issues,
      getIssues,
      authorsCounts,
      projectCounts,
      daysCounts,
      priorityCounts,
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
    scroll-behavior: smooth;
}

hr {
  color: black;
  z-index: 3;
  margin: 60px 10px 60px 10px;

  
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

header {
  z-index: 4;
  width: 100%;
  height: 50px;
  position: sticky;
  top: 0;
  background-color: #A0CED9;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

header > img {
  position: absolute;
  right: 10px;
  height: 50%;
  margin-top: 0px;
}

header > a {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  color: black;
  text-decoration: none;
  font-size: 20px;
  transition: 1s;
}

header > a:hover {
  background-color: #1D4049;
  color: white;
}

article {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 5px;
  align-items: center;
  width: 300px;
  height: 350px;
  background: white;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  transition: 1s;
}

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
  height: 30px;
  border: none;
  margin-top: 5px;
  border-radius: 3px;
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
