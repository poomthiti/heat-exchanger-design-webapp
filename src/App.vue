<template>
  <div id="app" class="bg-dark m-0">
    <div>
    <myNav />
    </div>
    <div class="container">
    <searchSpecs />
    </div>
    <div>
    <customFooter />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import myNav from './components/nav.vue'
import searchSpecs from './components/input.vue'
import customFooter from './components/footer.vue'


export default {
  name: 'app',
  components: {
    myNav ,
    searchSpecs ,
    customFooter,
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
