<template>
  <div class="onlineEarthImage">
    <div id="cesiumContainer"></div>
    <div class="searchCon">
      <el-input
        placeholder="请输入地点名称或坐标：经度,纬度"
        v-model="position"
        class="myInput"
        clearable
        @clear="clearPosition"
      >
        <el-button
          slot="append"
          icon="el-icon-location-outline"
          @click="searchClick"
        ></el-button>
      </el-input>
    </div>

    <div class="paintBtnCon" v-show="hasSearch">
      <div class="paintBtn" @click="startPaint">绘制区域</div>
    </div>

    <div class="selectRemoteCon" v-show="hasSearch">
      <el-form
        :model="form"
        label-position="top"
        :rules="rules"
        ref="datasetForm"
      >
        <el-form-item label="选择影像集" prop="remote">
          <el-select
            v-model="form.remote"
            filterable
            placeholder="请选择"
            @change="selectRemote"
            class="mySelect"
          >
            <el-option
              v-for="(item, index) in remotes"
              :key="item.id"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择波段" v-if="remoteChoose" prop="band">
          <el-select
            v-model="form.band"
            filterable
            placeholder="请选择"
            multiple
            class="mySelect"
          >
            <el-option
              v-for="(item, index) in bands"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分辨率" v-if="remoteChoose" prop="size">
          <el-select
            v-model="form.size"
            filterable
            placeholder="请选择"
            class="mySelect"
          >
            <el-option
              v-for="(item, index) in remotes[currentIndex].size.split(',')"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="predictCon" v-show="hasGetImg">
      <div class="modelSelect">
        <el-form :model="modelForm" ref="datasetForm">
          <el-form-item label="选择模型" prop="remote">
            <el-select
              v-model="modelForm.model"
              filterable
              placeholder="请选择"
              class="mySelect2"
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
        </el-form>
      </div>
      <div class="imagesCon">
        <div class="remoteImage">
          <div class="imageTitle">遥感影像：</div>
          <div class="oneImage">
            <!-- <canvas id="remoteImgCanvas"> </canvas> -->
            <img
              :src="currentRemoteImageSrc"
              alt=""
              class="myImage"
              @click="centerDialogVisible = true"
            />
          </div>
        </div>
      </div>
      <div class="btnCon">
        <el-button type="primary" size="default" @click="predict"
          >预测</el-button
        >
        <el-button type="primary" size="danger" @click="paintAgain"
          >重新绘制</el-button
        >
      </div>
    </div>

    <el-dialog
      title="浏览"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
    >
      <img :src="currentRemoteImageSrc" alt="" class="dialogImage" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadRemote">下载</el-button>
        <el-button @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
var Cesium = require("cesium/Cesium");
import config from "../../assets/configs/config";
import { mapState, mapMutations } from "vuex";
let { ip, nginxRemoteImageIp } = config;
import Tiff from "tiff.js";
const { fromUrl, fromUrls, fromArrayBuffer, fromBlob } = GeoTIFF;
import "../../../node_modules/viewerjs/src/css/viewer.css"; //样式文件不要忘了
import Viewer from "viewerjs";

