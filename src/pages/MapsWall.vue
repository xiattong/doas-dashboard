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
		<div id="colorScalar">
			<div id="color1">{{this.$rtl.mapParams.red * (1/4)}}</div>
			<div id="color2">{{this.$rtl.mapParams.red * (2/4)}}</div>
			<div id="color3">{{this.$rtl.mapParams.red * (3/4)}}</div>
			<div id="color4">{{this.$rtl.mapParams.red}}</div>
		</div>
	</div>
  </div>
</template>

<style>
	#amapContainer{width: 100%; height: calc(100vh - 110px);}
	.btn-info{font-size: 0.75rem;}
	.amap-ctrl-list-layer p {color: #212529;}
	#amapBar{
		width: 80%;min-height: 30px;position: fixed;top:95px; right: 120px;align-items: right;
	}
	#colorScalar{
		width: 21%;height:21px;position: fixed;top:145px; right: 120px;align-items: right; 
	}
	#colorScalar div{width: 25%;height:21px;float: left;}
	#color1{background-image: linear-gradient(to right, #0000ff, #00ffff); text-align: right; padding-right: 5px;}
	#color2{background-image: linear-gradient(to right, #00ffff, #00ff00); text-align: right; padding-right: 5px;}
	#color3{background-image: linear-gradient(to right, #00ff00, #ffff00); text-align: right; padding-right: 5px;}
	#color4{background-image: linear-gradient(to right, #ffff00, #ff0000); text-align: right; padding-right: 5px;}
</style>
<script src="https://webapi.amap.com/maps?v=1.4.15&key=24eab6be67592f28a28b0df41307192f&plugin=Map3D"></script>
<script>
import {
  Card
} from "@/components/index";
import {lazyAMapApiLoaderInstance} from 'vue-amap';
let map,object3Dlayer,wall;
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
					//center: [116.472804, 39.995725]
				});
				// 比例尺
				map.addControl(new AMap.Scale());
				// 默认图层/卫星图/交通图层之间切换
				map.addControl(new AMap.MapType({
					defaultType: 0,
					showTraffic: false,
					showRoad : false,
					position: {
						left: '10px'
					},
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
				setTimeout(this.initObject3DLayer,  3 * 1000);
			});
		},
		initObject3DLayer(){
			object3Dlayer = new AMap.Object3DLayer();
			map.add(object3Dlayer);
		},
		refreshMapData() {
			// 注意：因为 axios 是加到 Vue 的原型中了，所以使用 axios 方法时，前面需要加 this
			this.axios.post('http://'+this.$rtl.hostIp+':8090/doas/initData',{
				dataType : 'map-wall',
				extractNum : this.$rtl.mapParams.extractNum,
				red : this.$rtl.mapParams.red
			}).then(resp => {
				if (resp.data.code == 0) {
					this.$rtl.sysState = resp.data.result.systemState[0] == '1'? 'success' : 'danger';
					this.$rtl.gpsState = resp.data.result.systemState[1] == '1'? 'success' : 'danger';
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
			// 连线对象
			object3Dlayer.clear();
			for (let i = 0; i < this.mapData.coordinates.length - 1 ; i++ ) {
				// 坐标
				let coordinate_1 = this.mapData.coordinates[i];
				let coordinate_2 = this.mapData.coordinates[i+1];
				// 高度
				let height = this.mapData.data[index][i+1] * this.$rtl.mapParams.hiehtFactor;
				// 颜色
				let color = this.mapData.colors[index][i];
				let wall = new AMap.Object3D.Wall({
					path:  [
						new AMap.LngLat(coordinate_2[0],coordinate_2[1]),
						new AMap.LngLat(coordinate_1[0],coordinate_1[1])
					],
					height: height,
					color: color
				});
				wall.backOrFront = 'both';
				wall.transparent = true;
				object3Dlayer.add(wall);
				if(this.toCoordinate == null 
					&& i == this.mapData.coordinates.length - 2){
					// 切换要素时，将最新的坐标设置地图坐标中心位置
					this.toCoordinate = coordinate_2;
					map.panTo(this.toCoordinate);
				}
			}
			this.mapData.activeIndex = index;
		},
		chooseFactors(index){
			this.toCoordinate = null;
			this.initMapData(index);
		}
	}
}
</script>
