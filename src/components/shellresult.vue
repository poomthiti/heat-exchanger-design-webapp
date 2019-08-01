<template>
    <div id='shellResult'>
        <myNav />
        <section>
            <h1>SHELL</h1>
        </section>
        <customFooter />
    </div>
</template>

<script>
import myNav from './nav.vue'
import customFooter from './footer.vue'

export default {
    name : "shellResult",
    components: {
        myNav,
        customFooter,
    }
}
</script>

<style>
</style>