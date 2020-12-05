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
                        <div class="col-sm-9">
                            <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
                                <template>
                                    <label v-for="(option, index) in bigLineChart.bigLineChartCategories" 
										:key="option" class="btn btn-success btn-sm btn-simple"
										:class="{active:bigLineChart.activeIndex === index}" :id="index">
                                        <input type="radio" @click="initBigChart(index)" name="options" autocomplete="off" 
											:checked="bigLineChart.activeIndex === index">
                                        {{ option }}
                                    </label>
                                </template>
                            </div>
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
				activeIndex: 0,
				chartData: {
					datasets: [{}]
				},
				extraOptions: chartConfigs.purpleChartOptions,
				gradientColors: config.colors.primaryGradient,
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
					this.bigLineChart.labels = resp.data.result.xAxis;
					this.bigLineChart.allData = resp.data.result.data;
					this.latestTime = resp.data.result.latestTime;
					this.realTimeData = resp.data.result.realTimeData;
					this.initBigChart(this.bigLineChart.activeIndex);
				}else{
					this.bigLineChart.chartData = {datasets: [{}]}
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
			let chartData = {
				datasets: [{
					fill: true,
					borderColor: config.colors.primary,
					borderWidth: 1,
					borderDash: [],
					borderDashOffset: 0.0,
					pointBackgroundColor: config.colors.primary,
					pointBorderColor: 'rgba(255,255,255,0)',
					pointHoverBackgroundColor: config.colors.primary,
					pointRadius: 1,
					pointHoverRadius: 7,
					pointBorderWidth: 1,
					pointHoverBorderWidth: 1,
					data: this.bigLineChart.allData[index]
				}],
				labels: this.bigLineChart.labels
			}
			this.$refs.bigChart.updateGradients(chartData);
			this.bigLineChart.chartData = chartData;
			this.bigLineChart.activeIndex = index;
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
