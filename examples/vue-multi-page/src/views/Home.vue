<template>
  <div class="home">
    <button @click="openWindow">open</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  mounted() {
    document.cookie = 'a=1'
    document.cookie = 'b=2'
    document.cookie = 'c=3'
    let cookie = document.cookie
    this.cookie = cookie
    console.log('cookie === index ', cookie)

    window.localStorage.setItem('test','test data')
    this.getRandomNum()
  },
  methods: {
    openWindow() {
      //window.open("http://localhost:8080/about.html#/about?msg="+this.cookie, 'newwindow', 'height: 100, width: 400')
      //window.open('http://10.2.95.67/sop/home', 'newwindow', 'height: 100, width: 400')

      //window.location.href = 'http://localhost:8080/about.html#/about'

      let myWindow=window.open('http://localhost:8080/about.html#/about','111','width=600,height=400')
      //myWindow.document.write("This is 'myWindow'")
      //myWindow.document.cookie = 'a=1'
      //console.log('myWindow === ', myWindow.document )


      setTimeout(() => {
        myWindow.postMessage("dsfasdgsdfgdfg", 'http://localhost:8080/about.html#/about');
      }, 1000)
    },
    getCookie() {
      let cookie = document.cookie
      console.log('cookie === getCookie ', cookie)

    },
    getRandomNum() {
      let numArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
      let targetArr = [], index = ''
      let timer = setInterval(() => {
        let len = numArr.length
        if (targetArr.length >= 6) {
          clearInterval(timer)
          let blue = this.getBlueNum()
          console.log('the targetArr', targetArr.toString() + ' ---- ' + blue)
          return
        }
        index = parseInt(Math.random()*(len))
        targetArr.push(...numArr.splice(index, 1))
      },1000)
    },
    getBlueNum() {      
      let numArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
      let target = '', index = ''
      index = parseInt(Math.random()*(16))
      target = numArr.splice(index, 1)[0]
      return target
    }
  }
}
</script>
