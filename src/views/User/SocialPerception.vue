<template>
  <div>
    <PerceptionAbove :isIoT="false" :Title="Title"></PerceptionAbove>
    <div class="socialPerceptionBelowCon">
        <socialPerceptionBelow></socialPerceptionBelow>
    </div>
  </div>
</template>

<script>
import PerceptionAbove from "../../components/User/PerceptionAbove.vue";
import socialPerceptionBelow from "../../components/User/socialPerceptionBelow.vue";
export default {
  name: "EasyConfigurationSocialPerception",
  data() {
    return {
      Title: "互联感知",
    };
  },
  components: {
    PerceptionAbove: PerceptionAbove,
    socialPerceptionBelow: socialPerceptionBelow,
  },
  mounted() {},

  methods: {},
};
</script>

<style scoped>
.socialPerceptionBelowCon {
  width: 100vw;
  height: 42vh;
  display: flex;
  justify-content: center;
}
</style>
