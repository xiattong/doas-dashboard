<template>
  <div class="content">
	<div class="row">
		<div class="col-12">
			<card type="chart">
				<template slot="header">
					<div class="row">
						<div class="col-sm-6 text-left">
							<template>
								<h5 class="card-category">浓度曲线图</h5>
							</template>
						</div>
						<div class="col-sm-6">
							<div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
								<template>
									<label v-for="(option, index) in bigLineChart.bigLineChartCategories" :key="option" class="btn btn-success btn-sm btn-simple"
									 :class="{active:bigLineChart.activeIndex === index}" :id="index">
										<input type="radio" @click="initBigChart(index)" name="options" autocomplete="off" :checked="bigLineChart.activeIndex === index">
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
		<div class="col-lg-12 col-md-12">
			<card class="card">
				<template slot="header"><!--<i class="tim-icons icon-time-alarm text-success "></i> -->
				  <h5 class="card-category">实时数据</h5>
				  <h3 class="card-title">{{latestTime}}</h3>
				</template>
				<div class="table-responsive">
					<base-table :data="table.data" :columns="table.columns" table-class="text-left" thead-classes="text-primary">
					</base-table>
				</div>
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
	import BaseTable from "@/components/BaseTable";
	import config from '@/config';


	export default {
		components: {
			Card,
			BaseTable,
			LineChart
		},
		data() {
			return {
				latestTime: '',
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
					timer: null,
				},
				table: {
					title: "Simple Table",
					columns: ["采集因子", "采集值", "单位"],
					data: [{}]
				}
			}
		},
		methods: {
			refreshChartData() {
				// 注意：因为 axios 是加到 Vue 的原型中了，所以使用 axios 方法时，前面需要加 this
				this.axios.post('http://localhost:8090/doas/initData')
					.then(resp => {
						if (resp.data.code == 0) {
							this.bigLineChart.bigLineChartCategories = resp.data.result.factors;
							this.bigLineChart.labels = resp.data.result.xAxis;
							this.bigLineChart.allData = resp.data.result.data;

							this.latestTime = resp.data.result.tableDate[0].TIME;
							this.table.data = resp.data.result.tableDate;
							this.initBigChart(this.bigLineChart.activeIndex);
						}
					}).catch(err => {
						console.log(err);
					})
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
						pointBorderWidth: 10,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 15,
						pointRadius: 4,
						data: this.bigLineChart.allData[index]
					}],
					labels: this.bigLineChart.labels
				}
				this.$refs.bigChart.updateGradients(chartData);
				this.bigLineChart.chartData = chartData;
				this.bigLineChart.activeIndex = index;
			}
		},
		mounted() {
			//定时查询最新的图标数据
			this.timer = setInterval(this.refreshChartData, 1000);
			this.initBigChart(0);
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>
<style>
	.chart-area {
		height: 100% !important;
	}
</style>
