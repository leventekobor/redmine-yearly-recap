<template>
  <header>
    <a v-if="issueCount > 0" href="#szamok">Számok</a>
    <a v-if="authorsCounts" href="#szerzok">Szerzők</a>
    <a v-if="daysCounts" href="#napok">Napok</a>
    <a v-if="projectCounts" href="#projectek">Projektek</a>
    <a v-if="priorityCounts" href="#prioritasok">Prioritás</a>
    <a v-if="timeEntriesCount" href="#idok">Idők</a>
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
    <button :disabled="loading" v-on:click="getIssues(); getTimeEntries();" >Áttekintés elkészítése!</button>
  </article>
  <svg v-if="loading"  class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
  </svg>
  <hr  v-if="issueCount">
  <div id="szamok"></div>
  <Numbers  v-if="issueCount" v-bind:issueCount="issueCount"/> 
  <div id="szerzok"></div>
  <Authors v-if="authorsCounts" v-bind:authorsCounts="authorsCounts"/>
  <div id="napok"></div>
  <Days v-if="daysCounts" v-bind:daysCounts="daysCounts"/>
  <div id="projectek"></div>
  <Projects v-if="projectCounts" v-bind:projectCounts="projectCounts"/>
  <div id="prioritasok"></div>
  <Prios v-if="priorityCounts" v-bind:priorityCounts="priorityCounts"/>
  <div id="idok"></div>
  <Entries v-if="timeEntriesCount" v-bind:timeEntriesCount="timeEntriesCount"/>
  <footer>
    <p>
    </p>
  </footer>
</template>

<script>
import RedmineService from '@/services/RedmineService.js'
import Prios from './components/Prios.vue'
import Authors from './components/Authors.vue'
import Numbers from './components/Numbers.vue'
import Login from './components/Login.vue'
import Projects from './components/Projects.vue'
import Days from './components/Days.vue'
import Entries from './components/Entries.vue'
import { ref } from 'vue'
 
export default {
  name: 'app',
  components: {
    Login,
    Numbers,
    Authors,
    Prios,
    Days,
    Entries,
    Projects
  },

  setup () {
    let loggedInUser = ref()
    let issues = ref([])
    let issueCount = ref()
    let projects
    let projectCounts = ref()
    let authors
    let authorsCounts = ref()
    let days
    let daysCounts = ref()
    let priority
    let priorityCounts = ref()
    let loading = ref(false)
    let timeEntries = ref()
    let timeEntriesCount = ref()
 

    Date.prototype.getWeek = function() {
      const onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    }

    function userData(user) {
      loggedInUser.value = {...user.value.user}
    }

    async function getTimeEntries() {
      let response = ref()
      console.time('getting entries first round')
      response.value = (await RedmineService.getAllTimeEntriesIn2020(loggedInUser.value.api_key, 0)).data
      timeEntries.value = response.value.time_entries
      console.timeEnd('getting entries first round')
      if(response.value.total_count > 100) {
        let iterations = Math.ceil(response.value.total_count / 100)
        for(let i = 1; i < iterations; i++) {
          console.time('getting more entries')
          response.value = (await RedmineService.getAllTimeEntriesIn2020(loggedInUser.value.api_key, (i * 100))).data
          timeEntries.value = [...timeEntries.value, ...response.value.time_entries]
          console.timeEnd('getting more entries')
        }
      }
      timeEntriesCount.value = timeEntries.value
    }

    async function getIssues() {
      let response = ref()
      loading.value = true
      console.time('getting issues first round')
      response.value = (await RedmineService.getAllUpdatedIssuesIn2020(loggedInUser.value.api_key, 0)).data
      issues.value = response.value.issues
      issueCount.value = response.value.total_count
      console.timeEnd('getting issues first round')
      if(response.value.total_count > 100) {
        let iterations = Math.ceil(response.value.total_count / 100)
        for(let i = 1; i < iterations; i++) {
          console.time('getting more issues')
          response.value = (await RedmineService.getAllUpdatedIssuesIn2020(loggedInUser.value.api_key, (i * 100))).data
          issues.value = [...issues.value, ...response.value.issues]
          console.timeEnd('getting more issues')
        }
      }

      // projects aggregation 
      projects = issues.value.map(issue => issue.project.name)
      projectCounts.value = projects.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  

      // authors aggregation
      authors = issues.value.map(issue => issue.author.name)
      authorsCounts.value = authors.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  

      // days aggregation
      // new Date(issue.updated_on).toLocaleString('hu-HU', {weekday:'long'})
      days = issues.value.map(issue => new Date(issue.updated_on).toLocaleString('HU-hu', {weekday:'long'}))
      daysCounts.value = days.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  

      // prios aggregation
      priority = issues.value.map(issue => issue.priority.name)
      priorityCounts.value = priority.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {});  
      
      loading.value = false
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
      userData,
      loading,
      getTimeEntries,
      timeEntries,
      timeEntriesCount
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

footer {
  margin-top: 100px;
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

section {
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0px 25px 25px 25px;
  align-items: center;
  background: white;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
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

button:disabled {
  cursor: wait;
}

button:hover{
  color:#FFF;
  background-color:#2b9348;
}

.spinner {
  z-index: 6;
  margin: auto;
  margin-top: 50px;
  animation: rotator 1.4s linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(270deg);}
}

.path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
}

@keyframes colors {
  0% {stroke: #4285f4;}
  25% {stroke: #de3e35;}
  50% {stroke: #f7c223;}
  75% {stroke: #1b9a59;}
  100% {stroke: #4285f4;}
}

@keyframes dash {
  0% {stroke-dashoffset: 187;}
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
    }
}
</style>
