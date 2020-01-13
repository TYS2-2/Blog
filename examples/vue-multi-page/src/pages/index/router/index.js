import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('@/views/Home.vue')
// import Home from '../../../views/Home.vue'
// 
const routes = [
    {
        path: '/',
        name: 'index',
        component: Home
    }
]

const router = new VueRouter({
    routes
})

export default router

