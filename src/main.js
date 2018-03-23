import 'vuetify/dist/vuetify.min.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import { apolloProvider } from './vue-apollo'

Vue.use(Vuetify)
Vue.config.productionTip = false

//A provider holds the apollo client instances that can then be used by all the child components.
new Vue({
  router,
  provide: apolloProvider.provide(),
  render: h => h(App)
}).$mount('#app')
