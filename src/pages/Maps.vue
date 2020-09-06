<template>
  <div class="content">
	<div style="display: flex;justify-content: center;">
		<div id="amapContainer"></div>
		<div id="amapBar">
			<div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
			    <template>
			        <label v-for="(option, index) in mapData.factors" :key="option" :id="index"
						class="btn btn-info btn-sm btn-simple" :class="{active:mapData.activeIndex === index}">
			            <input type="radio" @click="chooseFactors(index)" name="options" autocomplete="off">
						{{option}}
			        </label>
			    </template>
			</div>
		</div>
	</div>
  </div>
</template>

<style>
	#amapContainer{width: 100%; height: calc(100vh - 110px);}
	.btn-info{font-size: 0.75rem;}
	.amap-ctrl-list-layer p {color: #212529;}
	#amapBar{
		width: 80%;min-height: 30px;
		position: fixed;top:90px; padding: 5px 8px; display:flex;align-items: center;
	}
</style>
<script src="https://webapi.amap.com/maps?v=1.4.15&key=24eab6be67592f28a28b0df41307192f&plugin=Map3D"></script>
<script>
import {
  Card
} from "@/components/index";
import {lazyAMapApiLoaderInstance} from 'vue-amap';
let map,object3Dlayer,lines,lineGeo;
export default{
	data() {
		return {
			timer: null,
			toCoordinate: null,
			mapData:{
				activeIndex: 0,
				// 因子
				factors:[],
				// 数值/高度 二维数组
				data: [],
				// 颜色 二维数组
				colors: [],
				// 坐标
				coordinates: []
			}
		}
	},
	mounted() {
		this.initMap();
		this.timer = setInterval(this.refreshMapData,  this.$rtl.mapParams.refreshSecond * 1000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods: {
		initMap(){
			lazyAMapApiLoaderInstance.load().then(() => {
				map = new AMap.Map('amapContainer', {
					rotateEnable:true,
					pitchEnable:true,
					expandZoomRange: true,
					zoom: 13,
					pitch: 65,
					rotation: 0,
					viewMode:'3D',
					zooms:[2,20],
					center: [117.284387,31.863847]
				});
				this.initMapTools();
			});
		},
		refreshMapData() {
			// 注意：因为 axios 是加到 Vue 的原型中了，所以使用 axios 方法时，前面需要加 this
			this.axios.post('http://localhost:8090/doas/initData',{
				dataType : 'map',
				extractNum : this.$rtl.mapParams.extractNum,
				red:  this.$rtl.mapParams.red
			}).then(resp => {
				if (resp.data.code == 0) {
					this.mapData.factors = resp.data.result.factors;
					this.mapData.data = resp.data.result.data;
					this.mapData.colors = resp.data.result.colors;
					this.mapData.coordinates = resp.data.result.coordinates;
					this.initMapData(this.mapData.activeIndex);
				}
			}).catch(err => {
				console.log(err);
			})
			// 刷新定时器
			if(this.$rtl.mapParams.refreshTimer){
				this.$rtl.mapParams.refreshTimer = false;
				clearInterval(this.timer);
				this.timer = setInterval(this.refreshMapData,  this.$rtl.mapParams.refreshSecond * 1000);
			}
		},
		initMapData(index){
			//连线对象
			object3Dlayer.clear();
			lines = new AMap.Object3D.Line();
			lineGeo = lines.geometry;
			for (let i = 0; i < this.mapData.coordinates.length ; i++ ) {
				// 坐标
				let coordinate = this.mapData.coordinates[i];
				let lnglat = map.lngLatToGeodeticCoord(coordinate);
				lnglat.x = AMap.Util.format(lnglat.x, 3);
				lnglat.y = AMap.Util.format(lnglat.y, 3);
				let center  = lnglat;
				// 高度
				let height = -1 * this.mapData.data[index][i] * this.$rtl.mapParams.hiehtFactor;
				// 连线
				lineGeo.vertices.push(center.x, center.y, 0);
				let color = this.mapData.colors[index][i];
				lineGeo.vertexColors.push(color[0], color[1], color[2], 1);
				lineGeo.vertices.push(center.x, center.y, height);
				lineGeo.vertexColors.push(color[0], color[1], color[2], 1);
				if(this.toCoordinate == null 
					&& i == this.mapData.coordinates.length - 1){
					// 设置地图坐标中心位置
					this.toCoordinate = coordinate;
					map.panTo(this.toCoordinate);
				}
			}
			object3Dlayer.add(lines);
			this.mapData.activeIndex = index;
		},
		initMapTools(){
			// 比例尺
			map.addControl(new AMap.Scale());
			// 默认图层/卫星图/交通图层之间切换
			map.addControl(new AMap.MapType({
				defaultType: 0,
				showTraffic: false,
				showRoad : false
			}));
			 // 添加 3D 罗盘控制
			map.addControl(new AMap.ControlBar({
				position: {
					right: '10px',
					bottom: '-80px'
				},
				showControlButton: true,
				showZoomBar: false
			}));
			// 添加 Object3DLayer 图层，用于添加 3DObject 对象
			object3Dlayer = new AMap.Object3DLayer();
			map.add(object3Dlayer);
		},
		chooseFactors(index){
			this.toCoordinate = null;
			this.initMapData(index);
		}
	}
}
</script>
