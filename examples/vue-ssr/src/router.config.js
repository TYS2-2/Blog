import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import {routes} from './router/index'

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes: [
      ...routes
    ]
  })
}