// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

// Vue.use(VueRouter)

const componentPath = (name='Home') => {
  return {
    component: () => import(`../views/${name}.vue`)
  }
}

export const routes = [
  // {
    // path: '/app',
    // component: () => import(`../components/HelloWorld.vue`),
    // children: [
      {
        path: '/home',
        name: 'home',
        ...componentPath('Home')
      },
      {
        path: '/about',
        name: 'about',
        ...componentPath('About')
      }
    // ]
  // }
  
]
