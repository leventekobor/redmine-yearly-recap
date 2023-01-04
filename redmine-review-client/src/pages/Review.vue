<template>
    <section class="dark container">
      <div class="spacer layer1">
        <Numbers />
      </div>
    </section>
    
    <section class="dark container">
      <div class="spacer layer2">
        <Projects />
      </div>
    </section>
    

    <section class="dark container">
      <div class="spacer layer3">
        <Issues />
      </div>
    </section>

    <section class="dark container">
      <div class="spacer layer4">
        <article>
        </article>
      </div>
    </section>

    <section class="dark container">
      <div class="spacer layer5">
        <article>
        </article>
      </div>
    </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';
import Numbers from '@/components/Numbers';
import Projects from '@/components/Projects';
import Issues from '@/components/Issues';

export default {
  name: 'Review',
  components: {
    Numbers,
    Projects,
    Issues,
  },
  setup() {
    let entries = ref([])
    const totalData = ref(0)
    const collectedData = ref(0)
    let loading = ref(true)
    const year = process.env.VUE_APP_YEAR
    const store = useStore();

    async function _getEntriesWithOffset(offset=0) {
      const response = await RedmineService.getAllTimeEntries(store.state.user.api_key, offset)
      collectedData.value += response?.data?.time_entries.length
      return {
        time_entries: response?.data?.time_entries || [],
        total_count: response?.data?.total_count || 0
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
      getEntries().then(() => {
        store.commit({
          type: 'addAllIssues',
          payload: entries.value,
        })
        loading.value = false
      })
    })

    return {
      year,
      totalData,
      collectedData,
      loading,
      entries
    };
  },
};
</script>

<style scoped>
.review-container {
  margin: 0;
  color: white;
  background: #001220;
  overflow-x: hidden;
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.red {
  background: #5e5858;
}

.dark {
  background: #001220;
}

.spacer {
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    align-content: center;
    justify-content: center;
}

.layer1 {
  background-image: url('../assets/layer1.svg');
}

.layer2 {
  background-image: url('../assets/layer-top2.svg');
}

.layer3 {
  background-image: url('../assets/layer3.svg');
}

.layer4 {
  background-image: url('../assets/layer-top3.svg');
}

.layer5 {
  background-image: url('../assets/layer5.svg');
}
</style>
