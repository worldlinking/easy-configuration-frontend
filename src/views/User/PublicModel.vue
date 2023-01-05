<template>
  <div class="publishModel">
    <div class="seeShow">
      <el-button type="primary" size="default" @click="">查看演示</el-button>
    </div>
    <el-table
      :data="trainedModels"
      style="width: 100%"
      @row-click="tableClick"
      :border="true"
    >
      <el-table-column prop="name" label="模型名称"> </el-table-column>
      <el-table-column label="是否发布">
        <template slot-scope="scope">
          <div
            v-if="scope.row.publish == 0"
            class="published"
            style="color: red"
          >
            否
          </div>
          <div v-else class="notPublish">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="publish_weight" label="发布权重">
        <template slot-scope="scope">
          <div v-if="scope.row.publish == 0">暂未发布</div>
          <div v-else>
            {{ scope.row.publish_weight }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="服务地址(post)">
        <template slot-scope="scope">
          <div v-if="scope.row.publish == 0">暂未发布</div>
          <div v-else>
            <el-tooltip content="点击复制" placement="bottom">
              <div
                class="url"
                @click="copyUrl(`${ip}//publishModel?id=${scope.row.id}`)"
              >
                {{ ip + "//" + "publishModel" + "?" + "id=" + scope.row.id }}
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.publish == 0">
            <el-button
              type="primary"
              size="default"
              @click="toPublishModel(scope.row)"
              >发布</el-button
            >
          </div>
          <div v-else>
            <el-button
              type="danger"
              size="default"
              @click="cancelPublishModel(scope.row)"
              >取消</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">注：只能发布已经<span>训练完成</span>的模型</div>

    <el-dialog title="选择要发布的权重" :visible.sync="dialogShow">
      <el-form :model="form">
        <el-form-item label="权重名称" prop="name">
          <el-select
            v-model="form.weight_name"
            placeholder="请选择"
            style="width: 80%"
          >
            <el-option
              v-for="(item, index) in weights"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="makePublishModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;
export default {
  name: "EasyConfigurationPublicModel",

  data() {
    return {
      dialogShow: false,
      currentModel: {},
      form: {
        weight_name: "",
      },
      weights: [],
    };
  },

  mounted() {
    this.getAllModel(this);
    this.ip = ip;
  },

  methods: {
    ...mapMutations(["getAllModel"]),
    tableClick() {},
    async cancelPublishModel(model) {
      const loading = this.$loading({
        lock: true,
        text: "请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let res = await axios.get(
        `${ip}/changeModelPublish?model_id=${model.id}&publish=${0}`
      );
      loading.close();

      if (res.data.code == 200) {
        this.$message({
          message: "取消成功",
          type: "success",
        });
        this.getAllModel(this);
      } else {
        this.$message({
          message: "取消失败",
          type: "error",
        });
      }
    },
    async toPublishModel(model) {
      const loading = this.$loading({
        lock: true,
        text: "请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let res = await axios.get(`${ip}/getWeightName?model_id=${model.id}`);
      loading.close();

      this.weights = res.data.data;
      this.dialogShow = true;
      this.currentModel = model;

      //   let res = await axios.get(
      //     `${ip}/changeModelPublish?model_id=${model.id}&publish=${1}`
      //   );
      //   loading.close();

      //   if (res.data.code == 200) {
      //     this.$message({
      //       message: "发布成功",
      //       type: "success",
      //     });
      //     this.getAllModel(this);
      //   } else {
      //     this.$message({
      //       message: "发布失败",
      //       type: "error",
      //     });
      //   }
    },
    async makePublishModel() {
      const loading = this.$loading({
        lock: true,
        text: "请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.get(
        `${ip}/changeModelPublish?model_id=${
          this.currentModel.id
        }&publish=${1}&publish_weight=${this.form.weight_name}`
      );
      loading.close();

      if (res.data.code == 200) {
        this.$message({
          message: "发布成功",
          type: "success",
        });
        this.getAllModel(this);
        this.dialogShow = false;
      } else {
        this.$message({
          message: "发布失败",
          type: "error",
        });
      }
    },
    copyUrl(url) {
      // console.log(url);
      // const input = document.createElement("input"); // 新增一个input
      // input.style.zIndex = "-9";
      // input.value = url; // 设置文本框的内容
      // input.select(); // 选中文本
      // document.execCommand("copy"); // 执行浏览器复制命令
      var textareaC = document.createElement("textarea");
      textareaC.setAttribute("readonly", "readonly"); //设置只读属性防止手机上弹出软键盘
      textareaC.value = url;
      document.body.appendChild(textareaC); //将textarea添加为body子元素
      textareaC.select();
      var res = document.execCommand("copy");
      document.body.removeChild(textareaC); //移除DOM元素
      this.$message.success("已复制到粘贴板!");
    },
  },

  computed: {
    ...mapState(["models", "modelType"]),
    trainedModels() {
      //选择出已训练完成的模型

      return this.models.filter((model) => {
        return model.status == 2 && model.standModel__type == this.modelType;
      });
    },
  },
};
</script>

<style scoped>
.publishModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.title {
  font-size: 20px;
  font-weight: bolder;
  color: #316dca;
  margin-top: 10px;
}
.title span {
  color: #41b883;
}
.seeShow {
  margin-bottom: 10px;
}
.url:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
