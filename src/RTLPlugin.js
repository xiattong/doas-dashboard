export default {
  install(Vue) {
    let app = new Vue({
      data() {
        return {
          isRTL: false,
		  chartParams:{
			  extractNum: 100,  //抽取数量
			  refreshSecond: 1,  //刷新时间 单位：秒,1
			  refreshTimer: false  //定时器刷新控制
		  },
		  mapParams:{
			  extractNum: 0,  //抽取数量
			  refreshSecond: 3, //刷新时间 单位：秒，3
			  redList: '', //色等值
			  redListStr: '',
			  hiehtFactor: 30 ,//高度参数
			  refreshTimer: false //定时器刷新控制
		  },
		  sysState: 'danger',
		  gpsState: 'danger',
		  hostIp: '127.0.0.1',
		  port: '8099',
		  companyName: '',
		  mapType: '',
		  fileNameList: [],
		  selectedFiles: [],
		  timeRange: '',
		  // 地图模式
		  mapViewModel: '3D',
		  // 控制是否需初始化地图模型
		  refreshMapViewModel: false,
		  // 是否需要重新定位地图中心位置
		  refreshCenter: true,
		  // 光源光强
		  lightIntensity: 0,
		  // 光源已使用时间
		  lightServiceTime: 0
        }
      },
	  created(){
		  this.hostIp = window.location.hostname;
	  },
      methods: {
        getDocClasses() {
          return document.body.classList
        },
        enableRTL() {
          this.isRTL = true;
          this.getDocClasses().add('rtl');
          this.getDocClasses().add('menu-on-right');
          this.toggleBootstrapRTL(true);
        },
        disableRTL() {
          this.isRTL = false;
          this.getDocClasses().remove('rtl');
          this.getDocClasses().remove('menu-on-right');
          this.toggleBootstrapRTL(false);
        },
        toggleBootstrapRTL(value) {
          for (let i=0; i < document.styleSheets.length; i++){
            let styleSheet = document.styleSheets[i];
            let { href } = styleSheet;
            if(href && href.endsWith('bootstrap-rtl.css')){
              styleSheet.disabled = !value;
            }
          }
        }
      }
    });

    Vue.prototype.$rtl = app;
  }
}
