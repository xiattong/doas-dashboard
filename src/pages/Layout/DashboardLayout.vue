<template>
  <div class="wrapper" >
    <side-bar :background-color="backgroundColor">
      <sidebar-link to="/dashboard">
        <i class="tim-icons icon-chart-pie-36"></i>
        <template v-if="!isRTL">
          <p>浓度曲线</p>
        </template>
      </sidebar-link>
      <sidebar-link to="/maps">
        <i class="tim-icons icon-pin"></i>
        <template v-if="!isRTL">
          <p>地图</p>
        </template>
      </sidebar-link>
    </side-bar>
    <!--<sidebar-share :background-color.sync="backgroundColor"></sidebar-share>-->
    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <!--<content-footer></content-footer>-->
    </div>
  </div>
</template>
<style lang="scss">
	.nav-item p {font-size: 14px;}
</style>
<script>

import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./DashboardContent.vue";
import SideBar from "@/components/SidebarPlugin/SideBar.vue";
import SidebarLink from "@/components/SidebarPlugin/SidebarLink.vue";



export default{
  components: {
    TopNavbar,
    DashboardContent,
    SideBar,
    SidebarLink
  },
  data() {
    return {
      backgroundColor: "green"
    };
  },
  computed: {
    isRTL() {
      return this.$rtl.isRTL;
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
