<template>
  <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent ">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <a class="navbar-brand" href="javascript:void(0)"> {{ $route.name }}</a>
      </div>
      <div class="collapse navbar-collapse show text-left">
        <ul class="navbar-nav ml-auto">
			<li class="search-bar input-group"  @click="searchModalVisible = true">
			  <button class="btn btn-link" id="search-button" data-toggle="modal" data-target="#searchModal">
				  <i class="tim-icons icon-settings"></i>
			    <span class="d-lg-none d-md-block">参数设置</span>
			  </button>
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
							<base-input label="红色曲线临界浓度" type="number"
								v-model="$rtl.mapParams.red">
							</base-input>
						  </div>
						  <div class="col-md-6 pr-md-6 text-left">
							<base-input label="曲线高度参数"  type="number"
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
	.tim-icons{margin-bottom: 10px;}
	.modal-body{background-color: #f5f6fa;}
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
		  searchModalVisible: false,
		  searchQuery: ''
	  };
	},
	created(){
		console.log( this.$rtl.chartParams.refreshSecond);
		console.log( this.$rtl.chartParams.extractNum);
		console.log('***********************************************')
		console.log( this.$rtl.mapParams.refreshSecond);
		console.log( this.$rtl.mapParams.extractNum);
		console.log( this.$rtl.mapParams.red);
		console.log( this.$rtl.mapParams.hiehtFactor);
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
