import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import MapsLine from "@/pages/MapsLine.vue";
import MapsWall from "@/pages/MapsWall.vue";


const routes = [{
  path: "/",
  component: DashboardLayout,
  redirect: "dashboard",
  children:[
    {
      path: "dashboard",
      name: "浓度曲线",
      component: Dashboard
    },
    {
      path: "maps-line",
      name: "地图",
      component: MapsLine
    },
	{
	  path: "maps-wall",
	  name: "地图",
	  component: MapsWall
	}
  ]

}];

export default routes;
