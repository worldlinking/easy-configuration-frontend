<template>
  <div class="sensorPredict">
    <div id="cesiumContainer"></div>
    <div class="predictCon" v-show="sensorClicked">
      <!-- 标题 -->
      <div class="predictTitle">传感器时序数据预测</div>
      <!-- 表格 -->
      <div class="sensorDataTable">
        <el-table
          :data="currentSensorData"
          height="250"
          border
          style="width: 100%"
        >
          <el-table-column prop="date" label="时间" width="180" align="center">
          </el-table-column>
          <el-table-column prop="OT" label="温度" width="180" align="center">
          </el-table-column>
        </el-table>
      </div>
      <!-- echarts表格 -->
      <div class="chartCon"></div>
      <!-- 表单 -->
      <div class="formCon">
        <el-form :model="form" label-width="80px" ref="form" :rules="rules">
          <el-form-item label="模型" prop="model">
            <el-select
              v-model="form.model"
              filterable
              placeholder="请选择"
              class="myInput"
            >
              <el-option
                v-for="(item, index) in modelsInType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预测天数" prop="day">
            <el-select
              v-model="form.day"
              filterable
              placeholder="请选择"
              class="myInput"
            >
              <el-option
                v-for="(item, index) in days"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预测按钮 -->
      <div class="btnCon">
        <el-button type="primary" size="default" @click="predict"
          >预测</el-button
        >
        <el-button type="danger" size="default" @click="cancelPredict"
          >取消</el-button
        >
      </div>
    </div>
    <!--热力图容器-->
    <div class="div-heatmap"></div>

    <!-- 当前时间容器 -->
    <div class="currentTimeCon">
      <div class="currentTime">
        {{ currentTime }}
      </div>
      <div class="btns">
        <div title="后退一天" @click="backDay"><</div>
        <div title="后退一小时" @click="backHour">-</div>
        <div title="前进一小时" @click="frontHour">+</div>
        <div title="前进一天" @click="frontDay">></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var Cesium = require("cesium/Cesium");
import config from "../../assets/configs/config";
let { ip } = config;
import { mapState, mapMutations } from "vuex";
import * as echarts from "echarts";
import h337 from "heatmap.js";

