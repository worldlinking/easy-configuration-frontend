<template>
<div class="VerifyModel">
  <el-form :model="form" label-width="100px">
    <el-form-item label="选择模型" prop="limit">
      <el-select v-model="form.model" placeholder="请选择模型">
        <el-option label="公有" value=0></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="startVerify">开始校验</el-button>
      <el-button @click="$router.push('/user/Model/MyModel')">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "VerifyModel",
  data(){
    return{
      form:{
        model:'',
      },
    }
  },
  async mounted() {
  },
  methods:{
    startVerify(){

    }
  }
}
</script>

<style scoped>
.VerifyModel{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
</style>
