<template>
	<div v-on="listeners" :class="['mvi-steps',vertical?'mvi-steps-vertical':'']"
	:style="{backgroundColor:background?background:''}">
		<slot></slot>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-steps",
		data(){
			return {
				children:[]
			}
		},
		props:{
			active:{//当前步骤
				type:Number,
				default:0
			},
			vertical:{//是否垂直
				type:Boolean,
				default:false
			},
			activeColor:{//激活状态的颜色
				type:String,
				default:null
			},
			inactiveColor:{//未激活状态的颜色
				type:String,
				default:null
			},
			activeIcon:{//激活状态的图标
				type:[String,Object],
				default:null
			},
			inactiveIcon:{//未激活状态的图标
				type:[String,Object],
				default:null
			},
			background:{//背景色
				type:String,
				default:null
			}
		},
		provide(){
			return {
				steps:this
			}
		},
		computed:{
			listeners(){
				return Object.assign({},this.$listeners)
			},
			activeIconType() {
				let t = 'success-o';
				if ($util.isObject(this.activeIcon)) {
					if (typeof this.activeIcon.type == "string") {
						t = this.activeIcon.type;
					}
				} else if (typeof this.activeIcon == "string") {
					t = this.activeIcon;
				}
				return t;
			},
			activeIconUrl() {
				let url = null;
				if ($util.isObject(this.activeIcon)) {
					if (typeof this.activeIcon.url == "string") {
						url = this.activeIcon.url;
					}
				}
				return url;
			},
			activeIconSpin() {
				let spin = false;
				if ($util.isObject(this.activeIcon)) {
					if (typeof this.activeIcon.spin == "boolean") {
						spin = this.activeIcon.spin;
					}
				}
				return spin;
			},
			activeIconSize(){
				let size = null;
				if ($util.isObject(this.activeIcon)) {
					if (typeof this.activeIcon.size == "string") {
						size = this.activeIcon.size;
					}
				}
				return size;
			},
			activeIconColor(){
				let color = null;
				if ($util.isObject(this.activeIcon)) {
					if (typeof this.activeIcon.color == "string") {
						color = this.activeIcon.color;
					}
				}
				return color;
			},
			inactiveIconType() {
				let t = null;
				if ($util.isObject(this.inactiveIcon)) {
					if (typeof this.inactiveIcon.type == "string") {
						t = this.inactiveIcon.type;
					}
				} else if (typeof this.inactiveIcon == "string") {
					t = this.inactiveIcon;
				}
				return t;
			},
			inactiveIconUrl() {
				let url = null;
				if ($util.isObject(this.inactiveIcon)) {
					if (typeof this.inactiveIcon.url == "string") {
						url = this.inactiveIcon.url;
					}
				}
				return url;
			},
			inactiveIconSpin() {
				let spin = false;
				if ($util.isObject(this.inactiveIcon)) {
					if (typeof this.inactiveIcon.spin == "boolean") {
						spin = this.inactiveIcon.spin;
					}
				}
				return spin;
			},
			inactiveIconSize(){
				let size = null;
				if ($util.isObject(this.inactiveIcon)) {
					if (typeof this.inactiveIcon.size == "string") {
						size = this.inactiveIcon.size;
					}
				}
				return size;
			},
			inactiveIconColor(){
				let color = null;
				if ($util.isObject(this.inactiveIcon)) {
					if (typeof this.inactiveIcon.color == "string") {
						color = this.inactiveIcon.color;
					}
				}
				return color;
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-steps{
		display: flex;
		display: -webkit-flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: @mp-sm;
		background-color: #fff;
	}
	
	.mvi-steps.mvi-steps-vertical{
		flex-direction: column;
		-ms-flex-direction: column;
		-webkit-flex-direction: column;
	}
</style>
