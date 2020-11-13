<template>
  <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent ">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <a class="navbar-brand" href="javascript:void(0)"> {{ $route.name }}</a>
      </div>
      <div class="collapse navbar-collapse show text-left">
        <ul class="navbar-nav ml-auto">
			<li class="search-bar input-group" >
				<drop-down>
					<base-button round icon :type="$rtl.sysState" data-toggle="dropdown" data-target="#sysState">
						<i class="tim-icons icon-wifi"></i>
					</base-button>
					<ul class="dropdown-menu dropdown-navbar" id="sysState">
						<a href="#" class="dropdown-item">系统状态： {{ $rtl.sysState == 'success' ? '已连接' : '断开' }}</a>
					</ul>
				</drop-down>
				<drop-down>
					<base-button round icon :type="$rtl.gpsState" data-toggle="dropdown" data-target="#gpsState">
						<i class="tim-icons icon-send"></i>
					</base-button>
					<ul class="dropdown-menu dropdown-navbar" id="gpsState">
						<a href="#" class="dropdown-item">GPS状态： {{ $rtl.gpsState == 'success' ? '已连接' : '断开' }}</a>
					</ul>
				</drop-down>
				<base-button round icon type="primary" id="setting"
					@click="searchModalVisible = true"
					data-toggle="modal" data-target="#searchModal">
					<i class="tim-icons icon-settings-gear-63"></i>
				</base-button>
			</li>
			<modal :show.sync="searchModalVisible"
			       id="searchModal"
			       :centered="false"
			       :show-close="true">
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
							<base-input label="数据刷新时间(秒)"  type="number"
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
							<base-input label="数据刷新时间(秒)"  type="number"
								v-model="$rtl.mapParams.refreshSecond">
							</base-input>
						  </div>
						</div>
						<div class="row">
						  <div class="col-md-6 pr-md-6 text-left">
							<base-input label="红色浓度值" type="number"
								v-model="$rtl.mapParams.red">
							</base-input>
						  </div>
						  <div class="col-md-6 pr-md-6 text-left">
							<base-input label="线条高度调参"  type="number"
								v-model="$rtl.mapParams.hiehtFactor">
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
	#setting{margin-left: 10px !important;}
	.tim-icons{margin-bottom: 10px;}
	.modal-body{background-color: #f5f6fa;}
	.dropdown-item{text-align: center;}
	/*.modal.show .modal-dialog {
	    -webkit-transform: translate(0, 5%);
	}*/
</style>

<script>
import Modal from "@/components/Modal.vue";
import BaseButton from '@/components/BaseButton';
import {
  Card,
  BaseInput
} from "@/components/index";
export default{
	components:{
	  Modal,
	  Card,
	  BaseInput,
	  BaseButton
	},
	data() {
	  return {
		  searchModalVisible: false
	  };
	},
	methods:{
		closeModal(){
			this.$rtl.chartParams.refreshTimer = true;
			this.$rtl.mapParams.refreshTimer = true;
			this.searchModalVisible = false;
		}
	}
}
</script>
<style>
</style>
