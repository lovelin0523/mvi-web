<template>
	<Button :disabled="disabled" :class="buttonClass" :style="btnStyle">
		<slot name="loading" v-if="loading && $slots.loading"></slot>
		<span v-else-if="loading">
			<m-icon :type="iconType" :url="iconUrl" :spin="iconSpin" :size="iconSize" class="mvi-button-load-icon"/>
			{{loadText}}
		</span>
		<slot v-else></slot>
	</Button>
</template>

<script>
	import $util from "../../util/util"
	import mIcon from "../icon/icon"
	export default {
		name:"m-button",
		props:{
			type:{
				type:String,
				default:"default",
				validator(value){
					return ['default','info','success','error','warn','primary'].includes(value);
				}
			},
			size:{
				type:String,
				default:"medium",
				validator(value){
					return ['mini','small','medium','large'].includes(value);
				}
			},
			disabled:{
				type:Boolean,
				default:false
			},
			nativeType:{
				type:String,
				default:'button'
			},
			loading:{
				type:Boolean,
				default:false
			},
			loadText:{
				type:String,
				default:"loading..."
			},
			formControl:{
				type:Boolean,
				default:false
			},
			tag:{
				type:String,
				default:'button'
			},
			plain:{
				type:Boolean,
				default:false
			},
			color:{
				type:String,
				default:null
			},
			subColor:{
				type:String,
				default:null
			},
			round:{//圆形按钮
				type:Boolean,
				default:false
			},
			square:{//方形按钮
				type:Boolean,
				default:false
			},
			active:{//是否显示点击态
				type:Boolean,
				default:true
			},
			loadIcon:{
				type:[String,Object],
				default:null
			}
		},
		computed:{
			iconType(){
				let type = 'load-e';
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.type == "string") {
						type = this.loadIcon.type;
					}
				} else if (typeof this.loadIcon == "string") {
					type = this.loadIcon;
				}
				return type;
			},
			iconUrl(){
				let url = null;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.url == "string") {
						url = this.loadIcon.url;
					}
				}
				return url;
			},
			iconSpin(){
				let spin = true;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.spin == "boolean") {
						spin = this.loadIcon.spin;
					}
				}
				return spin;
			},
			iconSize(){
				let size = null;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.size == "string") {
						size = this.loadIcon.size;
					}
				}
				return size;
			},
			btnStyle(){
				let obj = {};
				//单色
				if(this.plain){
					if(this.color){
						obj.color = this.color;
						obj.borderColor = this.color;
						obj.background = (this.subColor?this.subColor:'#fff');
					}
				}else{
					if(this.color){
						obj.background = this.color;
						obj.borderColor = this.color;
						obj.color = (this.subColor?this.subColor:'#fff');
					}
				}
				return obj;
			},
			buttonClass(){
				let cls = ['mvi-button'];
				if(this.type){
					cls.push('mvi-button-'+this.type)
				}
				if(this.size){
					cls.push('mvi-button-'+this.size);
				}
				if(this.round){
					cls.push('mvi-button-radius-round');
				}else if(this.square){
					cls.push('mvi-button-radius-square');
				}
				if(this.formControl){
					cls.push('mvi-button-form-control');
				}
				if(this.plain){
					cls.push('mvi-button-plain');
				}
				if(this.active && !this.disabled){
					cls.push('mvi-button-active');
				}
				if(this.loading){
					cls.push('mvi-button-loading');
				}
				return cls;
			}
		},
		components:{
			mIcon,
			Button:{
				render(createElement) {
					return createElement(this.$parent.tag,{
						on: Object.assign({}, this.$parent.$listeners),
						attrs: {
							type: this.$parent.nativeType
						}
					},this.$slots.default)
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-button{
		position: relative;
		display: inline-flex;
		display: -webkit-inline-flex;
		justify-content: center;
		align-items: center;
		vertical-align: middle;
		text-align: center;
		white-space: nowrap;
		border: 1px solid transparent;
		background: none;
		outline: 0;
		touch-action: manipulation;
		appearance: none;
		-webkit-appearance: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		margin: 0;
		padding: 0;
		border-radius:@radius-default;
		cursor: pointer;
	}

	// 按钮情景样式
	.mvi-button.mvi-button-default{
		background: #fff;
		border-color: @border-color;
		color: @font-color-default;
	}
	
	.mvi-button.mvi-button-warn{
		background: @warn-normal;
		border-color: @warn-normal;
		color: #fff;
	}
	.mvi-button.mvi-button-warn.mvi-button-plain{
		border-color:@warn-normal;
		background: #fff;
		color: @warn-normal;
	}
	
	.mvi-button.mvi-button-error{
		background: @error-normal;
		color: #fff;
		border-color: @error-normal;
	}
	.mvi-button.mvi-button-error.mvi-button-plain{
		border-color: @error-normal;
		background: #fff;
		color: @error-normal;
	}
	
	.mvi-button.mvi-button-success{
		background: @success-normal;
		border-color: @success-normal;
		color: #fff;
	}
	.mvi-button.mvi-button-success.mvi-button-plain{
		border-color: @success-normal;
		background: #fff;
		color: @success-normal;
	}
	
	.mvi-button.mvi-button-info{
		background: @info-normal;
		color: #fff;
		border-color: @info-normal;
	}
	.mvi-button.mvi-button-info.mvi-button-plain{
		border-color: @info-normal;
		color: @info-normal;
		background: #fff;
	}
	
	.mvi-button.mvi-button-primary{
		background: @primary-normal;
		color: #fff;
		border-color: @primary-normal;
	}
	.mvi-button.mvi-button-primary.mvi-button-plain{
		background: #fff;
		color: @primary-normal;
		border-color: @primary-normal;
	}
	
	//按钮大小
	.mvi-button.mvi-button-mini{
		height: @mini-height;
		padding: 0 @mp-xs;
		font-size:@font-size-small;
	}
	.mvi-button.mvi-button-small{
		font-size: @font-size-default;
		height: @small-height;
		padding: 0 @mp-sm;
	}
	.mvi-button.mvi-button-medium{
		font-size: @font-size-h6;
		height: @medium-height;
		padding: 0 @mp-md;
	}
	.mvi-button.mvi-button-large{
		font-size: @font-size-h5;
		height: @large-height;
		padding: 0 @mp-lg;
	}
	
	//加载按钮图标
	.mvi-button-load-icon{
		margin-right: @mp-xs;
	}
	
	//按钮圆角
	.mvi-button.mvi-button-radius-round{
		border-radius: @radius-round;
	}
	
	//方形按钮
	.mvi-button.mvi-button-radius-square{
		border-radius: 0;
	}
	
	//点击态
	.mvi-button.mvi-button-active:active::before{
		.mvi-active();
	}
	
	//禁用
	.mvi-button[disabled]{
		opacity: .5;
		touch-action: none;
	}
	
	//独占一行的按钮
	.mvi-button.mvi-button-form-control{
		display: flex;
		display: -webkit-flex;
		width: 100%;
	}
	
	//加载状态
	.mvi-button.mvi-button-loading{
		pointer-events: none;
		touch-action: none;
		opacity: .8;
	}
</style>
