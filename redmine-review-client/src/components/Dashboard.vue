<template>
  <section class="dashboard">
    <article v-if="loading" class="loading-container">
      <label class="loading-text">
        Az alkalmazás most összegyűjti a kimutatáshoz szükséges adatokat a Redmine-ról. Kérlek legyél türelemmel, ez a folyamat akár perceking is eltarthat.🍻
        <progress id="data-loading" :max="totalData " :value="collectedData" />
      </label>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'

export default {
  name: "Dashboard",
  props: {
    apiKey: String
  },
  setup(props) {
    const userApiKey =ref(props.apiKey)
    let issues
    let entries
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
      issues = [...firstIssues];
      totalData.value += total_count
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { issues: currentIssues } = await _getIssuesWithOffset(i * PAGE_SIZE)
          issues = [...issues, ...currentIssues]
        }
      }
      console.log(total_count)
      console.log(issues)
    }

    async function getEntries() {
      const PAGE_SIZE = 100;
      const { time_entries: firstEntries, total_count } = await _getEntriesWithOffset();
      entries = [...firstEntries];
      totalData.value += total_count
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { time_entries: currentEntries } = await _getEntriesWithOffset(i * PAGE_SIZE)
          entries = [...entries, ...currentEntries]
        }
      }
      console.log(total_count)
      console.log(entries)
    }

    onMounted(() => {
      getIssues().then(() => getEntries().then(() => loading.value = false))
    })

    return {
      userApiKey,
      totalData,
      collectedData,
      loading
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
