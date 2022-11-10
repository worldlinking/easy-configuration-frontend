<template>
  <div>
    <!-- 模型种类 -->
    <div class="modelsCon">
      <div class="model" v-for="model in models" @click="modelShow(model.index)">
        <div
          class="back"
          :style="{ backgroundImage: `url(${model.backPath})` }"
        ></div>
        <div class="modelBelow">
          <div class="modelTitle">{{ model.title }}</div>
          <div class="modelDesc">{{ model.smallTile }}</div>
          <div class="modelUse">在线使用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationSocialPerceptionBelow",

  data() {
    return {
      models: [
        {
          backPath: "/images/test.png",
          title: "文本分类-单分类",
          smallTile:
            "定制分类标签实现文本内容的自动分类，每个文本属于一种标签类型",
          index: 0,
        },
        {
          backPath: "/images//test.png",
          title: "文本分类-多分类",
          smallTile:
            "定制分类标签实现文本内容的自动分类，每个文本可以属于多个标签类型",
          index: 1,
        },
        {
          backPath: "/images//test.png",
          title: "情感分析",
          smallTile:
            "又称倾向性分析或观点挖掘，可自动挖掘文本中的立场、观点、看法、情绪和喜恶等。",
          index: 2,
        },
      ],
    };
  },

  mounted() {},

  methods: {
    modelShow(index) {
      this.$router.push({
        name: "Model",
        params: {
          modelIndex: index,
          type: 0,
        },
      });
    },
  },
};
</script>

<style scoped>
.modelsCon {
  width: 60vw;
  height: 42vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.model {
  width: 15vw;
  height: 32vh;
  /* background: #bfa; */
  box-shadow: 0 0 5px gray;
}
.model:hover {
  cursor: pointer;
}
.model:hover .modelUse {
  text-decoration: underline;
}
.back {
  height: 15vh;
  background-size: 15vw 15vh;
}
.modelBelow {
  height: 15vh;
  width: 15vw;
  position: absolute;
}
.modelTitle {
  height: 5vh;
  padding-left: 1.5vw;
  font-weight: bolder;
  line-height: 5vh;
}
.modelDesc {
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  font-size: 0.5vw;
  color: #949494;
  height: 7vh;
}
.modelUse {
  height: 5vh;
  padding-left: 1.5vw;
  font-size: 0.5vw;
  line-height: 5vh;
  color: #549bef;
}
</style>
