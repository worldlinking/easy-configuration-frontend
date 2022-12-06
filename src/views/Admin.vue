<template>
  <div class="admin">
    <Header></Header>
    <div class="adminMenuCon">
        <AdminMenu></AdminMenu>
    </div>
    <div class="adminContentContainer">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AdminMenu from "../components/admin/AdminMenu.vue";
import Header from "../components/admin/Header.vue";
export default {
  name: "Admin",
  components: {
    Header: Header,
    AdminMenu: AdminMenu,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.admin {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.adminMenuCon {
  width: 15vw;
  height: 92vh;
  background-color: rgb(245, 245, 245);
  box-shadow: 0 0 2px gray;
  float: left;
}
.adminContentContainer{
  width: 85vw;
  height: 92vh;
  position: relative;
  float: left;
}
</style>
