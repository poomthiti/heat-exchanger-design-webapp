<template>
  <div id="app" class="bg-dark m-0">
    <router-view>
    <div class="container">
      <searchSpecs />
    </div>
    </router-view>
  </div>
</template>

<script>
import searchSpecs from './components/input.vue'


export default {
  name: 'app',
  components: {
    searchSpecs
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(185, 48, 78);
  margin-top: 60px;
}
</style>