export default {
  name: "EasyConfigurationSensorPredict",

  data() {
    return {
      sensors: [],
      sensorEntities: [],
      currentSensorData: [],
      currentChartData: [],
      sensorClicked: false,
      form: {
        model: "",
        day: "",
      },
      days: [1, 2, 3],
      rules: {
        model: [
          {
            required: true,
            message: "请选择影像集",
            trigger: "blur",
          },
        ],
        day: [
          {
            required: true,
            message: "请选择波段",
            trigger: "blur",
          },
        ],
      },
      currentDate: 1,
      currentHour: 0,
      currentDateSensorData: {},
      init: true,
      heatMap:null
    };
  },
  mounted() {
    this.initMap();
    this.toPosition(114.615561, 30.460748);
    this.getAllSensors();
    this.getAllModel(this);
    // console.log(h337);
  },
  computed: {
    ...mapState(["user_id", "models", "modelType"]),
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
    currentTime() {
      return `2023-3-${this.currentDate} ${this.currentHour}:00`;
    },
  },
  methods: {
    ...mapMutations(["getAllModel"]),
    initMap() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTYwZWE0NC04YzVmLTRhYjAtOWQ2Yy01ZDQ5MjFlY2RhODgiLCJpZCI6NjU0OTYsImlhdCI6MTYzMDI4ODEyOX0.JtEA58qhQIIbzyWikOtMHysgz7hZEBWZU3Ba7uq38jE";
      const viewer = new Cesium.Viewer("cesiumContainer", {});
      this.viewer = viewer;
    },
    toPosition(longitude, latitude) {
      this.viewer.camera.setView({
        //   destination: Cesium.Cartesian3.fromDegrees(114.605561,30.463748,3000.0),
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 2000.0),
        orientation: {
          // 指向
          heading: Cesium.Math.toRadians(0.0, 0),
          // 视角
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      });
    },
    async getAllSensors() {
      let res = await axios.get(`${ip}/getAllSensor`);
      if (res.data.code == 200) {
        this.sensors = res.data.data;
        for (var sensor of this.sensors) {
          this.addSensor(sensor.lng, sensor.lat, sensor.id);
        }
      }
      let handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction((event) => {
        // var position = this.viewer.scene.camera.pickEllipsoid(
        //   event.position,
        //   this.viewer.scene.globe.ellipsoid
        // );
        // var ellipsoid = this.viewer.scene.globe.ellipsoid;
        // var cartographic = ellipsoid.cartesianToCartographic(position);
        // var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度
        // var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度

        // console.log(lat,lng);

        let pick = this.viewer.scene.pick(event.position);
        if (Cesium.defined(pick)) {
          var sensor_id = pick.id._id;
          this.handlerClickSensor(sensor_id);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    addSensor(lng, lat, id) {
      // console.log(id);

      return this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        billboard: {
          image: "/images/sensor.png",
          show: true,
          width: 30,
          height: 30,
        },
        id: id + "",
      });
    },
    handlerClickSensor(sensor_id) {
      this.getSensorData(parseInt(sensor_id));
    },
    async getSensorData(id) {
      const loading = this.$loading({
        lock: true,
        text: "数据获取中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.get(`${ip}/getSensorDataById?id=${id}`);
      loading.close();

      if (res.data.code == 200) {
        this.sensorClicked = true;
        this.currentSensorData = res.data.data;
        var xData = [];
        var yData = [];
        for (var i = 0; i < this.currentSensorData.length; i++) {
          xData.push(this.currentSensorData[i].date);
          yData.push(this.currentSensorData[i].OT);
        }
        this.currentChartData = {
          xAxis: {
            type: "category",
            data: xData,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: yData,
              type: "line",
            },
          ],
        };
        setTimeout(() => {
          this.setChartData();
        }, 500);
      } else {
        this.$message({
          message: "数据获取失败！",
          type: "error",
        });
      }
    },
    async setChartData() {
      let chartDom = document.getElementsByClassName("chartCon")[0];
      var myChart = echarts.init(chartDom);
      myChart.setOption(this.currentChartData);
    },
    cancelPredict() {
      this.sensorClicked = false;
      this.currentSensorData = [];
      this.currentChartData = [];
      this.form = {
        model: "",
        day: "",
      };
    },
    predict() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //进行预测
        } else {
          this.$message({
            message: "参数未选择完整！",
            type: "error",
          });
        }
      });
    },
    generateHeatMap(data) {
      //生成热力图
    },
    backDay() {
      if (this.currentDate - 1 <= 0) {
        return;
      }
      this.currentDate--;
    },
    backHour() {
      if (this.currentHour - 1 < 0) {
        return;
      }
      this.currentHour--;
    },
    frontDay() {
      if (this.currentDate + 1 > 15) {
        return;
      }
      this.currentDate++;
    },
    frontHour() {
      if (this.currentHour + 1 > 23) {
        return;
      }
      this.currentHour++;
    },
    paintHeatMap(points, max) {
      if(this.heatMap){
        this.viewer.entities.remove(this.heatMap);
      }

      var width = 600;
      var height = 400;
      var latMin = 30.457655352000614;
      var latMax = 30.46295638477569;
      var lonMin = 114.60947192694219;
      var lonMax = 114.61685594259916;
      for (var point of points) {
        point.x = Math.floor(((point.x - latMin) / (latMax - latMin)) * width);
        point.y = Math.floor((point.y - lonMin) / (lonMax - lonMin) * height);
      }
      // 创建热力图
      var heatmapInstance = h337.create({
        container: document.querySelector(".div-heatmap"),
      });

      var data = {
        max: max,
        data: points,
      };
      
      heatmapInstance.setData(data);

      var canvas = document.getElementsByClassName("heatmap-canvas");

      this.heatMap = this.viewer.entities.add({
        name: "heatmap",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(
            114.60947192694219,
            30.457655352000614,
            114.61685594259916,
            30.46295638477569
          ),
          material: new Cesium.ImageMaterialProperty({
            image: canvas[0],
            transparent: true,
          }),
        },
      });
    },
  },
  watch: {
    currentTime: {
      async handler(newVal) {
        /* 获得指定日期的传感器数据 */
        const loading = this.$loading({
          lock: true,
          text: "数据获取中......,请稍等",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let res = await axios.get(`${ip}/getSensorDataInDate?date=${newVal}`);
        loading.close();
        if (res.data.code == 200) {
          if (this.init) {
            setTimeout(() => {
              let max = -1000;
              this.currentDateSensorData = res.data.data;
              let points = this.currentDateSensorData.map((sensor) => {
                //根据id查询sensor的位置
                var entity = this.viewer.entities.getById(sensor.sensor + "");
                var ellipsoid = this.viewer.scene.globe.ellipsoid;
                var cartesian3 = entity.position._value;
                var cartographic =
                  ellipsoid.cartesianToCartographic(cartesian3);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                if (sensor.OT > max) max = sensor.OT;
                return {
                  x: lat,
                  y: lng,
                  value: sensor.OT,
                };
              });
              this.paintHeatMap(points, max);
            }, 200);
            this.init = false;
          } else {
            let max = -1000;

            this.currentDateSensorData = res.data.data;
            let points = this.currentDateSensorData.map((sensor) => {
              //根据id查询sensor的位置
              var entity = this.viewer.entities.getById(sensor.sensor + "");
              var ellipsoid = this.viewer.scene.globe.ellipsoid;
              var cartesian3 = entity.position._value;
              var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
              var lat = Cesium.Math.toDegrees(cartographic.latitude);
              var lng = Cesium.Math.toDegrees(cartographic.longitude);
              if (sensor.OT > max) max = sensor.OT;

              return {
                x: lat,
                y: lng,
                value: sensor.OT,
              };
            });
            this.paintHeatMap(points, max);
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.sensorPredict {
  position: relative;
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.predictCon {
  position: absolute;
  right: 0.5vw;
  top: 10vh;
  height: 70vh;
  width: 20vw;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 1%;
  padding: 0.5vw;
}
.predictTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
  font-weight: bolder;
  border-bottom: 2px solid black;
}
.sensorDataTable {
  height: 25vh;
  width: 100%;
}
.chartCon {
  width: 100%;
  height: 25vh;
  /* background-color: bisque; */
}
.formCon {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.myInput {
  width: 15vw;
}
.btnCon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vh;
  /* background-color: aquamarine; */
}
.currentTimeCon {
  position: absolute;
  left: 0.5vw;
  top: 3vh;
  width: 15vw;
  height: 6vh;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: aquamarine; */
}
.currentTime {
  width: 50%;
  font-weight: bolder;
}
.btns {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btns div {
  width: 15%;
  font-weight: bolder;
  text-align: center;
}
.btns div:hover {
  cursor: pointer;
  border: 2px black solid;
}
.div-heatmap {
  width: 600px;
  height: 400px;
  display: none;
}
</style>
