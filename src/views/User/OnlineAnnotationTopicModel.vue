<template>
  <div>主题模型采用非监督学习的聚类算法，无需标注数据.....3s后返回</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "EasyConfigurationOnlineAnnotationTopicModel",

  data() {
    return {};
  },

  mounted() {
    setTimeout(() => {
      this.$router.push({
        name: "ModelIntro",
        params: {
          modelIndex: this.modelIndex,
          type: this.type,
        },
      });
    }, 3000);
  },

  methods: {},
  computed: {
    ...mapState(["modelIndex", "type", "modelName"]),
  },
};
</script>

<style scoped></style>
