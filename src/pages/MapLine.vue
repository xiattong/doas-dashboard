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
			<div id="color1">{{this.mapData.red * (1/4)}}</div>
			<div id="color2">{{this.mapData.red * (2/4)}}</div>
			<div id="color3">{{this.mapData.red * (3/4)}}</div>
			<div id="color4">{{this.mapData.red}}</div>
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
<script src="https://webapi.amap.com/maps?v=2.0&key=24eab6be67592f28a28b0df41307192f&plugin=Map3D"></script>
<script>
import {
  Card
} from "@/components/index";
import {lazyAMapApiLoaderInstance} from 'vue-amap';
let map,object3Dlayer,lines,lineGeo,startMarker,endMarker,polyline;

export default{
	data() {
		return {
			timer: null,
			toCoordinate: null,
			mapData:{
				activeIndex: 0,
				// 因子
				factors:[],
				// 数值 二维数组
				data: [],
				// 高度 二维数组
				dataHigh: [],
				// 颜色 二维数组
				colors: [],
				// 坐标
				coordinates: [],
				// red值
				red: 0
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
					viewMode: this.$rtl.mapViewModel,
					zooms:[2,20],
					center: [117.284387,31.863847]
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
				
				// 绘制轨迹
				polyline = new AMap.Polyline({
					map: map,
					showDir:true,
					strokeColor: "#28F",  //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6,      //线宽
					strokeStyle: "solid"  //线样式
				});
				
				// 起点标记
				let startIcon = new AMap.Icon({
					// 图标尺寸
					size: new AMap.Size(25, 34),
					// 图标的取图地址
					image: 'http://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
					// 图标所用图片大小
					imageSize: new AMap.Size(135, 40),
					// 图标取图偏移量
					imageOffset: new AMap.Pixel(-9, -3)
				});
				
				// 终点标记
				let endIcon = new AMap.Icon({
					size: new AMap.Size(25, 34),
					image: 'http://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
					imageSize: new AMap.Size(135, 40),
					imageOffset: new AMap.Pixel(-95, -3)
				});
				
				// 将 icon 传入 marker
				startMarker = new AMap.Marker({
					icon: startIcon,
					offset: new AMap.Pixel(-13, -30)
				});
				
				// 将 icon 传入 marker
				endMarker = new AMap.Marker({
					icon: endIcon,
					offset: new AMap.Pixel(-13, -30)
				});
				
				map.add([startMarker, endMarker]);
				
				// 添加 Object3DLayer 图层，用于添加 3DObject 对象
				setTimeout(this.initObject3DLayer,  3 * 1000);
			});
		},
		initObject3DLayer(){
			object3Dlayer = new AMap.Object3DLayer();
			map.add(object3Dlayer);
		},
		refreshMapData() {
			// 是否需初始化地图模型
			if (this.$rtl.refreshMapViewModel) {
				this.initMap();
				this.$rtl.refreshMapViewModel = false;
			}
			
			// 注意：因为 axios 是加到 Vue 的原型中了，所以使用 axios 方法时，前面需要加 this
			this.axios.post('http://'+this.$rtl.hostIp + ':' + this.$rtl.port +'/doas/initData',{
				dataType : 'map-line',
				extractNum : this.$rtl.mapParams.extractNum,
				redList : this.$rtl.mapParams.redListStr,
				selectedFiles: this.$rtl.selectedFiles,
				timeRange: ''
			}).then(resp => {
				if (resp.data.code != -1) {
					this.$rtl.fileNameList = resp.data.result.fileNameList;
					if (resp.data.code == 1) {
						this.$rtl.sysState = resp.data.result.systemState[0] == '1'? 'success' : 'danger';
						this.$rtl.gpsState = resp.data.result.systemState[1] == '1'? 'success' : 'danger';
						this.$rtl.mapParams.redListStr = resp.data.result.redListStr;
						this.mapData.factors = resp.data.result.factors;
						this.mapData.data = resp.data.result.data;
						this.mapData.dataHigh = resp.data.result.dataHigh;
						this.mapData.colors = resp.data.result.colors;
						this.mapData.coordinates = resp.data.result.coordinates;
						this.mapData.red = resp.data.result.redList[this.mapData.activeIndex];
						this.initMapData(this.mapData.activeIndex);
					} else {
						object3Dlayer.clear();
					}
				}else{
					object3Dlayer.clear();
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
				let height = -1 * this.mapData.dataHigh[index][i] * this.$rtl.mapParams.hiehtFactor;
				// 连线
				lineGeo.vertices.push(center.x, center.y, 0);
				// 颜色
				let color = this.mapData.colors[index][i];
				lineGeo.vertexColors.push(color[0], color[1], color[2], 1);
				lineGeo.vertices.push(center.x, center.y, height);
				lineGeo.vertexColors.push(color[0], color[1], color[2], 1);
				if(this.toCoordinate == null 
					&& i == this.mapData.coordinates.length - 1){
					// 切换要素时，将最新的坐标设置地图坐标中心位置
					this.toCoordinate = coordinate;
					map.panTo(this.toCoordinate);
				}
			}
			object3Dlayer.add(lines);
			this.mapData.activeIndex = index;
			// 起点
			startMarker.setPosition(this.mapData.coordinates[0]);
			// 重点
			endMarker.setPosition(this.mapData.coordinates[this.mapData.coordinates.length - 1]);
			// 轨迹
			polyline.setPath(this.mapData.coordinates);
		},
		chooseFactors(index){
			this.toCoordinate = null;
			this.initMapData(index);
		}
	}
}
</script>
