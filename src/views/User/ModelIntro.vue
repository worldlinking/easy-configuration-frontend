<template>
<div class="ModelIntro">
  <div class="DescriptContainer title">
    <strong style="font-size: 1.3rem">{{modelName}}</strong>
    <strong >模型介绍</strong>
    <p style="margin-top: 0.5rem">{{this.modelDescription.description}}</p>
  </div>

  <div class="detailContainer title">
    <strong class="title">模型原理</strong>
    <p style="margin-top: 0.5rem">{{this.modelDescription.detail}}</p>
  </div>

  <div class="typicalModel title">
    <strong>典型模型</strong>
    <div style="margin-top: 0.5rem">
      <el-tag v-for="(item,i) in this.modelDescription.models" :key="i" type="info" style="margin-right: 1rem">{{item}}</el-tag>
    </div>
  </div>

  <div class="exampleContainer title">
    <strong>应用案例</strong>
    <el-carousel :interval="4000" type="card" height="20vw">
      <el-carousel-item v-for="(item,i) in this.modelDescription.imgs" :key="i">
        <div class="pic_item">
          <img class="small" :src=item.path  alt="">
          <h3>{{ item.title }}</h3>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  name: "ModelIntro",
  data(){
    return {
      modelDescription:'',
    }
  },
  computed:{
    ...mapState(['modelType','modelName'])
  },
  mounted() {
    const descriptJson = require("../../assets/data/modelDescriptions.json");
    this.modelDescription=descriptJson.description[this.modelType]
    console.log(this.modelDescription)
  }
}
</script>

<style scoped>
.ModelIntro{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}

.title{
  font-size: 16px;
  margin-bottom: 5vh;
}

.small {
  width: 100%;
  height: 100%;
  position: relative;
}

.pic_item {
  position: relative;
  height: 100%;
}
.pic_item:hover{
  cursor: pointer;
}

.pic_item img {
  width: 100%;
  height: 100%;
}

.pic_item h3 {
  position: absolute;
  left: 0rem;
  bottom: 0rem;
  background-color: rgba(49,51,53,0.5);
  height: 10%;
  width: 100%;
  padding: 2rem;
  color: white;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
