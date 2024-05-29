<template>
  <div class="disasterPredict">
    <div id="cesiumContainer"></div>

    <div class="selectCon">
      <el-select @change="reUpload" v-model="selectedSpiderJob" placeholder="请选择爬虫数据">
        <el-option
            v-for="(item, index) in spiderJobs"
            :key="index"
            :label="item.taskName"
            :value="item.id"
        ></el-option>
      </el-select>
      <el-dropdown @command="handleCommand">
        <el-button type="primary" style="margin-left: 0.5vw">
          空间位置可视化<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="checkIn">签到位置</el-dropdown-item>
          <el-dropdown-item command="textLoc">文本位置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="handleHeatMapCommand">
        <el-button type="primary" style="margin-left: 0.5vw">
          空间位置热力图<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="checkIn">签到位置</el-dropdown-item>
          <el-dropdown-item command="textLoc">文本位置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" style="margin-left: 0.5vw" v-if="false" @click="showDynamicHeatMap">空间位置热力图</el-button>
      <el-button type="primary" style="margin-left: 0.5vw" @click="showTopicCloud">主题词云展示</el-button>
      <el-button type="primary" style="margin-left: 0.5vw" @click="showEmotion">情感时空可视化</el-button>
    </div>

    <!--时间轴容器-->
    <div class="m-timeline-wrap" v-show="showTimeline">
      <div class="m-time-dot">
        <div
            :class="['m-dot-box', {'active': active===item.year}]"
            @click="onClickYear(item.year)"
            v-for="(item, index) in timelineData"
            :key="index">
          <p :class="['u-year', {'font_active': active===item.year}]">{{ item.year }}</p>
          <div class="m-dot">
            <div class="u-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="tagContainer" v-show="showTimeline">
      <div style="font-size: 20px;margin: 15px">图例</div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: red"></div>
        <div style="font-size: 16px;margin-left: 20px">happy</div>
      </div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: yellow"></div>
        <div style="font-size: 16px;margin-left: 20px">neutral</div>
      </div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: #2FFC2B"></div>
        <div style="font-size: 16px;margin-left: 20px">surprise</div>
      </div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: #201B7A"></div>
        <div style="font-size: 16px;margin-left: 20px">fear</div>
      </div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: #860C7F"></div>
        <div style="font-size: 16px;margin-left: 20px">angry</div>
      </div>
      <div class="colorItem" style="display: flex;margin-left: 15px;margin-bottom: 10px">
        <div style="width: 30px;height: 18px;background-color: #3A93DA"></div>
        <div style="font-size: 16px;margin-left: 20px">sad</div>
      </div>

    </div>

    <div class="wordCloudContainer" v-show="showWordCloud">
      <div class="leftChart">
        <div class="chartContainer">
          <div id="resultChart_0" class="chartCanvas"/>
        </div>
        <div class="chartContainer" style="margin-top: 10vh">
          <div id="resultChart_1" class="chartCanvas"/>
        </div>
      </div>

      <div class="rightChart">
        <div class="chartContainer">
          <div id="resultChart_2" class="chartCanvas"/>
        </div>
        <div class="chartContainer">
          <div id="resultChart_3" class="chartCanvas"/>
        </div>
        <div class="chartContainer">
          <div id="resultChart_4" class="chartCanvas"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

var Cesium = require('cesium/Cesium')
import {mapState, mapMutations} from 'vuex'
import config from "../../assets/configs/config";
let {ip, nginxRemoteImageIp} = config;
import * as echarts from "echarts";
import 'echarts-wordcloud';
import {gcj02_to_wgs84} from '../../assets/utils/wgs84_to_gcj02'
import {createHeatMap, createRectangle, getData} from '../../assets/utils/drawHeatmap'

