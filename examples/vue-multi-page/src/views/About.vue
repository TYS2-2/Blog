<template>
  <div class="about">
    <h1>This is an about page ============= </h1>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    let cookie = document.cookie
    console.log('cookie === about ', cookie)

    let data = window.localStorage.getItem('test')
    console.log('data === ', data)
    window.addEventListener('message', function (e) {
      console.log('this is about message e ', e)
    })
  },
  methods: {

  }
}
</script>
