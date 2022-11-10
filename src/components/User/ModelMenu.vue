<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @close="handleClose"
      ref="menus"
      :default-openeds="openeds"
      background-color="rgb(245,245,245)"
      :router="true"
    >
      <el-menu-item index="1" style="fontWeight:bolder;">模型介绍</el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>模型中心</span>
        </template>
        <el-menu-item index="2-1">我的模型</el-menu-item>
        <el-menu-item index="2-2">创建模型</el-menu-item>
        <el-menu-item index="2-3">训练模型</el-menu-item>
        <el-menu-item index="2-4">校验模型</el-menu-item>
        <el-menu-item index="2-5">发布模型</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-upload"></i>
          <span>数据中心</span>
        </template>
        <el-menu-item index="3-1">我的数据集</el-menu-item>
        <el-menu-item index="3-2">公开数据集</el-menu-item>
        <el-menu-item index="3-3">在线标注</el-menu-item>
        <el-menu-item index="3-4">在线爬取</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-marketing"></i>
          <span>预测服务</span>
        </template>
        <el-menu-item index="4-1">使用我的模型</el-menu-item>
        <el-menu-item index="/user/Model/UsePublicModel">使用公开模型</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationModelMenu",

  data() {
    return {
      openeds: ["2", "3", "4"],
    };
  },

  mounted() {},

  methods: {
    handleClose(key, keyPath) {
      this.$refs.menus.open(keyPath);
    },
  },
};
</script>

<style scoped>
.el-submenu.is-opened >>> .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

.el-submenu >>>.el-menu-item{
  height: 36.5px;
  line-height: 36.5px;
  font-weight: 500;
}
.el-submenu >>> .el-submenu__title{
  height: 50px;
  color:#AAAAAA;
  height: 50px;
}
</style>
