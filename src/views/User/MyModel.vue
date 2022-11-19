<template>
  <div class="MyModelList">
    <el-row class="itemTab" >
      <el-col :span="3">
        <el-button type="primary" @click="$router.push('/user/Model/CreateModel')">创建模型</el-button>
      </el-col>
      <el-col :span="4">
        <el-input v-model="ModelName" placeholder="请输入模型名称">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchModel" style="cursor : pointer;"></i>
        </el-input>
      </el-col>
    </el-row>

    <el-table

        :data="modelsInType.filter(data => !ModelName || data.name.toLowerCase().includes(ModelName.toLowerCase()))"
        border
        style="width: 100%">
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">暂无可用模型，
            <el-button @click="$router.push('/user/Model/CreateModel')" type="text" size="small" style="font-size:14px;">创建模型</el-button>
          </div>
        </div>
      </template>
      <el-table-column
          prop="name"
          label="模型名称"
          min-width="200">
      </el-table-column>
      <el-table-column
          prop="model_type_name"
          label="模型类型"
          min-width="200">
      </el-table-column>
      <el-table-column
          prop="status"
          label="模型状态"
          min-width="200">
        <template slot-scope="scope">
          {{modelStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column
          prop="standModel__name"
          label="标准模型"
          min-width="200">
      </el-table-column>
      <el-table-column
          prop="limit"
          label="权限"
          min-width="200">
        <template slot-scope="scope">
          {{scope.row.limit == '0' ? '公有':'私有'}}
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          min-width="200">
        <template slot-scope="scope">
          <el-button @click="$router.push('/user/Model/TrainModel')" type="text" size="small">训练</el-button>
          <el-button @click="$router.push('/user/Model/VerifyModel')" type="text" size="small">校验</el-button>
          <el-button @click="cancelJob(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import {mapState,mapMutations} from "vuex"
let { ip } = config;
export default {
  name: "MyModel",
  async mounted() {
    this.getAllModel(this)
  },
  methods: {
    ...mapMutations(["getAllModel"]),
    searchModel(){
      console.log('111')
    }
  },
  data(){
    return{
      ModelName:'',
      modelStatus:['未开始训练','训练中','训练完成','训练手动终止','训练出错'],
    }
  },
  computed: {
    ...mapState([
        "models",
        "modelType"
    ]),
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
  }
}
</script>

<style scoped>
.MyModelList{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.itemTab{
  margin-bottom: 1rem
}
</style>
