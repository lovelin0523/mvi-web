import $util from "../../util/util"
/**
 * Drag拖拽插件
 */
class Drag {
	constructor(element,options) {
		this.$el = element;//被拖拽的元素
		if(!$util.isObject(options)){
			options = {};
		}
		this.$container = options.container;//可拖拽的区域
		this.draggableX = options.draggableX; //x轴方向是否可拖动
		this.draggableY = options.draggableY; //Y轴方向是否可拖动
		this.mode = options.mode; //值为on时元素的中心可以在容器边界上，值为in时元素全部只能在容器内，值为out时元素可以在容器外部边缘
		this.drag = options.drag; //元素被拖动时触发
		this.beforedrag = options.beforedrag; //元素开始拖动时触发
		this.dragged = options.dragged; //元素拖拽结束触发
		this.ready = options.ready; //初始化完毕的回调
		this.draggable = false; //是否可拖动
		this.hasInit = false; //是否已经初始化
		this.pageX = 0;//X坐标
		this.pageY = 0;//Y坐标
		this.guid = this._createGuid();//生成唯一标识
	}
	
	//初始化
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		
		if (!$util.isElement(this.$el)) {
			throw new TypeError("The element that needs to be dragged is not a node element");
		}
		if (typeof this.$container == "string" && this.$container) {
			this.$container = document.body.querySelector(this.$container);
		}
		if (!$util.isElement(this.$container)) {
			this.$container = document.body;
		}
		if (!$util.isContains(this.$container, this.$el)) {
			throw new Error("Elements that need to be dragged are not descendants of container elements");
		}
		if ($util.getCssStyle(this.$container, "position") == "static") {
			this.$container.style.position = "relative";
		}
		if ($util.getCssStyle(this.$el, "position") == "static" || $util.getCssStyle(this.$el, "position") == 'relative') {
			this.$el.style.position = "absolute";
		}
		if (typeof this.draggableY != "boolean") {
			this.draggableY = true;
		}
		if (typeof this.draggableX != "boolean") {
			this.draggableX = true;
		}
		if (this.mode != "on" && this.mode != "in" && this.mode != "over" && this.mode != "out") {
			this.mode = ""; //默认对拖拽范围不做限定
		}
		if (typeof this.drag != "function") {
			this.drag = function() {};
		}
		if (typeof this.beforedrag != "function") {
			this.beforedrag = function() {};
		}
		if (typeof this.dragged != "function") {
			this.dragged = function() {};
		}
		if (typeof this.ready != "function") {
			this.ready = function() {};
		}
		//设置拖拽事件
		this._setOn();
		//初始化回调
		this.ready(this);
	}
	
	//设置拖拽事件
	_setOn(){
		//触摸开始
		this.$el.on('touchstart.drag',e=>{
			this.pageX = e.targetTouches[0].pageX - $util.getElementPoint(this.$el, this.$container).left;
			this.pageY = e.targetTouches[0].pageY - $util.getElementPoint(this.$el, this.$container).top;
			this.draggable = true;
			this.$el.style.cursor = 'move'
			//监听事件，监听刚开始拖动触发
			this.beforedrag({
				target: this.$el,
				container: this.$container,
				placement: $util.getElementPoint(this.$el, this.$container)
			});
		})
		//触摸移动
		this.$el.on('touchmove.drag',e=>{
			if (e.cancelable) {
				e.preventDefault();
			}
			if (this.draggable) {
				let left = e.targetTouches[0].pageX - this.pageX;
				let top = e.targetTouches[0].pageY - this.pageY;
				if (this.draggableX) {
					this.$el.style.left = left + 'px';
				}
				if (this.draggableY) {
					this.$el.style.top = top + 'px';
				}
				this._resize();
				if (this.draggableX || this.draggableY) {
					//监听事件
					this.drag({
						target: this.$el,
						container: this.$container,
						placement: $util.getElementPoint(this.$el, this.$container)
					})
				}
			}
		})
		//触摸松开后，拖拽状态更改为false，触发监听事件
		this.$el.on('touchend.drag',e=>{
			if (this.draggable) {
				this.draggable = false;
				this.$el.style.cursor = ''
				//监听事件
				this.dragged({
					target: this.$el,
					container: this.$container,
					placement: $util.getElementPoint(this.$el, this.$container)
				})
			}
		})
		//鼠标按下
		this.$el.on('mousedown.drag',e=>{
			this.pageX = e.pageX - $util.getElementPoint(this.$el, this.$container).left;
			this.pageY = e.pageY - $util.getElementPoint(this.$el, this.$container).top;
			this.draggable = true;
			this.$el.style.cursor = 'move'
			//监听事件，监听刚开始拖动触发
			this.beforedrag({
				target: this.$el,
				container: this.$container,
				placement: $util.getElementPoint(this.$el, this.$container)
			});
		})
		//鼠标移动
		document.body.on(`mousemove.drag_${this.guid}`,e=>{
			if (this.draggable) {
				let left = e.pageX - this.pageX;
				let top = e.pageY - this.pageY;
				if (this.draggableX) {
					this.$el.style.left = left + 'px';
				}
				if (this.draggableY) {
					this.$el.style.top = top + 'px';
				}
				this._resize();
				if (this.draggableX || this.draggableY) {
					//监听事件
					this.drag({
						target: this.$el,
						container: this.$container,
						placement: $util.getElementPoint(this.$el, this.$container)
					})
				}
			}
		})
		//鼠标松开后，拖拽状态更改为false，触发监听事件
		document.body.on(`mouseup.drag_${this.guid}`,e=>{
			if (this.draggable) {
				this.draggable = false;
				this.$el.style.cursor = ''
				//监听事件
				this.dragged({
					target: this.$el,
					container: this.$container,
					placement: $util.getElementPoint(this.$el, this.$container)
				})
			}
		})
	}

	//移除该指令绑定在body上的事件
	_setOff(){
		document.body.off(`mousemove.drag_${this.guid}  mouseup.drag_${this.guid}`)
	}
	
	//元素超出容器范围设置
	_resize(){
		if (this.mode == "in") {
			if (this.draggableX) {
				if ($util.getElementPoint(this.$el, this.$container).left <= 0) {
					this.$el.style.left = 0;
				}
				if ($util.getElementPoint(this.$el, this.$container).left >= this.$container.offsetWidth - this.$el.offsetWidth) {
					this.$el.style.left = this.$container.offsetWidth - this.$el.offsetWidth + 'px';
				}
			}
			if (this.draggableY) {
				if ($util.getElementPoint(this.$el, this.$container).top <= 0) {
					this.$el.style.top = 0;
				}
				if ($util.getElementPoint(this.$el, this.$container).top >= this.$container.offsetHeight - this.$el.offsetHeight) {
					this.$el.style.top = this.$container.offsetHeight - this.$el.offsetHeight + 'px';
				}
			}
		} else if (this.mode == "on") {
			if (this.draggableX) {
				if ($util.getElementPoint(this.$el, this.$container).left <= -this.$el.offsetWidth / 2) {
					this.$el.style.left = -this.$el.offsetWidth / 2 + "px";
				}
				if ($util.getElementPoint(this.$el, this.$container).left >= this.$container.offsetWidth - this.$el.offsetWidth /
					2) {
					this.$el.style.left = this.$container.offsetWidth - this.$el.offsetWidth / 2 + 'px';
				}
			}
			if (this.draggableY) {
				if ($util.getElementPoint(this.$el, this.$container).top <= -this.$el.offsetHeight / 2) {
					this.$el.style.top = -this.$el.offsetHeight / 2 + "px";
				}
				if ($util.getElementPoint(this.$el, this.$container).top >= this.$container.offsetHeight - this.$el.offsetHeight /
					2) {
					this.$el.style.top = this.$container.offsetHeight - this.$el.offsetHeight / 2 + 'px';
				}
			}
		} else if (this.mode == "out") {
			if (this.draggableX) {
				if ($util.getElementPoint(this.$el, this.$container).left <= -this.$el.offsetWidth) {
					this.$el.style.left = -this.$el.offsetWidth + "px";
				}
				if ($util.getElementPoint(this.$el, this.$container).left >= this.$container.offsetWidth) {
					this.$el.style.left = this.$container.offsetWidth + 'px';
				}
			}
			if (this.draggableY) {
				if ($util.getElementPoint(this.$el, this.$container).top <= -this.$el.offsetHeight) {
					this.$el.style.top = -this.$el.offsetHeight + "px";
				}
				if ($util.getElementPoint(this.$el, this.$container).top >= this.$container.offsetHeight) {
					this.$el.style.top = this.$container.offsetHeight + 'px';
				}
			}
		}
	}
	
	//生成唯一值
	_createGuid(){
		//获取当前guid，不存在则从0开始
		let guid = document.body.data('mvi-directives-drag-guid') || 0;
		guid++;
		document.body.data('mvi-directives-drag-guid',guid);
		return guid;
	}
	
	//移动元素到指定位置
	dragTo(left,top){
		return new Promise((resolve, reject)=>{
			this.beforedrag({
				target: this.$el,
				container: this.$container,
				placement: $util.getElementPoint(this.$el, this.$container)
			})
			if (this.draggableX) {
				this.$el.style.left = left + "px";
			}
			if (this.draggableY) {
				this.$el.style.top = top + "px";
			}
			this._resize();
			let options = {
				target: this.$el,
				container: this.$container,
				placement: $util.getElementPoint(this.$el, this.$container)
			};
			this.dragged(options);
			resolve(options);
		});
	}
}

export default Drag
