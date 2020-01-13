import Vue from 'vue'
import router from './router'
// import router from './router'
import store from './store'

console.log('this is router router ==== ', router)

import App from './about.vue'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')