<template>
	<transition :name="'mvi-tab-'+tabs.animation+(back?'-back':'')">
		<div v-on="listeners" v-show="show" v-if="firstShow" class="mvi-tab" :style="tabStyle">
			<slot></slot>
		</div>
	</transition>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-tab",
		inject:['tabs'],
		data(){
			return {
				show:false,
				back:false,
				firstShow:false
			}
		},
		created() {
			this.tabs.children.push(this);
			if(this.tabs.active == this.tabIndex){
				this.show = true;
				if(!this.firstShow){
					this.firstShow = true;
				}
			}
		},
		props:{
			title:{//标题
				type:String,
				default:""
			},
			icon:{//标题左侧显示的图标
				type:[String,Object],
				default:null
			},
			disabled:{//是否禁用选项卡
				type:Boolean,
				default:false
			},
			placement:{
				type:String,
				default:'left',
				validator(value){
					return ['left','right'].includes(value)
				}
			}
		},
		computed:{
			listeners(){
				return Object.assign({},this.$listeners);
			},
			tabStyle(){
				let style = {};
				if(this.tabs.animation == 'slide'){
					style.transition = 'left '+this.tabs.timeout+'ms,opacity '+this.tabs.timeout+'ms';
					style.webkitTransition = 'left '+this.tabs.timeout+'ms,opacity '+this.tabs.timeout+'ms';
				}else if(this.tabs.animation == 'fade'){
					style.transition = 'opacity '+this.tabs.timeout+'ms';
					style.webkitTransition = 'opacity '+this.tabs.timeout+'ms';
				}
				if(this.tabs.contentBackground){
					style.backgroundColor = this.tabs.contentBackground;
				}
				return style;
			},
			iconType() {
				let t = null;
				if ($util.isObject(this.icon)) {
					if (typeof this.icon.type == "string") {
						t = this.icon.type;
					}
				} else if (typeof this.icon == "string") {
					t = this.icon;
				}
				return t;
			},
			iconUrl() {
				let url = null;
				if ($util.isObject(this.icon)) {
					if (typeof this.icon.url == "string") {
						url = this.icon.url;
					}
				}
				return url;
			},
			iconSpin() {
				let spin = false;
				if ($util.isObject(this.icon)) {
					if (typeof this.icon.spin == "boolean") {
						spin = this.icon.spin;
					}
				}
				return spin;
			},
			iconSize(){
				let size = null;
				if ($util.isObject(this.icon)) {
					if (typeof this.icon.size == "string") {
						size = this.icon.size;
					}
				}
				return size;
			},
			iconColor(){
				let color = null;
				if ($util.isObject(this.icon)) {
					if (typeof this.icon.color == "string") {
						color = this.icon.color;
					}
				}
				return color;
			},
			//tab在tabs中的序列值
			tabIndex() {
				let index = 0;
				for (let i = 0; i < this.tabs.children.length; i++) {
					if (this.tabs.children[i] == this) {
						index = i;
						break;
					}
				}
				return index;
			},
		},
		methods:{
			
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-tab{
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		padding: 0;
		background-color: #fff;
	}
	.mvi-tab-fade-enter,.mvi-tab-fade-leave-to,
	.mvi-tab-fade-back-enter,.mvi-tab-fade-back-leave-to{
		opacity: 0;
	}
	
	.mvi-tab-slide-enter{
		left: 100%;
		opacity: 0;
	}
	.mvi-tab-slide-leave-to{
		left: -100%;
		opacity: 0;
	}
	
	.mvi-tab-slide-back-enter{
		left: -100%;
		opacity: 0;
	}
	.mvi-tab-slide-back-leave-to{
		left: 100%;
		opacity: 0;
	}
</style>
