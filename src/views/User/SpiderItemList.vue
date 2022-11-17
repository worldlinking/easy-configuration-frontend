<template>
  <div class="SpiderItemList">
    <el-row class="itemTab">
      <el-col :span="6">
        <span >爬取条目：{{this.itemList.length}}条</span>
      </el-col>
      <el-col :span="6" :offset="12">
        <el-button style="float: right;" type="primary" icon="el-icon-upload"  @click="exportEvent">导出文本内容</el-button>
      </el-col>
    </el-row>
    <el-table
        v-loading="loadingShow"
        element-loading-text="数据正在加载中..."
        :data="itemList"
        height='720'
        border
        style="width: 100%">
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
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";

let { ip } = config;
export default {
  name: "SpiderItemList",
  async mounted() {
    let res = await axios.get(`${ip}/spider/itemList/?id=${this.$route.params.id}`);
    this.itemList=res.data.data
    this.header=res.data.header
    this.loadingShow=false
  },
  methods: {
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

  data() {
    return {
      itemList: [],
      header:[],
      loadingShow:true,
    }
  }
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
</style>
