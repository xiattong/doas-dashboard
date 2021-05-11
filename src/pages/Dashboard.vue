<template>
  <div class="content">
    <div class="row">
        <div class="col-12">
            <card type="chart">
                <template slot="header">
                    <div class="row">
                        <div class="col-sm-3 text-left">
                            <template>
                                <h5 class="card-category">浓度曲线图</h5>
                            </template>
                        </div>
                    </div>
                </template>
                <line-chart class="chart-area" ref="bigChart" chart-id="big-line-chart" :chart-data="bigLineChart.chartData"
                 :gradient-colors="bigLineChart.gradientColors" :extra-options="bigLineChart.extraOptions">
                </line-chart>
            </card>
        </div>
    </div>
	<div class="row">
		<div class="col-md-12">
			<card>
				<template slot="header">
				  <h5 class="card-category">
					  最新时刻&nbsp;&nbsp;|&nbsp;&nbsp;采集因子 : 采集值 单位
				  </h5>
				</template>
				<base-alert type="success">
				  <span style="font-size: 0.70rem;">
					{{latestTime}}&nbsp;&nbsp;|&nbsp;&nbsp;{{realTimeData}}
				  </span>
				</base-alert>
			</card>
		</div>
	</div>
  </div>
</template>
<script>
import {
	Card
} from "@/components/index";

import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
import BaseAlert from '@/components/BaseAlert';


export default {
	components: {
		Card,
		LineChart,
		BaseAlert
	},
	data() {
		return {
			ip:'',
			timer: null,
			latestTime: '',
			realTimeData: '',
			bigLineChart: {
				bigLineChartCategories: [],
				labels: [],
				allData: [],
				factorColors: [],
				chartData: null,
				extraOptions: chartConfigs.purpleChartOptions,
				gradientColors: config.colors.primaryGradient
			}
		}
	},
	methods: {
		refreshChartData() {
			// 注意：因为 axios 是加到 Vue 的原型中了，所以使用 axios 方法时，前面需要加 this
			this.axios.post('http://'+this.$rtl.hostIp+':8090/doas/initData',{
				dataType : 'chart',
				extractNum : this.$rtl.chartParams.extractNum,
				currentFileName: this.$rtl.currentFileName == '读取最新' ? "" : this.$rtl.currentFileName
			}).then(resp => {
				if (resp.data.code == 0) {
					this.$rtl.companyName = resp.data.result.companyName;
					this.$rtl.mapType = resp.data.result.mapType;
					this.$rtl.sysState = resp.data.result.systemState[0] == '1'? 'success' : 'danger';
					this.$rtl.gpsState = resp.data.result.systemState[1] == '1'? 'success' : 'danger';
					this.$rtl.fileNameList = resp.data.result.fileNameList;
					this.bigLineChart.bigLineChartCategories = resp.data.result.factors;
					this.bigLineChart.factorColors = resp.data.result.factorColors;
					this.bigLineChart.labels = resp.data.result.xAxis;
					this.bigLineChart.allData = resp.data.result.data;
					this.latestTime = resp.data.result.latestTime;
					this.realTimeData = resp.data.result.realTimeData;
					this.initBigChart(this.bigLineChart.bigLineChartCategories.length);
				}else{
					this.bigLineChart.chartData = null;
				}
			}).catch(err => {
				console.log(err);
			})
			// 刷新定时器
			if(this.$rtl.chartParams.refreshTimer){
				this.$rtl.mapParams.refreshTimer = false;
				clearInterval(this.timer);
				this.timer = setInterval(this.refreshChartData, this.$rtl.chartParams.refreshSecond * 1000);
			}
		},
		initBigChart(index) {
			const dataset = [];
			for (let i = 0 ; i < index ; i ++) {
				dataset.push(
					{
						label: this.bigLineChart.bigLineChartCategories[i],
						borderWidth: 1,
						pointRadius: 1,
						pointBorderWidth: 1,
						borderColor: this.bigLineChart.factorColors[i],
						pointBackgroundColor: this.bigLineChart.factorColors[i],
						pointHoverBackgroundColor: this.bigLineChart.factorColors[i],
						pointBorderColor: 'rgba(255,255,255,0)',
						data: this.bigLineChart.allData[i]
					}
				)
			}
			
			let chartData = {
				labels: this.bigLineChart.labels,
				datasets: dataset
			}
			this.bigLineChart.chartData = chartData;
			this.$refs.bigChart.updateGradients(chartData);
		}
	},
	created() {
		//定时查询最新的图标数据
		this.timer = setInterval(this.refreshChartData, this.$rtl.chartParams.refreshSecond * 1000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	}
}
</script>
<style>
.chart-area {
	height: 50vh !important;
}
</style>