export default {
  name: "DisasterPredict",
  data() {
    return {
      selectedSpiderJob: '',
      viewer: null,
      showWordCloud: false,
      showTimeline:false,
      heatMap: null,
      emotionResult: [],
      timelineData: [
        {
          year: 22
        },
        {
          year: 21
        },
        {
          year: 20
        },
        {
          year: 19
        },
        {
          year: 18
        },{
          year: 17
        },{
          year: 16
        },{
          year: 15
        },
      ],
      active: 2020,
      topicResult: [
        // {
        //   "result": "暴雨,河南,内涝,城市,郑州,防汛,自救,预警,强降雨,应急,大暴雨,灾害,毫米,发布,天气,避险,多地,河南省,地区,救援",
        //   "pro": "291.075,248.626,228.093,217.361,166.057,139.064,137.853,136.415,119.822,117.303,117.273,113.307,112.414,107.045,97.545,95.931,92.823,81.211,81.105,80.843"
        // },
        // {
        //   "result": "能量,郑州市,爱豆,身边,郑州,像是,光芒,太阳,世界,日常,一把,风景,绝美,死亡,元气,一件,挡住,充满,林墨,变得",
        //   "pro": "184.635,77.911,73.41,69.605,40.935,40.43,40.265,40.213,40.121,39.552,38.902,38.738,38.696,38.033,37.094,37.056,36.448,36.402,36.285,36.19"
        // },
        // {
        //   "result": "武警,河南,紧急,150,参与,抢险,救援,官兵,总队,余名,郑州,自然灾害,归来,山体,出动,余件,5800,支队,皮划艇,携带",
        //   "pro": "45.546,44.43,40.031,35.279,34.338,32.404,32.349,26.983,25.326,25.006,24.056,23.506,21.991,21.867,21.806,21.325,21.313,21.2,20.945,20.866"
        // },
        // {
        //   "result": "暴雨,超市,门店,安徽,损失,被淹,雨水,倒灌,真的,米面,400,工作人员,希望,一场,内涝,下雨,自救,淮南,大暴雨,外面",
        //   "pro": "105.866,68.819,67.782,66.178,62.208,51.95,49.372,46.683,45.67,44.646,43.366,42.466,42.144,37.249,34.624,34.544,33.687,33.06,32.73,32.361"
        // },
        // {
        //   "result": "暴雨,防汛,诱发,应急,河南省,来临,发生,平原,提升,响应,预防,低洼,郑州市,地势,内涝,视频,灾害,指挥,级别,泥石流",
        //   "pro": "54.714,50.627,41.319,31.076,29.314,28.485,27.072,25.055,23.848,23.502,22.847,22.568,22.261,22.076,21.866,20.412,19.823,19.696,19.608,19.407"
        // }
      ],
    }
  },
  async mounted() {
    this.initMap()
    await this.getAllSpiderJobs(this);
  },
  computed: {
    ...mapState(["spiderJobs", "user_id"]),
    topicChartOption() {
      return function (id) {
        let topicData = this.topicResult[id]
        let result = topicData['result'].split(',')
        let pro = topicData['pro'].split(',')
        let data = []
        for (let i = 0; i < result.length; i++) {
          let line = {
            name: result[i],
            value: pro[i],
          }
          data.push(line)
        }
        console.log(data)
        let option = {
          series: [{
            type: 'wordCloud',
            // shape这个属性虽然可配置，但是在词的数量不太多的时候，效果不明显，它会趋向于画一个椭圆
            shape: 'circle',
            // 这个功能还没用过
            keepAspect: false,
            // 这个是可以自定义背景图片的，词云会按照图片的形状排布，所以有形状限制的时候，最好用背景图来实现，而且，这个背景图一定要放base64的，不然词云画不出来
            // maskImage: maskImage,
            // 下面就是位置的配置
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            // 词的大小，最小12px，最大60px，可以在这个范围调整词的大小
            sizeRange: [12, 60],
            // 每个词旋转的角度范围和旋转的步进
            rotationRange: [-80, 80],
            rotationStep: 45,
            // 词间距，数值越小，间距越小，这里间距太小的话，会出现大词把小词套住的情况，比如一个大的口字，中间会有比较大的空隙，这时候他会把一些很小的字放在口字里面，这样的话，鼠标就无法选中里面的那个小字，这里可以用函数根据词云的数量动态返回间距
            gridSize: 8,
            // 允许词太大的时候，超出画布的范围
            drawOutOfBound: false,
            // 布局的时候是否有动画
            layoutAnimation: true,
            // 这是全局的文字样式，相对应的还可以对每个词设置字体样式
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              // 颜色可以用一个函数来返回字符串，这里是随机色
              color: function () {
                // Random color
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              focus: 'self',
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: '#333'
              }
            },

            // 数据必须是一个数组，数组是对象，对象必须有name和value属性
            data: data
          }]
        }
        return option
      }
    }
  },
  methods: {
    ...mapMutations(["getAllSpiderJobs"]),
    initMap() {
      Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTYwZWE0NC04YzVmLTRhYjAtOWQ2Yy01ZDQ5MjFlY2RhODgiLCJpZCI6NjU0OTYsImlhdCI6MTYzMDI4ODEyOX0.JtEA58qhQIIbzyWikOtMHysgz7hZEBWZU3Ba7uq38jE"
      const viewer = new Cesium.Viewer("cesiumContainer", {
        // terrainProvider: Cesium.createWorldTerrain(),
      })
      this.viewer = viewer
    },
    async handleCommand(command) {
      if (!this.selectedSpiderJob) {
        this.$message({
          type: "error",
          message: "请先选择爬虫数据！",
        });
        return;
      }
      let point_list = []
      this.removeEntity()

      if (command === 'checkIn') {
        let postUrl = `${ip}/spider/getAllCheckin/`;
        let formData = new FormData();
        formData.append("task_id", this.selectedSpiderJob);
        formData.append("user_id", this.user_id);

        let res = await axios.post(postUrl, formData);

        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "获取签到点成功",
          });
          point_list = res.data.data
          for (let i = 0; i < point_list.length; i++) {
            this.drawPoint(point_list[i], '/images/point.png', point_list[i].count * 2 + 30)
          }
          this.flyToChina()
        }
      } else if (command === 'textLoc') {
        let postUrl = `${ip}/spider/getAllTextloc/`;
        let formData = new FormData();
        formData.append("task_id", this.selectedSpiderJob);
        formData.append("user_id", this.user_id);

        let res = await axios.post(postUrl, formData);

        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "成功获取文本位置",
          });
          point_list = res.data.data
          for (let i = 0; i < point_list.length; i++) {
            this.drawPoint(point_list[i], '/images/point.png', point_list[i].count * 2 + 30)
          }
          this.flyToChina()
        }
      }
    },
    //高德和微博采用的坐标系均为gcj02坐标系
    drawPoint(value, img, size) {
      // console.log('before',value.longitude,value.latitude)
      // let tranform=gcj02_to_wgs84(value.longitude,value.latitude)
      // console.log('after',tranform)
      let text;
      if (value.hasOwnProperty("count")) {
        text = value.count
      } else {
        // text = value.result
        text = ''
      }
      let entity = this.viewer.entities.add({
        name: `longitude:${value.longitude},latitude:${value.latitude}`,
        position: Cesium.Cartesian3.fromDegrees(value.longitude, value.latitude, 1),
        billboard: {
          image: this.combineIconAndLabel(img, text, 64),
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: size,
          height: size
        }
      })
    },
    combineIconAndLabel(url, label, size) {
      // 创建画布对象
      let canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      let ctx = canvas.getContext("2d");

      let promise = new Cesium.Resource.fetchImage(url).then(image => {
        // 异常判断
        try {
          ctx.drawImage(image, 0, 0, size, size);
        } catch (e) {
          console.log(e);
        }
        // 渲染字体
        // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
        ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
        ctx.font = 'bold 20px Microsoft YaHei';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, size / 2, size / 2);

        return canvas;
      });
      return promise;
    },
    removeEntity() {
      let entitys = this.viewer.entities._entities._array;
      //每次删除一个实体之后其余实体id会减1
      for (let i = 0; i < entitys.length; i++) {
        this.viewer.entities.remove(entitys[i]);
        i--;
      }
    },
    flyToChina() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.435314, 40.960521, 6000000.0),
      });
    },
    reUpload() {

    },
    async predict(weight_id) {
      if (!this.selectedSpiderJob) {
        this.$message({
          type: "error",
          message: "请先选择爬虫数据！",
        });
        return;
      }
      let postUrl = `${ip}/spider/PredictSpiderText/`;
      const formData = new FormData();
      formData.append("weight_id", parseInt(weight_id));
      formData.append("task_id", this.selectedSpiderJob);
      formData.append("user_id", this.user_id);
      if (weight_id === '15') {
        formData.append("show_location", true);
      }

      let res = await axios.post(postUrl, formData);

      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "预测成功!",
        });
        if (weight_id === '16') {
          this.showWordCloud = !this.showWordCloud

          this.topicResult = res.data.preResult
          this.$nextTick(() => {
            for (let i = 0; i < 5; i++) {
              this.initCharts(i)
            }
          })
        } else if (weight_id === '15') {
          this.emotionResult = res.data.preResult
          let timeList = this.emotionResult.map(function (item) {
            return item['time'];
          });
          let time=[...new Set(timeList)]
          this.timelineData=time.map(function (item) {
            return {
              year: item
            };
          });
          console.log(this.timelineData)
          this.showWordCloud=false
          this.showTimeline=!this.showTimeline
          this.getEmoPoint(this.emotionResult)
        }
      }
    },
    getEmoPoint(pointList){
      this.removeEntity()
      for (let i = 0; i < pointList.length; i++) {
        //'happy','neutral','surprise','fear','angry','sad'
        if (pointList[i].result === 'happy') {
          this.drawPoint(pointList[i], '/images/happy.png', 40)
        } else if (pointList[i].result === 'neutral') {
          this.drawPoint(pointList[i], '/images/neutral.png', 40)
        } else if (pointList[i].result === 'surprise') {
          this.drawPoint(pointList[i], '/images/surprise.png', 40)
        }else if (pointList[i].result === 'fear') {
          this.drawPoint(pointList[i], '/images/fear.png', 40)
        }else if (pointList[i].result === 'angry') {
          this.drawPoint(pointList[i], '/images/angry.png', 40)
        }else if (pointList[i].result === 'sad') {
          this.drawPoint(pointList[i], '/images/sad.png', 40)
        }
        this.flyToChina()
      }
    },
    initCharts(id) {
      const myChart = echarts.init(document.getElementById('resultChart_' + id))
      myChart.setOption(this.topicChartOption(id));
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    showTopicCloud() {
      //获取数据的主题及概率
      this.predict('16')//主题挖掘模型
    },
    showEmotion() {
      this.predict('15')//情感分析模型
    },
    addHeatMap(datas) {
      if (this.heatMap) {
        this.viewer.entities.remove(this.heatMap);
      }
      // let datas= [
      //   //北京
      //   {latitude: 39.90403, longitude: 116.40752599999996, value: 50},
      //   {latitude: 43.793028, longitude: 87.62781199999995, value: 100},
      //   {latitude: 19.10360769974505, longitude: 110.12695312500001, value: 100},
      //   {latitude: 33.6146550313673, longitude: 116.89453125000001, value: 100},
      //   {latitude: 45.59869571681977, longitude: 168.44238281250003, value: 100},
      //   {latitude: 39.673337359973665, longitude: 122.60742187500001, value: 100},
      //   //天津
      //   {latitude: 39.04048630050685, longitude: 117.21313476562501, value: 100}
      // ]
      var coordinate = [73, 3, 136, 54];//中国矩形范围
      let points = getData(datas, coordinate)
      console.log(points)
      var heatMap1 = createHeatMap(points.max, points.data);
      this.heatMap = createRectangle(this.viewer, coordinate, heatMap1);
      this.viewer.flyTo(this.heatMap)
    },
    async handleHeatMapCommand(command){
      if (!this.selectedSpiderJob) {
        this.$message({
          type: "error",
          message: "请先选择爬虫数据！",
        });
        return;
      }
      let point_list = []
      this.removeEntity()

      if (command === 'checkIn') {
        let postUrl = `${ip}/spider/getAllCheckin/`;
        let formData = new FormData();
        formData.append("task_id", this.selectedSpiderJob);
        formData.append("user_id", this.user_id);

        let res = await axios.post(postUrl, formData);

        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "获取签到点成功",
          });
          point_list = res.data.data
        }
      } else if (command === 'textLoc') {
        let postUrl = `${ip}/spider/getAllTextloc/`;
        let formData = new FormData();
        formData.append("task_id", this.selectedSpiderJob);
        formData.append("user_id", this.user_id);

        let res = await axios.post(postUrl, formData);

        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "成功获取文本位置",
          });
          point_list = res.data.data
        }
      }
      this.addHeatMap(point_list)
    },
    showDynamicHeatMap(){
      // this.addHeatMap(datas)
    },
    onClickYear(year) {
      if (this.active !== year) {
        this.active = year
        let yearEmo=this.emotionResult.filter((value) => {
          return value['time']===year;
        });
        this.getEmoPoint(yearEmo)
      }
    }
  }
}
</script>

