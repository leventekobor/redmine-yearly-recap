<template>
  <section class="dashboard">
    <h1>A 2021-es éved Redmine összefoglalója</h1>
    <article v-if="loading" class="loading-container">
      <label class="loading-text">
        Az alkalmazás most összegyűjti a kimutatáshoz szükséges adatokat a Redmine-ról. Kérlek legyél türelemmel, ez a folyamat akár perceking is eltarthat.🍻
        <progress id="data-loading" :max="totalData " :value="collectedData" />
      </label>
    </article>
    <article class="data-container">
      <Entries v-if="!loading && entries" :entries="entries" >
      </Entries>
      <Issues v-if="!loading && issues" :issues="issues" >
      </Issues>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import Entries from '@/components/Entries'
import Issues from '@/components/Issues'

export default {
  name: "Dashboard",
  components: {
    Entries,
    Issues
  },
  props: {
    apiKey: String
  },
  setup(props) {
    const userApiKey =ref(props.apiKey)
    let issues = ref([])
    let entries = ref([])
    const totalData = ref(0)
    const collectedData = ref(0)
    let loading = ref(true)

    async function _getIssuesWithOffset(offset=0) {
      const response = await RedmineService.getAllUpdatedIssues(props.apiKey, offset)
      collectedData.value += response?.data?.issues.length
      return {
        issues: response?.data?.issues || [],
        total_count: response?.data?.total_count || 0
      }
    }

    async function _getEntriesWithOffset(offset=0) {
      const response = await RedmineService.getAllTimeEntries(props.apiKey, offset)
      collectedData.value += response?.data?.time_entries.length
      return {
        time_entries: response?.data?.time_entries || [],
        total_count: response?.data?.total_count || 0
      }
    }
    
    async function getIssues() {
      const PAGE_SIZE = 100;
      const { issues: firstIssues, total_count } = await _getIssuesWithOffset();
      issues.value = [...firstIssues];
      totalData.value += total_count
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { issues: currentIssues } = await _getIssuesWithOffset(i * PAGE_SIZE)
          issues.value = [...issues.value, ...currentIssues]
        }
      }
    }

    async function getEntries() {
      const PAGE_SIZE = 100;
      const { time_entries: firstEntries, total_count } = await _getEntriesWithOffset();
      entries.value = [...firstEntries];
      totalData.value += total_count
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { time_entries: currentEntries } = await _getEntriesWithOffset(i * PAGE_SIZE)
          entries.value = [...entries.value, ...currentEntries]
        }
      }
    }

    onMounted(() => {
      getIssues().then(() => getEntries().then(() => loading.value = false))
    })

    return {
      userApiKey,
      totalData,
      collectedData,
      loading,
      entries,
      issues
    }
  }
}
</script>


<style lang="scss" scoped>
.dashboard {
  background-color: #FFFFFF;
  border-radius: 10px;
  margin-block: 3rem;
  margin-inline: 3rem;
  padding: 3rem;
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);

  h1 {
    font-size: 2rem;
    line-height: 2.25rem;
    margin-block-start: 0rem;
  } 

  .loading-container {
    padding: 2rem;

    .loading-text {
      font-size: 1rem;
    }

    progress {
      padding-block-start: 1.5rem;
      margin-block-start: 1rem;
      width: 100%;
      accent-color: #2b9348;
    }
  }

  .data-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 480px) {
  .dashboard {
    margin-block: 1rem;
    margin-inline: 1rem;

    .loading-container {
      padding: 1rem;
    }
  }
}

</style>
