import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import MapLine from "@/pages/MapLine.vue";
import MapWall from "@/pages/MapWall.vue";


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
      path: "map-line",
      name: "地图",
      component: MapLine
    },
	{
	  path: "map-wall",
	  name: "地图",
	  component: MapWall
	}
  ]

}];

export default routes;
