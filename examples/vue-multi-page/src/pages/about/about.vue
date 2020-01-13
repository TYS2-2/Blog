<template>
    <div>
        <div>this is about page app</div>
        <router-view/>
    </div>
</template>
<script>
import About from '../../views/About.vue'
export default {
    components: {
        About
    },
    data() {
        return {
            
        }
    },
    mounted() {
        console.log('this is about vue ', this.$store.state.shareDate)
    }
}
</script>