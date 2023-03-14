<template>
  <div>功能开发中.....3s后返回</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "EasyConfigurationOnlineDev",

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
