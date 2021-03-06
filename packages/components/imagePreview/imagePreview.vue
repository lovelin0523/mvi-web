<template>
	<m-overlay :show="show" v-on="listeners" color="#000" :fade="false" @showing="overlayShowing" :local="local" :z-index="zIndex"
	 :use-padding="usePadding">
		<m-swiper v-if="firstShow" class="mvi-image-preview-swiper" :initial-slide="active" show-indicators ref="swiper"
		 :width="swiperWidth" :height="swiperHeight" @change="swiperChange" @mousedown="mouseDown" @mouseup="mouseUp" :show-control="showControl"
		 :fade="fade" :touchable="!isDoubleTouch" :control-class="controlClass">
			<m-swiper-slide v-for="(item,index) in images" :key="'image-'+index" @wheel="wheelImage(index,$event)" 
			@touchstart="prviewTouchStart(index,$event)" @touchmove="previewTouchMove(index,$event)" 
			@touchend="previewTouchend(index,$event)" :id="'mvi-preview-slide-'+index" class="mvi-preview-container">
				<m-image :error-icon="errorIcon" :load-icon="loadIcon" @click="closeOverlay" class="mvi-image-preview" :src="item" fit="response" ref="images"></m-image>
			</m-swiper-slide>
			<template v-slot:indicators="data">
				<div class="mvi-image-preview-page" v-if="showPage">
					<slot name="page" :total="data.total" :current="data.active" v-if="$scopedSlots.page"></slot>
					<div v-else>
						<span v-text="data.active+1"></span>
						<span>/</span>
						<span v-text="data.total"></span>
					</div>
				</div>
				<div v-if="$scopedSlots.descriptions || descriptions.length>0" class="mvi-image-preview-footer">
					<slot name="descriptions" :total="data.total" :current="data.active" v-if="$scopedSlots.descriptions"></slot>
					<div v-else-if="descriptions.length>0" class="mvi-image-preview-description" v-text="descriptions[data.active]"></div>
				</div>
			</template>
		</m-swiper>

	</m-overlay>
</template>

