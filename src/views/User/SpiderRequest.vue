<template>
  <div class="SpiderRequest">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="form.taskName"></el-input>
      </el-form-item>
      <el-form-item label="目标网站"  prop="siteName">
        <el-select v-model="form.siteName" placeholder="请选择爬取目标网站">
          <el-option label="微博" value="微博"></el-option>
          <el-option label="推特" value="twitter"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检索关键词"  prop="keyword">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="搜索时间"  prop="searchTime">
        <el-date-picker
            v-model="form.Date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSpiderJob">立即创建</el-button>
        <el-button @click="$router.push('/user/Model/SpiderJobList')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";

let { ip } = config;
import { mapState } from "vuex";

export default {
  name: "SpiderRequest",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入爬虫任务名称"));
      }
      for (let i = 0; i < this.spiderJobs.length; i++) {
        if (value == this.spiderJobs[i].taskName) {
          callback(new Error("爬虫任务名称重复！"));
          break;
        }
      }
      callback();
    };
    return {
      form: {
        taskName: '',
        keyword:'',
        siteName: '',
        Date:'',
      },
      rules:{
        taskName: [{ validator: validatePass, trigger: "change" }],
        siteName: [
          { required: true, message: '请选择爬取目标网站', trigger: 'change' }
        ],
        keyword: [
          { required: true, message: '请输入爬取关键词', trigger: 'blur' },
        ],
      },
    }
  },
  computed:{
    ...mapState(["user_id","spiderJobs"])
  },
  methods: {
    async submitSpiderJob() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //表单合法则提交
          this.createSpider();
        } else {
          return false;
        }
      });
    },
    async createSpider() {
      let postUrl = `${ip}/spider/spiderRequest/`;
      const formData = new FormData();
      formData.append("taskName", this.form.taskName);
      formData.append("siteName", this.form.siteName);
      formData.append("keyword", this.form.keyword);
      formData.append("startdate", this.form.Date[0]);
      formData.append("enddate", this.form.Date[1]);
      formData.append("user_id", this.user_id);
      let res = await axios.post(postUrl, formData);

      if (res.data.code === 200) {
        this.$message({
          type: "success",
          message: "爬虫任务创建成功!",
        });
      }
    }
  }
}
</script>

<style scoped>
.SpiderRequest{
  padding-top: 3vh;
  padding-left: 1vw;
  width: 60%;
}
</style>
