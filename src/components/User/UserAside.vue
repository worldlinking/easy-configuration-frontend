<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo asideMenu"
      background-color="#01386f"
      text-color="white"
      active-text-color="rgb(63,181,129)"
      unique-opened
      :default-active="'1-1'"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>物联感知融合</span>
        </template>

        <el-menu-item-group>
          <template slot="title">计算机视觉</template>
          <el-menu-item index="1-1">目标检测</el-menu-item>
          <el-menu-item index="1-2">实例分割</el-menu-item>
          <el-menu-item index="1-3">语义分割</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="红外">
        </el-menu-item-group>
        <el-menu-item-group title="雷达">
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>社会感知融合</span>
        </template>

        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="分组2">
          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-menu-item-group>

        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "UserAside",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.asideMenu {
  height: 92vh;
  overflow: auto;
}
</style>
