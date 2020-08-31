<template>
  <div class="content">
	<div style="display: flex;justify-content: center;">
		<div id="amapContainer" style="width: 100%;height: calc(100vh - 60px);"></div>
		<div style="background-color: #409EFF;color: #FFFFFF; border-radius: 3px; box-shadow: 0 0 4px 1px rgba(0,0,0,.2);
					width: 80px;height: 30px; position: fixed;top: 65px; right:20px; padding: 5px 8px;
					display: flex;align-items: center;">
			<div v-if="!status" @click="handleRemoveLayer()" style="font-size: 16px;display: flex;align-items: center;margin: 0 5px;cursor: pointer;color: #ffd04b;">
				<i class="fad fa-globe"></i><span style="font-size: 13px;margin-left: 3px;">标准图</span>
			</div>
			<div v-if="status" @click="handleAddLayer()" style="font-size: 16px;display: flex;align-items: center;margin: 0 5px;cursor: pointer;color: #ffd04b;">
				<i class="fad fa-globe-asia"></i><span style="font-size: 13px;margin-left: 3px;">卫星图</span>
			</div>
		</div>
	</div>
  </div>
</template>
<script>

import {lazyAMapApiLoaderInstance} from 'vue-amap';
let map, satellite, roadNet,infoWindow;
export default{
	data() {
		return {
			status: true
		}
	},
	created() {
		lazyAMapApiLoaderInstance.load().then(() => {
			satellite = new AMap.TileLayer.Satellite();
			roadNet = new AMap.TileLayer.RoadNet();
			map = new AMap.Map('amapContainer', {
				zoom: 14,
				center: new AMap.LngLat(117.205234, 32.970031),
				doubleClickZoom :  false,
				layers: [
					new AMap.createDefaultLayer(),
					satellite,
					roadNet
				]
			});
			roadNet.hide();
			satellite.hide();
			map.plugin(['AMap.ToolBar'], () => {
				map.addControl(new AMap.ToolBar());
			});
		});
	},
	methods:{
		handleAddLayer() {
			satellite.show();
			roadNet.show();
			this.status=false;
		},
		handleRemoveLayer() {
			roadNet.hide();
			satellite.hide();
			this.status=true;
		},
	}
}
</script>