<style scoped>
.disasterPredict {
  height: 100%;
  width: 100%;
  position: relative;
}

#cesiumContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.selectCon {
  position: absolute;
  left: 1vw;
  top: 2vh;
}

.leftChart {
  position: absolute;
  left: 1vw;
  top: 10vh;
  height: 68vh;
  width: 27%;
}

.rightChart {
  position: absolute;
  right: 0.2vw;
  top: 6vh;
  height: 80vh;
  width: 27%;
}

.tagContainer{
  position: absolute;
  left: 1vw;
  top: 10vh;
  height: 28vh;
  width: 10vw;
  background-color: #fff;
}

.chartContainer {
  width: 85%;
  height: 25vh;
  margin: 1.5vh;
}

.chartCanvas {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}

.m-timeline-wrap {
  position: absolute;
  left: 10vw;
  bottom: 12vh;
  height: 3px;
  width: 70vw;
  background: #8dc6f5;
}

.m-time-dot {
  display: flex;
  justify-content: space-around;
}

.m-dot-box {
  cursor: pointer;
  text-align: center;
  transform: translateY(-35px);
}

.u-year {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  transform: translateY(-8px);
  transition: all 0.3s ease;
}

.m-dot {
  margin: 0 auto;
  width: 14px;
  height: 14px;
  background: #8dc6f5;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.u-dot {
  width: 14px;
  height: 14px;
  background: #8dc6f5;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.active{
  transform: translateY(-45px);
}
.font_active{
  font-size: 30px;
  color: #25b0f3;
  /*transform: translateY(-45px);*/
}
</style>
