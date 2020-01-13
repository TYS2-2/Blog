import Vue from 'vue';
Vue.mixin({
    beforeMount() {
        const {
            asyncData
        } = this.$options
        if (asyncData) {
            console.log('this.$store == ', this.$store)
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            })
        }
    }
})
