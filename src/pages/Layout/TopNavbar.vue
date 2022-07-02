<template>
	<nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent ">
		<div class="container-fluid">
			<div class="navbar-wrapper">
				<a class="navbar-brand" href="javascript:void(0)"> {{ $route.name }}</a>
			</div>
			<div class="collapse navbar-collapse show text-left">
				<ul class="navbar-nav ml-auto">
					<li class="search-bar input-group">
						<drop-down>
							<base-button simple :type="$rtl.sysState" data-toggle="dropdown" data-target="#sysState">
								设备状态：{{ $rtl.sysState == 'success' ? '已连接' : ($rtl.sysState == 'warning' ? '正在连接' : '断开') }}
							</base-button>
						</drop-down>
						<drop-down>
							<base-button simple :type="$rtl.gpsState" data-toggle="dropdown" data-target="#gpsState" style="margin-right: 0.6rem;">
								GPS状态：{{ $rtl.gpsState == 'success' ? '已连接' :  ($rtl.gpsState == 'warning' ? '正在搜索' : '断开') }}
							</base-button>
						</drop-down>
						<drop-down tag="div" class="file-select">
							<button aria-label="Success" data-toggle="dropdown"
								class="dropdown-toggle btn-rotate btn btn-success">
								{{ selectFileTip }}
							</button>
							<ul class="dropdown-menu file-select-ul">
								<template>
									<el-checkbox label="读取最新" :indeterminate="isIndeterminate" v-model="checkNew"
										@change="selectNew()"></el-checkbox>
									<el-checkbox-group v-model="checkList" @change="selectFiles()">
										<el-checkbox v-for="(option) in $rtl.fileNameList" :key="option"
											:label="option"></el-checkbox>
									</el-checkbox-group>
								</template>
							</ul>
						</drop-down>
						<drop-down>
							<base-button  v-if="$route.name == '地图'" :type="modelBtnColor" @click="changeMapModle()">{{this.$rtl.mapViewModel == '3D' ? '查看轨迹' : '查看数据' }}</base-button>
						</drop-down>
						<base-button round icon type="primary" id="setting" @click="searchModalVisible = true"
							data-toggle="modal" data-target="#searchModal">
							<i class="tim-icons icon-settings-gear-63"></i>
						</base-button>
						<base-button round icon type="info" data-toggle="modal" @click="printscreen" id="printscreen">
							<i class="tim-icons icon-scissors"></i>
						</base-button>
						<div id="imgBox" hidden="hidden"></div>
					</li>
					<modal :show.sync="searchModalVisible" id="searchModal" :centered="true" :show-close="true">
						<base-button link @click="closeModal()" class="close">
							<i class="tim-icons icon-simple-remove"></i>
						</base-button>
						<card>
							<div class="row">
								<div class="col-md-12 pr-md-12 text-left">
									<h5 class="title">曲线图参数设置</h5>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6 pr-md-6 text-left">
									<base-input label="最大数据抽取数量(0:表示全量抽取)" type="number"
										v-model="$rtl.chartParams.extractNum">
									</base-input>
								</div>
					 		<div class="col-md-6 pr-md-6 text-left">
									<base-input label="数据刷新时间(秒)" type="number"
										v-model="$rtl.chartParams.refreshSecond">
									</base-input>
								</div>
							</div>
						</card>
						<card>
							<div class="row">
								<div class="col-md-12 pr-md-12 text-left">
									<h5 class="title">地图参数设置</h5>
								</div>
							</div>
							<div class="row">
					 		<div class="col-md-6 pr-md-6 text-left">
									<base-input label="最大数据抽取数量(0:表示全量抽取)" type="number"
										v-model="$rtl.mapParams.extractNum">
									</base-input>
								</div>
								<div class="col-md-6 pr-md-6 text-left">
									<base-input label="数据刷新时间(秒)" type="number" v-model="$rtl.mapParams.refreshSecond">
									</base-input>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 pr-md-12 text-left">
									<base-input label="线条高度调参" type="number" v-model="$rtl.mapParams.hiehtFactor">
									</base-input>
					 		</div>
							</div>
							<div class="row">
								<div class="col-md-12 pr-md-12 text-left">
									<base-input label="红色色等值(0:表示系统处理; 如需指定,请与因子一一对应,使用英文逗号隔开)" type="string"
										v-model="$rtl.mapParams.redListStr">
									</base-input>
								</div>
							</div>
						</card>
					</modal>
				</ul>
			</div>
		</div>
	</nav>
</template>
<style>
	#printscreen {
		margin-left: 1.25rem;
	}

	.tim-icons {
		margin-bottom: 10px;
	}

	.modal-body {
		background-color: #f5f6fa;
	}

	.dropdown-item {
		text-align: center;
		margin-left: 10px;
	}

	.btn-rotate {
		width: 180px;
	}

	.file-select .el-checkbox {
		margin-left: 10px;
	}

	.file-select {
		margin-right: 1.25rem;
	}

	.modal.show .modal-dialog {
		-webkit-transform: translate(0, 5%);
		-ms-transform: translate(0, 5%);
		transform: translate(0, 5%);
	}
</style>
<script>
	import Modal from "@/components/Modal.vue";
	import BaseButton from '@/components/BaseButton';
	import html2canvas from 'html2canvas';
	import {
		Card,
		BaseInput
	} from "@/components/index";
	export default {
		components: {
			Modal,
			Card,
			BaseInput,
			BaseButton
		},
		data() {
			return {
				selectFileTip: "读取最新",
				searchModalVisible: false,
				checkNew: true,
				isIndeterminate: false,
				checkList: [],
				mapViewModel: '3D',
				modelBtnColor: 'info'
			};
		},
		mounted() {
			this.checkList = this.$rtl.selectedFiles;
		},
		methods: {
			selectNew() {
				if (this.checkNew) {
					this.isIndeterminate = false;
					this.checkList = [];
					this.selectFileTip = '读取最新';

				} else {
					this.isIndeterminate = true;
				}
				this.$rtl.selectedFiles = this.checkList;
				this.$rtl.refreshCenter = true;
			},
			selectFiles() {
				if (this.checkList.length > 0) {
					this.selectFileTip = '自主选择';
					this.isIndeterminate = true;
					this.checkNew = false;
				}
				this.$rtl.selectedFiles = this.checkList;
				this.$rtl.refreshCenter = true;
			},
			closeModal() {
				this.$rtl.chartParams.refreshTimer = true;
				this.$rtl.mapParams.refreshTimer = true;
				this.searchModalVisible = false;
			},
			//截图方法
			printscreen() {
				html2canvas(document.body).then(function(canvas) {
					//截图用img元素承装，显示在页面的上
					let img = new Image();
					img.src = canvas.toDataURL('image/jpeg'); // toDataURL :图片格式转成 base64
					document.getElementById('imgBox').removeChild;
					document.getElementById('imgBox').appendChild(img);
					//如果你需要下载截图，可以使用a标签进行下载
					let a = document.createElement('a');
					a.href = canvas.toDataURL('image/jpeg');
					a.download = 'imgBox';
					a.click();
				})
			},
			changeMapModle() {
				this.$rtl.refreshCenter = true;
				if (this.mapViewModel == '3D') {
					// 轨迹图
					this.mapViewModel = '2D';
					this.modelBtnColor = 'warning';
				} else {
					this.mapViewModel = '3D';
					this.modelBtnColor = 'info';
				}
				if (this.$rtl.mapViewModel != this.mapViewModel) {
					this.$rtl.refreshMapViewModel = true;
				}
				this.$rtl.mapViewModel = this.mapViewModel;
			}
		}
	}
</script>
