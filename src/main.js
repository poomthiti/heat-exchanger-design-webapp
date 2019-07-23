import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Result from './components/result.vue';

Vue.use(VueRouter);

const routes = [ 
  { path: '/results', component : Result},
  { path: '/', component : App},
]

const router = new VueRouter({
  routes,
  mode: 'history',
});

Vue.config.productionTip = false

new Vue({
  el: '#app' ,
  router,
  render: h => h(App),
}).$mount('#app')
