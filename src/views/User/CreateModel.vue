<template>
  <div class="CreateModel">
    <div class="modelInfo">
      <div class="title">模型信息</div>
      <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width="100px">
        <el-form-item label="模型名称" prop="name">
          <el-input style="width: 30%" v-model="modelForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标准模型" prop="standModel_id">
          <el-select v-model="modelForm.standModel_id" placeholder="请选择标准模型">
            <el-option
                v-for="(sm, index) in currentStandModel"
                :key="index"
                :label="sm.name"
                :value="sm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型权限" prop="limit">
          <el-select v-model="modelForm.limit" placeholder="请选择模型权限">
            <el-option label="公有" value=0></el-option>
            <el-option label="私有" value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createModel">完成创建</el-button>
          <el-button @click="$router.push('/user/Model/MyModel')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    <div class="userInfo">-->
<!--      <span class="title">个人信息</span>-->

<!--    </div>-->
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  name: "CreateModel",
  data(){
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入模型名称"));
      }
      for (let i = 0; i < this.models.length; i++) {
        if (value == this.models[i].name) {
          callback(new Error("模型名称重复！"));
          break;
        }
      }
      callback();
    };
    return{
      modelForm:{
        name:'',
        standModel_id:'',
        limit:null
      },
      rules:{
        name: [{ validator: validatePass, trigger: "change" }],
        standModel_id: [
          { required: true, message: '请选择标准模型', trigger: 'change' }
        ],
        limit: [
          { required: true, message: '请选择模型权限', trigger: 'change' }
        ],
      },
      userForm:{

      }
    }
  },
  async mounted() {
    await this.getStandModel();
  },
  computed:{
    ...mapState([
        "models",
        "currentStandModel",
    ]),
  },
  methods:{
    ...mapMutations([
      "getStandModel","createAModel"
    ]),
    async createModel() {
      this.$refs["modelForm"].validate((valid) => {
        if (valid) {
          //表单合法则提交
          this.createAModel({ form: this.modelForm, cp: this });
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.CreateModel{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.title{
  font-size: 16px;
  margin-bottom: 1vh;
}
</style>
