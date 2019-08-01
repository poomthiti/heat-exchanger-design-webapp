<template>
  <div id="pipeResult">
    <myNav />
    <section>
      <h1>PIPE</h1>
    </section>
    <customFooter />
  </div>
</template>

<script>
import myNav from "./nav.vue";
import customFooter from "./footer.vue";
import axios from 'axios';

export default {
  name: "pipeResult",
  components: {
    myNav,
    customFooter
  },
  props: [
    "flowtype",
    "materialk",
    "innerdiameter",
    "innerthickness",
    "outerdiameter",
    "outerthickness",
    "foulingfactor",
    "hotinlettemp",
    "hotoutlettemp",
    "massflowrate",
    "coldinlettemp",
    "coldoutlettemp",
    "flowlocation",
    "fluid",
    "pressure",
  ],
  
  created () {
    axios
      .get('https://poom-api.mecode.asia/chemical/Toluene?part=rho,mu,Cp,k&t=270&p=125000')
      
  }
  ,
  mounted () {

  }
}
</script>

<style>
</style>