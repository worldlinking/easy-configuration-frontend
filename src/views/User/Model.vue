<template>
    <div class="model">
        <div class="modelMenuContainer">
            <div class="modelNameContainer">
                {{modelName[modelIndex]}}模型
            </div>
            <ModelMenu></ModelMenu>
        </div>
    </div>
</template>

<script>
import ModelMenu from '../../components/User/ModelMenu.vue'
export default {
    name: 'EasyConfigurationModel',
    components:{
        ModelMenu:ModelMenu
    },
    data() {
        return {
            modelName:["目标检测","语义分割","实例分割"],
        };
    },
    created(){
        this.paramsAnalysis();
    },
    mounted() {
        
    },

    methods: {
        /* 对路由切换参数进行解析，判断要创建的模型类型 */
        paramsAnalysis(){
            // this.modelIndex = this.$route.params.modelIndex;
            // this.type = this.$route.params.modelIndex;//0：物联感知，1：社会感知
            this.modelIndex = 1;
            this.type = 0;
        }
    },
};
</script>

<style scoped>
.model{
    width: 100vw;
    height: 92vh;
}
.modelMenuContainer{
    width: 15vw;
    height: 92vh;
    background-color: rgb(245,245,245);
    box-shadow: 0 0 2px gray;
}
.modelNameContainer{
    height: 5vh;
    font-size: 1vw;
    font-weight: bolder;
    display: flex;
    align-items: center;
    padding-left: 1vw;
}
</style>