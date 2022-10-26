<template>
  <div class="UserContent">
    <!-- 描述文字 -->
    <div class="descriptionTextC">

    </div>
    <!-- 轮播图 -->
    <div class="imgsC">

    </div>
    <!-- 已有模型 -->
    <div class="currentModelC">

    </div>
  </div>
</template>

<script>
export default {
  name: "UserContent",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.UserContent {
  position: relative;
}
.descriptionTextC{
    position: absolute;
    left: 0;
    top: 0;
    width: 30vw;
    height: 85vh;
    background-color: aquamarine;
}
</style>
