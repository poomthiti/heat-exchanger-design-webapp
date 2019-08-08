import VueRouter from 'vue-router';
import App from './App.vue';
import PipeResult from './components/piperesult.vue';
import Input from './components/input.vue';
import ShellResult from './components/shellresult.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/doublepipe', name: 'pipeResult', component: PipeResult, props: true },
  { path: '/shellandtube', component: ShellResult, props: true },
  { path: '/', component: Input }
]

const router = new VueRouter({
  routes,
  mode: 'history',
});

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app')
