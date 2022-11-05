<template>
  <div>
    <div class="aboveArea">
        <NavigationAbove></NavigationAbove>
    </div>
    <div class="belowArea">
        <NavigationBelow></NavigationBelow>
    </div>
  </div>
</template>

<script>
import NavigationAbove from '../../components/User/NavigationAbove.vue'
import NavigationBelow from '../../components/User/NavigationBelow.vue'
export default {
  name: "EasyConfigurationNavigation",
  components:{
    NavigationAbove,
    NavigationBelow
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.aboveArea{
    height: 46vh;
    /* background: rgb(233,241,255); */
    background: linear-gradient(to top, white,  rgb(233,241,255));;
    position: relative;
    display: flex;
    justify-content: center;
}
.belowArea{
    height: 46vh;
    position: relative;
    display: flex;
    justify-content: center;
}
</style>
