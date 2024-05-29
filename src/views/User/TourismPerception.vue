<template>
  <div class="tourismPerception">
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
          景区空间分布<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="hot">按热度展示</el-dropdown-item>
          <el-dropdown-item command="score">按评分展示</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" style="margin-left: 0.5vw" @click="getWordCount">评论词频排行榜</el-button>
      <el-button type="primary" style="margin-left: 0.5vw" @click="showTopicCloud">评论主题词云</el-button>
      <el-button type="primary" style="margin-left: 0.5vw" @click="senseScenic">景区情感形象</el-button>
    </div>

    <el-card class="wordCountList" v-if="showWordCount">
      <div style="display: flex;">
        <div style="margin:0 1.5vw">排名</div>
        <div style="margin-right: 1.8vw">词汇</div>
        <div>词频</div>
      </div>
      <el-divider></el-divider>
      <div v-for="(item,id) in wordCount" :key="id" >
        <el-row style="margin-left: 1.5vw">
          <el-col v-if="id === 0" :span="7"><el-image style="width: 1.5vw; height: 3vh;" src="/images/rank1.png"></el-image></el-col>
          <el-col v-else-if="id === 1" :span="7"><el-image style="width: 1.5vw; height: 3vh;" src="/images/rank2.png"></el-image></el-col>
          <el-col v-else-if="id === 2" :span="7"><el-image style="width: 1.5vw; height: 3vh;" src="/images/rank3.png"></el-image></el-col>
          <el-col v-else :span="7">{{ id }}</el-col>
          <el-col :span="9">{{ item[0] }}</el-col>
          <el-col :span="6">{{ item[1] }}</el-col>
        </el-row>
        <el-divider></el-divider>
      </div>
    </el-card>

    <div class="wordCloudContainer" >
      <div class="leftChart" v-show="showWordCloud || showEmoChart">
        <div class="chartContainer">
          <div id="resultChart_0" class="chartCanvas"/>
        </div>
        <div class="chartContainer" style="margin-top: 6vh">
          <div id="resultChart_1" class="chartCanvas"/>
        </div>
      </div>

      <div class="rightChart" v-show="showWordCloud">
        <div class="chartContainer">
          <div id="resultChart_2" class="chartCanvas"/>
        </div>
        <div class="chartContainer" style="margin-top: 10vh">
          <div id="resultChart_3" class="chartCanvas"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mapMutations, mapState} from 'vuex'
import config from "../../assets/configs/config";
import * as echarts from "echarts";
import 'echarts-wordcloud';
import {gcj02_to_wgs84} from '../../assets/utils/wgs84_to_gcj02'

var Cesium = require('cesium/Cesium')
let {ip, nginxRemoteImageIp} = config;

