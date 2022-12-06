<template>
  <div class="createStandModel">
    <div class="formCon">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="训练参数">
          <el-input v-model="form.name" style="width: 30vw">></el-input>
        </el-form-item>

        <el-form-item label="模型类型">
          <el-select
            v-model="form.region"
            placeholder="请选择模型类型"
            style="width: 30vw"
          >
            <el-option label="目标检测" value="shanghai"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据集格式" label-width="auto">
          <el-select
            v-model="form.region"
            placeholder="请选择数据集格式"
            style="width: 30vw"
          >
            <el-option label="目标检测" value="shanghai"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="其他模型信息" label-width="auto">
          <el-input v-model="form.name" style="width: 30vw">></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationCreateStandModel",

  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.createStandModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.formCon {
  width: 40vw;
}
</style>
