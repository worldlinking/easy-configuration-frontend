<template>
  <div class="SpiderItemList">
    <el-row class="itemTab">
      <el-col :span="6">
        <span >爬取条目：{{pagedData.totalNum}}条</span>
      </el-col>
      <el-col :span="6" :offset="12">
        <el-button style="float: right;" type="primary" icon="el-icon-upload"  @click="exportEvent">导出文本内容</el-button>
        <el-button v-if="taskName==='weather'" style="float: right;margin-right: 1rem" type="primary" icon="el-icon-upload"  @click="showCharts">图表显示</el-button>
      </el-col>
    </el-row>
    <el-table
        v-loading="loadingShow"
        class="dataTable"
        element-loading-text="数据正在加载中..."
        :data="itemList"
        height='720'
        border
        style="width: 100%"
        fit="false">
      <el-table-column
          v-for="(item,index) in header"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="columnWidth(item.prop)">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :page-sizes="[5,10,20]"
        :current-page="pagedData.nowPage"
        :page-size="pagedData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagedData.totalNum"
        style="margin: 1rem 18rem"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    <el-dialog
        title="气象展示"
        :visible.sync="chartsVisible">
        <span slot="title" class="dialog-footer">
          <strong style="margin-right : auto;font-size: 22px">24h气象展示</strong>
        </span>
      <div class="chartContainer" ref="chartContainer">
        <div id="weatherChart"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import * as echarts from "echarts";

let { ip } = config;
export default {
  name: "SpiderItemList",
  data() {
    return {
      itemList: [],
      header:[],
      loadingShow:true,
      chartsVisible:false,
      taskName:'',
      pagedData: {
        totalNum: 0,
        nowPage: 1,
        pageSize: 10
      },
    }
  },
  mounted() {
    this.checkDatas();
  },
  computed:{
    option(){
      let data={}
      if (this.taskName==='weather'){
        data = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['Humidity', 'WindSpeed', 'Temperature']
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Humidity',
              min: 0,
              max: 50,
              interval: 5,
              axisLabel: {
                formatter: '{value} '
              }
            },
            {
              type: 'value',
              name: 'Temperature',
              min: -20,
              max: 30,
              interval: 5,
              axisLabel: {
                formatter: '{value} °C'
              }
            }
          ],
          series: [
            {
              name: 'WindSpeed',
              type: 'bar',
              tooltip: {
                valueFormatter: function (value) {
                  return value ;
                }
              },
              data: [
              ]
            },
            {
              name: 'Humidity',
              type: 'bar',
              tooltip: {
                valueFormatter: function (value) {
                  return value ;
                }
              },
              data: [
              ]
            },
            {
              name: 'Temperature',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' °C';
                }
              },
              data: [
              ]
            }
          ]
        }
      }
      for(let i =0;i<this.itemList.length;i++){
        console.log(this.itemList[i].time)
        data.xAxis[0].data.push(this.itemList[i].time)
        data.series[0].data.push(this.itemList[i].windSpeed)
        data.series[1].data.push(this.itemList[i].humidity)
        data.series[2].data.push(this.itemList[i].temperature)
      }
      return data
    }
  },
  methods: {
    async checkDatas() {
      const page = this.pagedData.nowPage
      const size = this.pagedData.pageSize
      const res = await axios.get(`${ip}/spider/itemList/?id=${this.$route.params.id}&page=${page}&size=${size}`)
      this.itemList = res.data.data
      this.taskName = this.itemList[0].task
      this.header = res.data.header
      this.pagedData.totalNum = res.data.total
      this.loadingShow = false
    },
    handleSizeChange(nowSize) {
      this.pagedData.pageSize = nowSize
      this.checkDatas()
    },
    handleCurrentChange(nowPage) {
      this.pagedData.nowPage = nowPage
      this.checkDatas()
    },
    initCharts(){
      const myChart = echarts.init(document.getElementById('weatherChart'))
      myChart.setOption(this.option);
      window.addEventListener('resize',function (){
        myChart.resize()
      })
    },
    showCharts(){
      this.chartsVisible=true
      this.$nextTick( ()=> {
        this.initCharts()
      })
    },
    handleClick(row) {
      let id=row.id
      let siteName=row.siteName
      console.log(id,siteName);
      this.$router.push({name: "SpiderItemList",params:{id:id}})
    },
    columnWidth(item){
      let widthStr=''
      if(item==='text'){
        widthStr='400'
      }else {
        widthStr='100'
      }
      return widthStr
    },
    exportEvent(){
      let str=''
      this.itemList.forEach(item=>{
        str+=item.text+'\r\n'
      })
      let export_blob = new Blob([str]);
      let event = new MouseEvent("click");
      let save_link = document.createElement("a");
      save_link.href = window.URL.createObjectURL(export_blob);
      save_link.download = '导出'+'.txt';
      save_link.dispatchEvent(event);
    }
  },


}
</script>

<style scoped>
.SpiderItemList{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1.5vw;
}
.itemTab{
  margin-bottom: 1vh;
}

#weatherChart{
  width: 100%;
  height: 25rem;
}

.dataTable .cell {
  padding: 0 !important;
  height: 10px;
  line-height: 10px !important;
  text-align: center;
}
</style>