export default {
  name: "TourismPerception",
  data() {
    return {
      selectedSpiderJob: '',
      viewer: null,
      poiList: [],
      commentList: [],
      showWordCloud: false,
      showEmoChart:false,
      showWordCount:false,
      wordCount: [],
      topicResult: [],
      emoResult:[],
      handler:null,
    }
  },
  async mounted() {
    this.initMap()
    await this.getAllSpiderJobs(this)
  },
  computed: {
    ...mapState(["spiderJobs", "user_id"]),
    allEmoOption(){
      let pos=this.countNum(this.emoResult,'happy')
      let sad=this.countNum(this.emoResult,'sad')
      let angry=this.countNum(this.emoResult,'angry')
      let fear=this.countNum(this.emoResult,'fear')
      let surprise=this.countNum(this.emoResult,'surprise')
      let neu=this.countNum(this.emoResult,'neutral')
      let option = {
        dataset: [
          {
            dimensions: ['name','count'],
            source: [
              ['happy', pos],
              ['sad', sad],
              ['angry', angry],
              ['fear', fear],
              ['surprise', surprise],
              ['neutral', neu],
            ]
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'count', order: 'desc' }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        series: {
          type: 'bar',
          label: {
            show: true,
          },
          encode: { x: 'name', y: 'count' },
          datasetIndex: 1
        }
      };
      return option
    },
    locationchartOption(){
      let locationList = this.emoResult.map(function (item) {
        return item['location'];
      });
      let time=[...new Set(locationList)]
      console.log(time)
      let pos=this.countData(time,'happy','location')
      let sad=this.countData(time,'sad','location')
      let angry=this.countData(time,'angry','location')
      let fear=this.countData(time,'fear','location')
      let surprise=this.countData(time,'surprise','location')
      let neu=this.countData(time,'neutral','location')
      let dataSeries=[
        {
          name:'happy',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:pos,
        },
        {
          name:'neutral',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:neu,
        },{
          name:'sad',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:sad,
        },{
          name:'angry',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:angry,
        },{
          name:'fear',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:fear,
        },
        {
          name:'surprise',
          type:'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data:surprise,
        }
      ]
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['happy','neutral','surprise','fear','angry','sad']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        yAxis: {
          type: 'category',
          // boundaryGap: false,
          data: time,
          // axisLabel: {
          //   interval: 2
          // },
        },
        xAxis: {
          type: 'value'
        },
        series: dataSeries
      };
      return option
    },
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
            rotationRange: [-0, 0],
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
      // this.removeEntity()

      const res = await axios.get(`${ip}/spider/itemList/?id=${this.selectedSpiderJob}&page=1&size=10`)
      this.poiList = res.data.data
      console.log(this.poiList)
      if (command === 'hot') {
        for (let i = 0; i < this.poiList.length; i++) {
          this.drawPoint(this.poiList[i], '/images/tour.png', 10 * this.poiList[i].hot)
        }
      } else if (command === 'score') {
        const comment_res = await axios.get(`${ip}/spider/getAllComment/`)
        this.commentList = comment_res.data.data

        for (let i = 0; i < this.poiList.length; i++) {
          let radius = 1000 * (this.poiList[i].score - 4)
          let name = this.poiList[i].name
          let scoreList = this.commentList.filter(item => name === item['name']).map(item => item['comment_score']);
          let data = this.getData(scoreList).seriesData
          let option = {
            series: [
              {
                name: '评分饼图',
                type: 'pie',
                radius: '50%',
                // center: ['50%', '50%'],
                data: data,
                label: {//饼图文字的显示
                  show: true, //默认  显示文字
                  formatter: function (arg) {
                    return '评分' + arg.name + '的数量:' + arg.value
                  }
                }
              }
            ]
          };
          let tranform = gcj02_to_wgs84(this.poiList[i].longitude, this.poiList[i].latitude)
          this.drawPie(name, option, {radius: radius, lon: tranform[0], lat: tranform[1]})
        }
      }
      this.flyToChina()
    },
    drawPoint(value, img, size) {
      let tranform = gcj02_to_wgs84(value.longitude, value.latitude)
      let text = value.name;
      let entity = this.viewer.entities.add({
        name: `${value.name}`,
        description: this.createDescriptionHtml(value),
        position: Cesium.Cartesian3.fromDegrees(tranform[0], tranform[1], 1),
        billboard: {
          image: this.combineIconAndLabel(img, text, 64),
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: size,
          height: size
        }
      })
    },
    // 模拟infoxbox,构建信息框的html展示数据
    createDescriptionHtml(item) {
      let contentHtml = '<table class="cesium-infoBox-defaultTable"><tbody>';
      for (let pro in item) {
        contentHtml += '<tr><th>' + `${pro}` + '</th>' + '<td>' + `${item[pro]}` + '</td>' + '</tr>'
      }
      contentHtml += '</tbody></table>'
      return contentHtml
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
        ctx.fillStyle = Cesium.Color.BLACK.toCssColorString();
        ctx.font = 'bold 18px Microsoft YaHei';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, canvas.width / 2, canvas.width / 2);

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
      this.viewer.scene.primitives.removeAll()
    },
    reUpload() {

    },
    flyToChina() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114.305396, 30.543181, 60000.0),
      });
    },
    getWordCount() {
      this.showWordCount=!this.showWordCount;
      if(this.handler){
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handler.setInputAction(async (e) => {
        let pick = this.viewer.scene.pick(e.position);
        if (pick && pick.id) {
          const res = await axios.get(`${ip}/spider/getWordCount/?name=${pick.id._name}`)
          this.wordCount = res.data.data
          console.log(this.wordCount)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    showTopicCloud(){
      this.showWordCount=false;
      this.showEmoChart=false;
      if(this.handler){
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handler.setInputAction((e) => {
          let pick = this.viewer.scene.pick(e.position);
          if (pick && pick.id) {
            this.predict('16', pick.id._name)
          }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    senseScenic() {
      this.showWordCount=false;
      this.showWordCloud=false;
      if(this.handler){
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handler.setInputAction((e) => {
          let pick = this.viewer.scene.pick(e.position);
          if (pick && pick.id) {
            this.predict('15', pick.id._name)
          }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    async predict(weight_id, name) {
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
      formData.append("name", name);
      formData.append("user_id", this.user_id);

      let res = await axios.post(postUrl, formData);

      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "预测成功!",
        });
        if (weight_id === '16') {
          this.showEmoChart=false
          this.showWordCloud = !this.showWordCloud
          this.topicResult = res.data.preResult
          console.log(this.topicResult)

          this.$nextTick(() => {
            for (let i = 0; i < 5; i++) {
              this.initCharts('topic',i)
            }
          })
        } else if (weight_id === '15') {
          this.showWordCloud=false

          this.showEmoChart = !this.showEmoChart

          this.emoResult = res.data.preResult
          console.log(this.emoResult)
          this.$nextTick(() => {
            this.initCharts('location',1)
            this.initCharts('category',0)
          })
        }
      }
    },
    initCharts(value,id){
      const myChart = echarts.init(document.getElementById('resultChart_' + id))
      if (value==='category'){
        myChart.setOption(this.allEmoOption);
      }else if (value==='location'){
        myChart.setOption(this.locationchartOption);
      }else if (value==='topic'){
        myChart.setOption(this.topicChartOption(id));
      }
      window.addEventListener('resize',function (){
        myChart.resize()
      })
    },
    drawPie(name, dataOption, {radius = 100000.0, lon, lat} = {}) {
      let canvas = document.createElement('canvas');
      canvas.width = 400
      canvas.height = 400
      let pieChart = echarts.init(canvas)
      pieChart.setOption(dataOption)
      pieChart.on('finished', () => {
        let criclePrimitive = this.getCriclePrimitive(name, pieChart, {radius, lon, lat})
        this.viewer.scene.primitives.add(criclePrimitive)
        pieChart.dispose();
        pieChart = null;
        canvas = null;
      })
    },
    getCriclePrimitive(name, chart, {radius = 100000.0, lon, lat} = {}) {
      let circle = new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(lon, lat, 1),
        radius: radius
      });
      let circleGeometry = Cesium.CircleGeometry.createGeometry(circle);
      let circleGeometryInstance = new Cesium.GeometryInstance({
        geometry: circleGeometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE)
        },
      });
      return new Cesium.Primitive({
        name: name,
        geometryInstances: [
          circleGeometryInstance
        ],
        appearance: new Cesium.MaterialAppearance({
          material:
              new Cesium.Material({
                fabric: {
                  type: 'Image',
                  uniforms: {
                    image: chart.getDataURL()
                  }
                }
              })
        }),
        asynchronous: false
      })
    },
    getData(list) {
      let nameList = [...new Set(list)]

      let objGroup = list.reduce(function (obj, name) {
        obj[name] = obj[name] ? ++obj[name] : 1;
        return obj;
      }, {});
      let seriesData = nameList.map(item => {
        return {
          name: item,
          value: objGroup[item]
        }
      });
      console.log(seriesData)
      return {
        seriesData: seriesData
      };
    },
    countData(list,type,attr){
      const res = new Map();
      let timeIndex={}
      for(let i=0;i<list.length;i++){
        timeIndex[list[i]]=i
      }
      let pos=list.map(function (item) {
        return {count:0};
      });
      this.emoResult.filter((item) => {
        // res收集第一次存在的元素，如果存在，查看存在的位置，对list中的count进行叠加
        if(res.has(item[attr])){
          for(let [key,value] of res){
            if(key===item[attr] && item.result===type){
              pos[timeIndex[key]].count += 1
            }
          }
        }
        return !res.has(item[attr]) &&  res.set(item[attr], 1) && item.result===type
      })
      pos=pos.map(function (item) {
        return item['count'];
      });
      return pos
    },
    countNum(arr,res) {
      let newArrays = arr.filter(function(item){
        return item['result'] === res;
      });
      return newArrays.length;
    }
  }
}
</script>

<style scoped>
.tourismPerception {
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
  width:30%;
}

.rightChart {
  position: absolute;
  right: 1vw;
  top: 10vh;
  height: 68vh;
  width: 30%;
}

.wordCountList {
  position: absolute;
  left: 1vw;
  top: 10vh;
  height: 60vh;
  width: 15vw;
  background-color: #fff;
}

.el-divider--horizontal {
  margin: 10px 0 !important;
}

.chartContainer {
  width: 100%;
  height: 30vh;
  /*margin: 1.5vh;*/
}

.chartCanvas {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
