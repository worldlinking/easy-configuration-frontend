<template>
    <div class="NavigationAbove">
        <div class="navAboveHead">
            <div class="nahTitle">
                物联互联智能感知引擎
            </div>
            <div class="nahBtnC">

            </div>
        </div>
        <div class="navAboveBelow">

        </div>
    </div>
</template>

<script>
export default {
    name: 'EasyConfigurationNavigationAbove',

    data() {
        return {
            
        };
    },
    mounted() {
        
    },
    methods: {
        
    },
};
</script>

<style scoped>
.NavigationAbove{
    width: 50vw;
    background-color: #bfa;
    height: 40vh;
}
.navAboveHead{
    position: relative;
    height: 12vh;
}
.navAboveBelow{
    height: 28vh;
    position: relative;
}
.nahTitle{
    display: flex;
    position: absolute;
    height: 12vh;
    font-size: 1.5vw;
    justify-content: center;
    align-items: center;
    left:1vw;
    font-weight: bolder;
    letter-spacing: 0.2vw;
}
.nahBtnC{
    position: relative;
    right: 0;
    width: 15vw;
}
</style>