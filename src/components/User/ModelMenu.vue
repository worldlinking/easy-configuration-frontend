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
<!--      <el-menu-item index="/user/Model/ModelIntro" style="fontWeight:bolder;">模型介绍</el-menu-item>-->
<!--      <el-submenu index="2">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-menu"></i>-->
<!--          <span>模型中心</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/user/Model/CreateModel">创建模型</el-menu-item>-->
<!--        <el-menu-item index="/user/Model/MyModel">我的模型</el-menu-item>-->
<!--        &lt;!&ndash; <el-menu-item index="/user/Model/TrainModel">训练模型</el-menu-item> &ndash;&gt;-->
<!--        &lt;!&ndash; <el-menu-item index="/user/Model/VerifyModel">校验模型</el-menu-item> &ndash;&gt;-->
<!--        <el-menu-item index="/user/Model/DownLoadModel">下载模型</el-menu-item>-->
<!--        <el-menu-item index="/user/Model/PublicModel">发布模型</el-menu-item>-->
<!--      </el-submenu>-->

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-upload"></i>
          <span>数据中心</span>
        </template>
        <el-menu-item index="/user/Model/MyDataset">我的数据集</el-menu-item>
<!--        <el-menu-item index="/user/Model/PublicDataset">公开数据集</el-menu-item>-->
<!--        <el-menu-item :index="'/user/Model/'+annPageName">在线标注</el-menu-item>-->
        <el-menu-item index="/user/Model/SpiderJobList">在线爬取</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-marketing"></i>
          <span>预测服务</span>
        </template>
<!--        <el-menu-item index="/user/Model/UseMyModel">使用我的模型</el-menu-item>-->
        <el-menu-item index="/user/Model/UsePublicModel">模型预测</el-menu-item>
        <el-menu-item index="/user/Model/SensorPredict" v-if="type==0">时序数据预测</el-menu-item>
        <el-menu-item index="/user/Model/OnlineEarthImage" v-if="type==0">遥感影像预测</el-menu-item>
        <el-menu-item index="/user/Model/DisasterPredict" v-if="type==1">灾害事件感知</el-menu-item>
        <el-menu-item index="/user/Model/TourismPerception" v-if="type==1">景区形象感知</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {mapState}from 'vuex'
export default {
  name: "EasyConfigurationModelMenu",

  data() {
    return {
      openeds: ["2", "3", "4"],
    };
  },

  mounted() {
    console.log(this.modelIndex,this.type);
  },

  methods: {
    handleClose(key, keyPath) {
      this.$refs.menus.open(keyPath);
    },
  },
  computed:{
    ...mapState(['annPageName','modelIndex','type']),
  }
};
</script>

<style scoped>
.el-submenu.is-opened >>> .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

.el-submenu >>> .el-menu-item{
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
