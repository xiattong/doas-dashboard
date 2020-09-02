<template>
  <div class="content">
	<div style="display: flex;justify-content: center;">
		<div id="amapContainer" style="width: 100%;height: calc(100vh - 110px);"></div>
	</div>
  </div>
</template>

<style>
	.amap-ctrl-list-layer p {color: #212529;}
</style>
<script src="https://webapi.amap.com/maps?v=1.4.15&key=24eab6be67592f28a28b0df41307192f&plugin=Map3D"></script>
<script>
import {lazyAMapApiLoaderInstance} from 'vue-amap';
let map,object3Dlayer;
export default{
	data() {
		return {
			
		}
	},
	created() {
		lazyAMapApiLoaderInstance.load().then(() => {
			map = new AMap.Map('amapContainer', {
				rotateEnable:true,
				pitchEnable:true,
				expandZoomRange: true,
				zoom: 15,
				pitch: 50,
				rotation: 0,
				viewMode:'3D',
				zooms:[2,20],
				center:[117.135199,31.839104]
			});
			this.initMapTools();
			this.initPrisms();
			
			
			
			
		});
	},
	methods: {
		initPrisms(){
			// 以不规则棱柱体 Prism 为例，添加至 3DObjectLayer 图层中
			var paths = [
				[117.135080,31.838900],
				[117.135080,31.838880]
			];
			
			var bounds = paths.map(function(path) {
				return new AMap.LngLat(path[0], path[1]);
			});
			
			// 创建 Object3D 对象
			var prism = new AMap.Object3D.Prism({
				path: bounds,
				height: 500,
				color: 'rgba(249, 150, 230, 0.7)' // 支持 #RRGGBB、rgb()、rgba() 格式数据
			});
					
			// 开启透明度支持
			prism.transparent = true;
					
			// 添加至 3D 图层
			object3Dlayer.add(prism);
		},
		initMapTools(){
			// 比例尺
			map.addControl(new AMap.Scale());
			
			// 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
			map.addControl(new AMap.MapType({
				defaultType: 0,
				showTraffic: false,
				showRoad : false
			}));
			
			 // 添加 3D 罗盘控制
			map.addControl(new AMap.ControlBar({
				position: {
					right: '10px',
					bottom: '0px'
				},
				showControlButton: true,
				showZoomBar: false
			}));
			
			// 添加 Object3DLayer 图层，用于添加 3DObject 对象
			object3Dlayer = new AMap.Object3DLayer();
			map.add(object3Dlayer);
		},
		initDataCurve(){
			

			console.log("地图图块加载完毕！当前地图中心点为：" + map.getCenter());
		}
	}
}
</script>
