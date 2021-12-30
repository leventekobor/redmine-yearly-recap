<template>
    <p>hello</p>
    <p>api key is {{ userApiKey }}</p>
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

    async function _getIssuesWithOffset(offset=0) {
      const response = await RedmineService.getAllUpdatedIssues(props.apiKey, offset)
      return {
        issues: response?.data?.issues || [],
        total_count: response?.data?.total_count || 0
      }
    }
    
    async function getIssues() {
      const PAGE_SIZE = 100;
      const { issues: firstIssues, total_count } = await _getIssuesWithOffset();
      issues = [...firstIssues];
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { issues: currentIssues } = await _getIssuesWithOffset(i * PAGE_SIZE)
          issues = [...issues, ...currentIssues]
        }
      }
      console.log(total_count)
      console.log(issues)
      //projectsOrdered.value = projects.map(({ id, name }) => ({ value:id, name:name }))
    }

    onMounted(getIssues())

    return {
      userApiKey
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