export default {
  name: "EasyConfigurationOnlineEarthImage",

  data() {
    return {
      currentPosition: null,
      viewer: {},
      position: "",
      hasSearch: false,
      remoteChoose: false,
      infoComplete: false,
      paintStatus: "",
      currentPolygon: {},
      currentPoint: {},
      currentPoint2: {},
      hasGetImg: false,
      currentStartPoint: {
        lat: "",
        lng: "",
      },
      currentEndPoint: {
        lat: "",
        lng: "",
      },
      currentRect: {},
      rects: [],
      remotes: [],
      form: {
        remote: "",
        band: "",
        size: "",
      },
      currentIndex: -1,
      rules: {
        remote: [
          {
            required: true,
            message: "请选择影像集",
            trigger: "blur",
          },
        ],
        band: [
          {
            required: true,
            message: "请选择波段",
            trigger: "blur",
          },
        ],
        size: [
          {
            required: true,
            message: "请选择分辨率",
            trigger: "blur",
          },
        ],
      },
      currentRemoteImageSrc: "",
      modelForm: {
        model: "",
      },
      centerDialogVisible: false,
    };
  },

  mounted() {
    this.initMap();
    this.getRemoteInfo();
    this.getAllModel(this);
    // this.getRemoteImg();
  },

  methods: {
    ...mapMutations(["getAllModel"]),
    initMap() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTYwZWE0NC04YzVmLTRhYjAtOWQ2Yy01ZDQ5MjFlY2RhODgiLCJpZCI6NjU0OTYsImlhdCI6MTYzMDI4ODEyOX0.JtEA58qhQIIbzyWikOtMHysgz7hZEBWZU3Ba7uq38jE";
      const viewer = new Cesium.Viewer("cesiumContainer", {
        // terrainProvider: Cesium.createWorldTerrain(),
      });
      this.viewer = viewer;
      this.initMouseEvent();
      // this.drawImgInPosition(114.605561, 30.463748);
      // this.toPosition(114.605561, 30.463748);
    },
    async searchClick() {
      if (this.hasSearch) {
        this.$message({
          type: "error",
          message: "已经搜索过",
        });
        return;
      }
      //判断是否是经纬度
      var jw = this.position.split(",");
      if (
        jw.length == 2 &&
        !isNaN(Number(jw[0], 10)) &&
        !isNaN(Number(jw[1], 10))
      ) {
        var longitude = parseFloat(jw[0]);
        var latitude = parseFloat(jw[1]);
        this.drawImgInPosition(longitude, latitude);
        this.toPosition(longitude, latitude);
        this.hasSearch = true;
      } else {
        let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.position}&output=json&ak=IphFrgw5cEuIzBaCy44dEBTQankEuoab`;
        const loading = this.$loading({
          lock: true,
          text: "地址查询中......,请稍等",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.$jsonp(url).then((data) => {
          loading.close();
          if (data.status == 0) {
            var longitude = data.result.location.lng;
            var latitude = data.result.location.lat;
            this.drawImgInPosition(longitude, latitude);
            this.toPosition(longitude, latitude);
            this.hasSearch = true;
          } else {
            this.$message({
              message: "请输入正确的地址！",
              type: "warning",
            });
          }
        });
      }
    },
    drawImgInPosition(longitude, latitude) {
      if (this.currentPosition) {
        this.viewer.entities.remove(this.currentPosition);
      }

      this.currentPosition = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        billboard: {
          image: "/images/position.png",
          show: true,
          width: 50,
          height: 50,
        },
      });
    },
    toPosition(longitude, latitude) {
      this.viewer.camera.setView({
        //   destination: Cesium.Cartesian3.fromDegrees(114.605561,30.463748,3000.0),
        destination: Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          10000.0
        ),
        orientation: {
          // 指向
          heading: Cesium.Math.toRadians(0.0, 0),
          // 视角
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      });
    },
    startPaint() {
      if (this.infoComplete == false) {
        this.$message({
          message: "请选择对应的影像集信息后再试！",
          type: "warning",
        });
        return;
      } else if (this.paintStatus == "painted") {
        this.$message({
          message: "已经绘制区域，请清除现有区域后重试！",
          type: "warning",
        });
        return;
      }
      this.paintStatus = "start";
    },
    initMouseEvent() {
      var handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction((movement) => {
        switch (this.paintStatus) {
          case "start":
            var position = this.viewer.scene.camera.pickEllipsoid(
              movement.position,
              this.viewer.scene.globe.ellipsoid
            );
            var ellipsoid = this.viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度
            var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度
            this.currentPoint = this.paintPoint(lng, lat);

            this.currentStartPoint.lng = lng;
            this.currentStartPoint.lat = lat;
            this.paintStatus = "paint";
            break;

          case "paint":
            this.paintStatus = "painted";
            this.currentPoint2 = this.paintPoint(
              this.currentEndPoint.lng,
              this.currentEndPoint.lat
            );
            this.downLoadImg();
            break;
          default:
            break;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction((movement) => {
        switch (this.paintStatus) {
          case "paint":
            var position = this.viewer.scene.camera.pickEllipsoid(
              movement.endPosition,
              this.viewer.scene.globe.ellipsoid
            );

            var ellipsoid = this.viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度
            var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度
            this.currentEndPoint.lng = lng;
            this.currentEndPoint.lat = lat;

            this.paintRect();
            break;
          default:
            break;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    async getRemoteInfo() {
      let res = await axios.get(`${ip}/getRemoteInfo`);
      if (res.data.code == 200) {
        this.remotes = res.data.data;
      } else {
        this.$message({
          message: "影像集信息获取失败!",
          type: "error",
        });
      }
    },
    getMax(arr) {
      let max = arr[0];
      for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          max = arr[i];
        }
      }
      return max;
    },
    getMin(arr) {
      let min = arr[0];
      for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
          min = arr[i];
        }
      }
      return min;
    },
    selectRemote(value) {
      this.currentIndex = value;
      this.remoteChoose = true;
    },
    paintPoint(longitude, latitude) {
      return this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        point: {
          show: true, //是否展示
          pixelSize: 10, //点的大小
          color: Cesium.Color.RED, //颜色
          outlineColor: Cesium.Color.SKYBLUE, //边框颜色
          outlineWidth: 2, //边框宽度
        },
      });
    },
    paintRect() {
      var w =
        this.currentStartPoint.lng < this.currentEndPoint.lng
          ? this.currentStartPoint.lng
          : this.currentEndPoint.lng;
      w = Cesium.Math.toRadians(w);
      var e =
        this.currentStartPoint.lng > this.currentEndPoint.lng
          ? this.currentStartPoint.lng
          : this.currentEndPoint.lng;
      e = Cesium.Math.toRadians(e);

      var s =
        this.currentStartPoint.lat < this.currentEndPoint.lat
          ? this.currentStartPoint.lat
          : this.currentEndPoint.lat;
      s = Cesium.Math.toRadians(s);

      var n =
        this.currentStartPoint.lat > this.currentEndPoint.lat
          ? this.currentStartPoint.lat
          : this.currentEndPoint.lat;
      n = Cesium.Math.toRadians(n);

      if (this.currentPolygon) {
        this.viewer.entities.remove(this.currentPolygon);
      }

      this.currentPolygon = this.viewer.entities.add({
        rectangle: {
          coordinates: new Cesium.Rectangle(w, s, e, n),
          material: Cesium.Color.RED.withAlpha(0.5),
          eyeOffset: new Cesium.Cartesian3(0, 0, -100),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // 三维模式绘制时候设置贴地。不然缩放时候点会偏移
        },
      });
    },
    downloadRemote() {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = "raster.tif";
      a.href = `${nginxRemoteImageIp}/${this.user_id}/raster.tif`;
      a.dispatchEvent(event);
    },
    async downLoadImg() {
      var w =
        this.currentStartPoint.lng < this.currentEndPoint.lng
          ? this.currentStartPoint.lng
          : this.currentEndPoint.lng;
      var e =
        this.currentStartPoint.lng > this.currentEndPoint.lng
          ? this.currentStartPoint.lng
          : this.currentEndPoint.lng;
      var s =
        this.currentStartPoint.lat < this.currentEndPoint.lat
          ? this.currentStartPoint.lat
          : this.currentEndPoint.lat;
      var n =
        this.currentStartPoint.lat > this.currentEndPoint.lat
          ? this.currentStartPoint.lat
          : this.currentEndPoint.lat;

      let data = {
        bands: this.form.band,
        size: parseInt(this.form.size),
        dataset: this.remotes[this.currentIndex].alias,
        polygon: [
          [
            [w, n],
            [w, s],
            [e, s],
            [e, n],
          ],
        ],
      };

      // console.log(data);
      const loading = this.$loading({
        lock: true,
        text: "影像获取中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.post(
        `${ip}/getRemoteImage?user_id=${this.user_id}`,
        data
      );
      loading.close();
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "影像获取成功",
        });
        this.getRemoteImg();
      } else {
        this.$message({
          type: "error",
          message: "影像获取失败",
        });
      }
    },
    async getRemoteImg() {
      const tiff = await fromUrl(
        `${nginxRemoteImageIp}/${this.user_id}/raster.tif`
      );
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();

      // console.log(width,height);

      const [red = [], green = [], blue = []] = await image.readRasters();
      var rMax = this.getMax(red);
      var rMin = this.getMin(red);
      var gMax = this.getMax(green);
      var gMin = this.getMin(green);
      var bMax = this.getMax(blue);
      var bMin = this.getMin(blue);

      const canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      canvas.width = width;
      canvas.height = height;
      let imageData = ctx.createImageData(width, height);

      for (var i = 0; i < imageData.data.length / 4; i += 1) {
        imageData.data[i * 4 + 0] = ((red[i] - rMin) / (rMax - rMin)) * 255.0;
        imageData.data[i * 4 + 1] = ((green[i] - gMin) / (gMax - gMin)) * 255.0;
        imageData.data[i * 4 + 2] = ((blue[i] - bMin) / (bMax - bMin)) * 255.0;
        imageData.data[i * 4 + 3] = 255.0;
      }

      ctx.putImageData(imageData, 0, 0);

      const dataURL = canvas.toDataURL("image/jpeg", 1);
      this.currentRemoteImageSrc = dataURL;
      this.hasGetImg = true;
      // this.bigImage();
    },
    paintAgain() {
      //清除绘制内容
      this.clearRect();
      this.modelForm.model = "";
      this.paintStatus = "start";
      this.hasGetImg = false;
    },
    clearRect() {
      if (this.currentPoint) this.viewer.entities.remove(this.currentPoint);
      if (this.currentPoint2) this.viewer.entities.remove(this.currentPoint2);
      if (this.currentPolygon) this.viewer.entities.remove(this.currentPolygon);
    },
    clearPosition() {
      this.form = {
        remote: "",
        band: "",
        size: "",
      };
      this.hasSearch = false;
      this.paintStatus = "";
      this.hasGetImg = false;
      this.modelForm.model = "";
      this.clearRect();
      this.viewer.camera.flyHome();
      this.viewer.entities.remove(this.currentPosition);
    },
    predict() {
      if (!this.modelForm.model) {
        this.$message({
          type: "error",
          message: "请选择模型后再试",
        });
        return;
      }
    },
  },
  computed: {
    ...mapState(["user_id", "models", "modelType"]),
    bands() {
      if (this.currentIndex == -1) {
        return [];
      } else {
        return this.remotes[this.currentIndex].bands.split(",");
      }
    },
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        console.log(this.form);
        this.$refs["datasetForm"].validate((valid) => {
          if (valid && this.form.size && this.form.band.length > 0) {
            this.infoComplete = true;
          } else {
            this.infoComplete = false;
          }
        });
      },
    },
  },
};
</script>

<style scoped>
.onlineEarthImage {
  height: 100%;
  width: 100%;
  position: relative;
}
.cesiumContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.searchCon {
  position: absolute;
  left: 1vw;
  top: 2vh;
}
.searchIcon:hover {
  cursor: pointer;
}
.myInput {
  width: 20vw;
}
.paintBtnCon {
  position: absolute;
  right: 0.5vw;
  top: 5vh;
  background-color: #0089d2;
  color: white;
  width: 10vw;
  height: 5vh;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
}
.paintBtn {
  font-weight: bolder;
  letter-spacing: 0.2vw;
}
.paintBtnCon:hover {
  cursor: pointer;
  opacity: 0.9;
}
.selectRemoteCon {
  position: absolute;
  left: 1vw;
  top: 8vh;
  /* height: 65vh; */
  width: 15vw;
  background-color: #0089d2;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.5vw;
  border-radius: 5%;
}
.mySelect {
  width: 15vw;
}
.mySelect:hover {
  cursor: pointer;
}
.predictCon {
  position: absolute;
  right: 0.5vw;
  top: 12vh;
  width: 20vw;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 1.5%;
  padding: 10px;
}
.imagesCon {
  height: 45vh;
  width: 100%;
  /* background-color: bisque; */
  overflow: auto;
  border-top: solid black 2px;
}
.btnCon {
  height: 10vh;
  width: 100%;
  /* background-color: cadetblue; */
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: solid black 2px;
}
.modelSelect {
  height: 5vh;
  width: 100%;
  padding: 1vh;
  /* background-color: #0089d2;   */
}
.mySelect2 {
  width: 15vw;
}
.imageTitle {
  font-size: 1vw;
  font-weight: bolder;
}
.oneImage {
  width: 100%;
  height: 30vh;
  overflow: auto;
}
.img {
  width: 100%;
  height: 30vh;
}
.myImage {
  width: 100%;
}
.myImage:hover {
  cursor: zoom-in;
}
.dialogImage {
  width: 100%;
}
</style>
