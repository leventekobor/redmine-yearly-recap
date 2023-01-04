<template>
  <article>
    <div>
      <p>Összesen {{ store.state.issues.length }} alkalommal rögzítettél időt</p>
    </div>

    <div>
      <p>Összesen {{ hoursSum }} órát rögzítettél</p>
    </div>

    <div>
      <p>Átlagosan {{ (hoursSum/store.state.issues.length).toFixed(2) }} órát rögzítettél egy jegyre</p>
    </div>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';

export default {
  name: 'Numbers',
  setup() {
    const store = useStore();
    const hoursSum = ref(store.state.issues.reduce((acc, obj) => {
      return acc + obj.hours
    }, 0))

    return {
      store,
      hoursSum
    };
  },
};
</script>

<style scoped>
article {
  backdrop-filter: blur(13px);
  background: rgba(255,255,255,0.65);
  margin: 96px;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 15px 25px rgba(129, 124, 124, 0.2);
  backdrop-filter: blur(14px);
}

/* Card Hover Scale & Effect */

#animated-cards .card:hover {
  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -o-transform: scale(1.2);
  -ms-transform: scale(1.2);
  transform: scale(1.2);
  transition: all 1200ms;
  z-index: 99;
}

#animated-cards .card {
  transition: all 1200ms;
  height: 100%;
}
</style>
