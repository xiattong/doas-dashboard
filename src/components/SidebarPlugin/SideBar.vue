<template>
  <div class="sidebar" :data="backgroundColor">
      <div class="sidebar-wrapper text-left">
        <div class="logo">
          <a href="javascript:void(0)" class="simple-text logo-normal">
            {{ title }}
          </a>
        </div>
        <ul class="nav">
			<slot>
				<sidebar-link>
				</sidebar-link>
			</slot>
        </ul>
		<div class="copyright">
			<a href="#" class="nav-link">
				<p>&copy; {{$rtl.companyName}}</p>
			</a>
		</div>
      </div>
  </div>
</template>
<style>
	.copyright{position:fixed;bottom:10px;font-size: 0.625rem;}
</style>
<script>
import SidebarLink from "./SidebarLink.vue";

export default{
  name: "side-bar",
  components: {
    SidebarLink
  },
  props: {
    title: {
      type: String,
      default: "多组分气体走航分析显示系统"
    },
    backgroundColor: {
      type: String,
      default: "green"
    },
    sidebarLinks:{
      type: Array,
      default: () => []
    }
  },
  data(){
    return{
      activeLinkIndex: 0
    }
  },
  computed:{
    isRTL() {
      return this.$rtl.isRTL;
    }
  },
  methods:{
    findActiveLink(){
      this.links.forEach((link, index) => {
        if(link.isActive()){
          this.activeLinkIndex = index;
        }
      });
    }
  }
}
</script>
<style>
</style>
