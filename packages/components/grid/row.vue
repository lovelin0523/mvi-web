<template>
	<Row class="mvi-row" :style="rowStyle">
		<slot></slot>
	</Row>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:'m-row',
		props:{
			justify:{//排列方式
				type:String,
				default:'flex-start',
				validator(value){
					return ['flex-start','flex-end','space-around','space-between'].lastIndexOf(value)>-1
				}
			},
			align:{
				type:String,
				default:'flex-start',
				validator(value){
					return ['flex-start','flex-end','center'].lastIndexOf(value)>-1
				}
			},
			tag:{
				type:String,
				default:'div'
			}
		},
		provide(){
			return {
				row:this
			}
		},
		computed:{
			rowStyle(){
				let style = {};
				style.justifyContent = this.justify;
				style.alignItems = this.align;
				return style;
			}
		},
		components:{
			Row:{
				render(createElement) {
					return createElement(this.$parent.tag,{
						on: Object.assign({}, this.$parent.$listeners)
					},this.$slots.default)
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.mvi-row {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
	}
</style>
