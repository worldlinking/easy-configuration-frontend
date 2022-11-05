<template>
  <!-- 主页 -->
  <div class="home">
    <div class="homeContainer">
      <!-- 头部导航栏 -->
      <Header></Header>
      <!-- 中部内容区 -->
      <div class="rvContainer">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/User/Header.vue";
export default {
  name: "Home",
  data() {
    return {};
  },
  created() {},
  components: {
    Header,
  },
  methods: {},
};
</script>

<style scoped>
.homeContainer {
  height: 100vh;
  width: 100vw;
}
.rvContainer{
  height: 92vh;
  width: 100vw;
}
</style>
