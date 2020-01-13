import Vue from 'vue'
import Vuex from 'vuex'
// import home from './store/home'
// import { resolve } from 'path';
// import { reject } from 'q';

Vue.use(Vuex)

function fetchItem(id){
  //该函数是运行在node环境 所以需要加上域名
  return new Promise((resolve, reject) => {
    resolve()
  })
}

export function createStore() {
  return new Vuex.Store({
    state: {
      data: 'this is store config store data'
    },
    mutations: {
      setData(state, payload) {
        state.data = payload
      }
    },
    actions:{
      changeData({commit}) {
        console.log('changeData ==== ')
        commit('setData', 'store changed data')
      }
    },
    modules: {
      // home
    }
  })
}