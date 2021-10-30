<template>
  <div class="hello">
    <input type="text" placeholder="  时间范围" id="timeRange" v-model="date">
  </div>
</template>

<script>
export default {
    name: "myDate",
	props:{
		oldDate:{
			type:String,
			default:"",
		}
	},
    data() {
        return {
            date: "",// 存储选择的日期,
        };
    },
	created() {
		if(this.oldDate){
			this.date = this.oldDate
		}
	},
    mounted() {
		// 使用：执行一个laydate实例
        laydate.render(
			{
				elem: '#timeRange',
				type: 'time',
				range: true ,
				done: value => { // 点击确认执行的回调函数，会把当前选择的时间传入进来
				   // 把选择的时间赋值给先前定义好的变量，显示在页面
				   this.date = value;
				   this.$emit("selectedTime", value);
				}
			}
		);
    }
};
</script>

<style scoped>
	.hello {
		display: inline-block;
	}
	.hello input {
		margin-left: -4px;
		width: 220px;
		height: 40px;
		border-radius: 4px;
		border: 2px solid #e2e2e2;
	}
	.layui-laydate .layui-this {
		background-color: #1E9FFF !important;
	}
</style>