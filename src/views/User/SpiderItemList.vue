<template>
  <div class="SpiderItemList">
    <el-table
        v-loading="loadingShow"
        element-loading-text="数据正在加载中..."
        :data="itemList"
        height='800'
        border
        style="width: 100%">
      <el-table-column
          v-for="(item,index) in header"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          min-width='100'>
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
  padding-right: 1vw;
}
</style>
