import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import VueFirestore from 'vue-firestore' 
require('firebase/firestore')
Vue.use(VueFirestore)

Vue.config.productionTip = false

Vue.mixin({
  data: () => ({
    menus: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
      { title: 'Attendance', icon: 'mdi-poll', to: '/attendance' },
      { title: 'Projects', icon: 'mdi-clipboard-list-outline', to: '/projects' },
      { title: 'Employee', icon: 'mdi-account-group', to: '/employee' },
      { title: 'Report', icon: 'mdi-post', to: '/report' },
      { title: 'Expenses', icon: 'mdi-cash', to: '/expenses' }
    ]
  })
})

import FAB from './components/FAB'
Vue.component('FAB', FAB)
import CardTitle from './components/CardTitle'
Vue.component('CardTitle', CardTitle)
import CardAction from './components/CardAction'
Vue.component('CardAction', CardAction)
import CardActionButton from './components/CardActionButton'
Vue.component('CardActionButton', CardActionButton)

import DataTable from './components/DataTable'
Vue.component('DataTable', DataTable)

import { fb } from '@/firebase'
router.beforeEach(async (to, from, next) => {
  let token = await fb.auth().currentUser
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) next('/login')
    else next()
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (token) next('/')
    else next()
  } else next()
})


let app = '';

fb.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});