<script>
	import mOverlay from "../overlay/overlay"
	import mSwiper from "../swiper/swiper"
	import mSwiperSlide from "../swiper/swiper-slide"
	import mImage from "../image/image"
	export default {
		name: "m-image-preview",
		data() {
			return {
				firstShow: false,
				start: 0,
				end: 0,
				isDoubleTouch:false,//是否双指触摸
				touchDistance:0,//双指触点距离
				swiperWidth:'100%',//轮播图宽度
				swiperHeight:'100%',//轮播图高度
				scale:1,//缩放比例
			}
		},
		model: {
			prop: 'show',
			event: 'model-change'
		},
		props: {
			show: { //是否显示
				type: Boolean,
				default: false
			},
			images: { //图片数组
				type: Array,
				default: function() {
					return [];
				}
			},
			descriptions: { //图片描述
				type: Array,
				default: function() {
					return []
				}
			},
			active: { //默认显示的图片序列
				type: Number,
				default: 0
			},
			showPage: { //是否显示页码
				type: Boolean,
				default: true
			},
			local: { //是否局部显示
				type: Boolean,
				default: false
			},
			zIndex: { //z-index值
				type: Number,
				default: 5000
			},
			fade: { //是否使用渐变
				type: Boolean,
				default: false
			},
			showControl: { //是否显示控制器
				type: Boolean,
				default: false
			},
			controlClass: { //控制器额外样式
				type: String,
				default: null
			},
			usePadding: {//局部显示是否考虑滚动条影响
				type: Boolean,
				default: false
			},
			errorIcon:{//图片加载失败提示设置
				type:[String,Object],
				default:function(){
					return {
						size:'1rem'
					}
				}
			},
			loadIcon:{//图片加载中提示设置
				type:[String,Object],
				default:function(){
					return {
						size:'1rem'
					}
				}
			}
		},
		computed: {
			listeners() {
				return Object.assign({}, this.$listeners)
			}
		},
		components:{
			mOverlay,mSwiper,mSwiperSlide,mImage
		},
		mounted() {
			window.on(`resize.imagePreview_${this._uid}`,this.resize)
		},
		methods: {
			//调整大小
			resize(){
				if(this.show){
					this.$nextTick(()=>{
						this.swiperWidth = this.$el.offsetWidth+'px';
						this.swiperHeight = this.$el.offsetHeight+'px';
					})
				}
			},
			//遮罩层显示时
			overlayShowing() {
				if (!this.firstShow) {
					this.firstShow = true;
				}
				this.$nextTick(()=>{
					this.swiperWidth = this.$el.offsetWidth+'px';
					this.swiperHeight = this.$el.offsetHeight+'px';
				})
			},
			//pc端鼠标按下
			mouseDown(event) {
				this.start = event.pageX;
			},
			//pc端鼠标松开
			mouseUp(event) {
				this.end = event.pageX;
			},
			//关闭遮罩
			closeOverlay(e) {
				if (this.start != this.end) {
					return;
				}
				this.scale = 1;
				this.$refs.images.forEach(image=>{
					image.$el.style.transform = '';
				})
				this.$emit('model-change', false);
				this.$emit('update:show', false);
			},
			//图片变更
			swiperChange(active) {
				this.scale = 1;
				this.$refs.images.forEach(image=>{
					image.$el.style.transform = '';
				})
				this.$emit('change', active);
			},
			//滚轮
			wheelImage(index,event) {
				let deltaY = event.deltaY; //正值向下滚，负值向上滚
				let el = this.$refs.images[index].$el; //图片元素
				if (deltaY > 0) { //向下滚，缩小图片
					if(this.scale > 0.5){
						this.scale -= 0.1;
					}
				} else { //向上滚，放大图片
					if(this.scale < 2){
						this.scale += 0.1;
					}
					
				}
				el.style.transform = `scale(${this.scale})`;
			},
			//双指触摸事件
			prviewTouchStart(index,event){
				if(event.touches.length == 2){
					this.isDoubleTouch = true;
					this.touchDistance = this.getDistance(event.touches[0],event.touches[1]);
				}else {
					this.isDoubleTouch = false;
				}
			},
			//双指移动事件
			previewTouchMove(index,event){
				if(event.touches.length == 2 && this.isDoubleTouch){
					if(event.cancelable){
						event.preventDefault()
					}
					let el = this.$refs.images[index].$el; //图片元素
					let distance = this.getDistance(event.touches[0],event.touches[1])
					if(distance < this.touchDistance){//缩小
						if(this.scale > 0.5){
							this.scale += (distance - this.touchDistance) / el.offsetWidth;
						}
					}else {//放大
						if(this.scale < 2){
							this.scale += (distance - this.touchDistance) / el.offsetWidth;
						}
					}
					el.style.transform = `scale(${this.scale})`;
					this.touchDistance = distance;
				}
			},
			//双指触摸松开事件
			previewTouchend(index,event){
				if(this.isDoubleTouch){
					setTimeout(()=>{
						this.isDoubleTouch = false;
					},300)
				}
			},
			//获取两点间距离
			getDistance(p1, p2){
				let x = p2.pageX - p1.pageX;
				let y = p2.pageY - p1.pageY;
				return Math.sqrt((x * x) + (y * y));
			}
		},
		beforeDestroy() {
			window.off(`resize.imagePreview_${this._uid}`)
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";

	.mvi-image-preview-swiper {
		background-color: #000;

		.mvi-preview-container{
			overflow: hidden;
		}

		.mvi-image-preview {
			width: 100%;
			height: 100%;
		}
	}

	.mvi-image-preview-page {
		position: absolute;
		display: block;
		color: #fff;
		top: 0;
		left: 0;
		width: 100%;
		padding: @mp-sm 0;
		text-align: center;
		background-color: rgba(0, 0, 0, .6);
		z-index: 20;

		span+span {
			margin-left: @mp-xs;
		}
	}

	.mvi-image-preview-footer {
		display: block;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .6);
		color: #fff;
		z-index: 20;
	}

	.mvi-image-preview-description {
		padding: @mp-md @mp-sm;
	}
</style>
