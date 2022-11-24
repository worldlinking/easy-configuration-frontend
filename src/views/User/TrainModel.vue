<template>
  <div class="TrainModel">
    <el-form :model="form" label-width="100px" label-position="left">
      <el-form-item label="选择模型">
        <el-select v-model="form.modelName" placeholder="请选择训练模型">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="添加数据集">
        <el-button icon="el-icon-plus" @click="centerDialogVisible = true">请选择</el-button>
        <el-dialog
            title="选择数据集"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
          <div class="addDatasetDialog">
            <el-radio-group v-model="Datalimit" class="centerSet">
              <el-radio :label="0">公有数据集</el-radio>
              <el-radio :label="1">私有数据集</el-radio>
            </el-radio-group>
            <br/>
            <el-select v-model="form.dataset"  placeholder="请选择训练数据" class="centerSet">
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-form-item> -->
      <h4>训练配置</h4>
      <el-form-item label="部署方式">
        <span>EasyConfiguration本地部署</span>
      </el-form-item>
      <el-form-item label="选择算法">
        <el-radio-group v-model="form.algorithm">
          <el-radio label="高精度"></el-radio>
          <el-radio label="高性能"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="训练环境">
        <el-table
            :data="form.EnvironmentTable"
            border
            size="small"
            :header-cell-style="{ background:'#F7F7F7'}">
          <el-table-column label="单选" width="50" align="center">
            <template slot-scope="scope">
              <el-radio
                  :label="scope.$index"
                  v-model="form.currentFactor"
                  @change.native="getCurrentRow(scope.row)">
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
              prop="name"
              label="名称"
              min-width="200">
          </el-table-column>
          <el-table-column
              prop="standard"
              label="规格"
              min-width="200">
          </el-table-column>
          <el-table-column
              prop="computility"
              label="算力"
              min-width="200">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">开始训练</el-button>
        <el-button @click="$router.push('/user/Model/MyModel')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "TrainModel",
  data() {
    return {
      centerDialogVisible:false,
      Datalimit:'',
      form: {
        currentFactor: null,
        modelName: '',
        dataset: '',
        algorithm: '',
        EnvironmentTable: [{
          name: 'GPU P40',
          standard: 'TeslaGPU_P40_24G显存单卡_12核CPU_40G内存',
          computility: '12 TeraFLOPS'
        }, {
          name: 'GPU P40',
          standard: 'TeslaGPU_P40_24G显存单卡_12核CPU_40G内存',
          computility: '12 TeraFLOPS'
        },]
      },
    }
  },
  methods: {
    getCurrentRow(row) {
      console.log(row)
    },
    addDataset() {
      
    },
    submitForm() {

    }
  }
}
</script>

<style scoped>
.TrainModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.addDatasetDialog .centerSet{
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>
