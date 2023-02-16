<template>
  <div class="IOTDatasetDetail">
    <div class="cardCon" v-for="image in data">
      <el-card :body-style="{ padding: '0px' }" class="myCard">
        <img
          height="125px"
          width="125px"
          :src="`${nginxDatasetsIp}/user${currentDataset.user_id}/${currentDataset.name}/images/${image.folder}/${image.name}`"
          class="image"
        />
        <div style="padding: 14px">
          <div class="imgName">{{ image.name }}</div>
          <div class="otherInfo">
            <div class="info">所属:{{ image.folder }}</div>
            <div class="info">
              是否标注:{{ image.isLabel == 0 ? "否" : "是" }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="btnCon">
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp, nginxDatasetsIp } = config;
export default {
  name: "EasyConfigurationDatasetDetail",

  data() {
    return {
      data: [],
      nginxDatasetsIp,
      currentDataset: {},
    };
  },

  async mounted() {
    // this.currentDataset = this.$route.params;
    this.currentDataset = { name: "chenyi123", user_id: 1 };
    var id = 32;
    const loading = this.$loading({
      lock: true,
      text: "数据加载中......,请稍等",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    let res = await axios.get(`${ip}/getDatasetImageList?id=${id}`);
    loading.close();
    if (res.data.code != 200) {
      this.$message({
        message: "数据加载失败！清检查网络后再试！",
        type: "error",
      });
    } else {
      var data = res.data.data;
      //处理数据
      for (var folder in data) {
        for (var oneImage of data[folder]) {
          var obj = {};
          obj.name = Object.keys(oneImage)[0];
          obj.isLabel = oneImage[obj.name];
          obj.folder = folder;
          this.data.push(obj);
        }
      }
    }
  },

  methods: {
    back() {
      this.$router.push({
        name:"PublicDataset"
      });
    },
  },
  computed: {},
};
</script>

<style scoped>
.IOTDatasetDetail {
  padding-left: 1vw;
  padding-right: 1vw;
  width: 83vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  position: relative;
}
.cardCon {
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
}
.myCard {
  width: 125px;
}
.imgName {
  font-size: 0.1vw;
}
.otherInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.info {
  font-size: 0.1vw;
}
.image:hover {
  cursor: pointer;
}
.btnCon {
  position: absolute;
  top: 1vh;
  right: 2vw;
}
</style>
