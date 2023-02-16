<template>
  <div>
    <div class="aboveArea">
      <NavigationAbove :makeDialogShow='makeDialogShow'></NavigationAbove>
    </div>
    <div class="belowArea">
      <NavigationBelow></NavigationBelow>
    </div>

    <el-dialog :visible.sync="dialogTableVisible" title='选择模型' v-if="dialogTableVisible">
      <div slot='title' class="dialogTitle">
        <div class="titleCon">
          选择模型
        </div>
        <div class="titleLine">

        </div>
      </div>
      <ModelsInDialog :currentMode='currentMode'></ModelsInDialog>
    </el-dialog>
  </div>
</template>

<script>
import NavigationAbove from "../../components/User/NavigationAbove.vue";
import NavigationBelow from "../../components/User/NavigationBelow.vue";
import ModelsInDialog from "../User/ModelsInDialog.vue";
export default {
  name: "EasyConfigurationNavigation",
  components: {
    NavigationAbove,
    NavigationBelow,
    ModelsInDialog
  },
  data() {
    return {
      dialogTableVisible:false,
      currentMode:"intro"
    };
  },

  mounted() {
      this.$bus.$on('dialogShow',(mode)=>{
        this.currentMode = mode;
        this.makeDialogShow();
      });

  },

  methods: {
    makeDialogShow(...modes){
      if(modes.length > 0){
        this.currentMode = modes[0];
      }
      this.dialogTableVisible = true;
    }
  },
};
</script>

<style scoped>
.aboveArea {
  height: 46vh;
  /* background: rgb(233,241,255); */
  background: linear-gradient(to top, white, rgb(233, 241, 255));
  position: relative;
  display: flex;
  justify-content: center;
}
.belowArea {
  height: 46vh;
  position: relative;
  display: flex;
  justify-content: center;
}
.titleCon{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.dialogTitle{
  font-size: 1vw;
  /* font-weight: bolder; */
}
.titleLine{
  margin-top: 5px;
  width: 100%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
}
</style>
