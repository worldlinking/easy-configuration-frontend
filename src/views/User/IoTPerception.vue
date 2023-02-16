<template>
  <div>
    <PerceptionAbove :isIoT="true" :Title="Title" :makeDialogShow='makeDialogShow'></PerceptionAbove>
    <div class="IoTPerceptionBelowCon">
      <IoTPerceptionBelow></IoTPerceptionBelow>
    </div>
  </div>
</template>

<script>
import PerceptionAbove from "../../components/User/PerceptionAbove.vue";
import IoTPerceptionBelow from "../../components/User/IoTPerceptionBelow.vue";
export default {
  name: "EasyConfigurationIoTPerception",
  components: {
    PerceptionAbove,
    IoTPerceptionBelow,
  },
  data() {
    return {
      Title: "物联感知",
    };
  },

  mounted() {},

  methods: {
    makeDialogShow(){
      this.dialogTableVisible = true;
    }
  },
};
</script>

<style scoped>
.IoTPerceptionBelowCon {
  width: 100vw;
  height: 42vh;
  display: flex;
  justify-content: center;
}
</style>
