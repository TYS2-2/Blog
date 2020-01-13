<template>
  <div class="home">
    <h1>This is an home page</h1>
    <div>{{data}}</div>
    <div>{{homeData}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex'
import home from '../store/home.js'
//console.log('home ====', home)
export default {
  name: 'home',
  asyncData({store}) {
    store.registerModule('home', home)
    return store.dispatch('home/dispatch_homeData')
  },
  components: {
  },
  data() {
    return {
      testData: 'this is test data',
    }
  },
  computed: {
    ...mapState({
      data: 'data',
      homeData: state => state.home.homeData
    })
  },
  mounted() {
    console.log('================== ', this.data)
    //console.log('homeData ================== ', this.homeData)
    console.log(111111111111)
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://iop-test.essence.com.cn/iop-mgt/popup/list", true);
      xhr.withCredentials = true; //支持跨域发送cookies
      xhr.send();
  },
  destroyed(){
    this.$store.unregisterModule('home')
  }
}
</script>
