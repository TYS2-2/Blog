import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'

import {createRouter} from './router.config'
import {createStore} from './store.config'
import './methods';

Vue.config.productionTip = false


import { sync } from 'vuex-router-sync';


export function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}