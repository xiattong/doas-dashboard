<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{toggled: $sidebar.showSidebar}">
          <button type="button"
                  class="navbar-toggler"
                  @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" href="javascript:void(0)"> {{ $route.name }}</a>
      </div>
      <div class="collapse navbar-collapse show text-left" v-show="showMenu">
        <ul class="navbar-nav m-auto">
          <li class="search-bar input-group">
            
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>

import DropDown from "@/components/Dropdown.vue";
import Modal from "@/components/Modal.vue";
import {
  SidebarPlugin
} from "@/components/index";

  export default{
    components:{
      DropDown,
      Modal,
      SidebarPlugin
    },
    data() {
      return {
        searchModalVisible: false,
        searchQuery: '',
        showMenu: false,
		backgroundColor: "green"
      };
    },
    methods:{
      toggleSidebar(){
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      toggleMenu(){
        this.showMenu  = !this.showMenu;
      }
    },
    computed:{
      isRTL() {
        return this.$rtl.isRTL;
      }
    }
  }
</script>
<style>
</style>
