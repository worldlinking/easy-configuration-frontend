<template>
  <div>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @close="handleClose"
      ref="menus"
      :default-openeds="openeds"
      background-color="rgb(245,245,245)"
      :router="true"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="">用户信息管理</el-menu-item>
        <el-menu-item index="/admin/UserModelManage">用户模型管理</el-menu-item>
        <el-menu-item index="">用户数据集管理</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>模型管理</span>
        </template>
        <el-menu-item index="/admin/CreateStandModel">创建我的标准模型</el-menu-item>
        <el-menu-item index="/admin/ManageModel">管理我的标准模型</el-menu-item>
        <el-menu-item index="/admin/UploadStandModelWeight">管理标准模型权重</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-upload"></i>
          <span>官方操作</span>
        </template>
        <el-menu-item index="/admin/UploadPublicDataset">上传官方数据集</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationModelMenu",

  data() {
    return {
      openeds: ["1", "2", "3"],
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

.el-submenu >>> .el-menu-item {
  height: 36.5px;
  line-height: 36.5px;
  font-weight: 500;
}
.el-submenu >>> .el-submenu__title {
  height: 50px;
  color: #aaaaaa;
  height: 50px;
}
</style>
