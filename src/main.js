import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './elementUi/element'
import './css/common.css'

axios.defaults.baseURL = 'http://192.168.1.5:3000'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
