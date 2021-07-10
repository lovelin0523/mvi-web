import $util from "../../util/util"
import Resize from "./resize"

Resize.install = Vue=> {
	//拖拽改变大小
	Vue.directive('resize', {
		inserted(el, binding, vnode) {
			let options = {};
			if ($util.isObject(binding.value)) {
				Object.assign(options, binding.value);
			}
			if ($util.isObject(binding.modifiers)) {
				Object.assign(options, binding.modifiers);
			}
			let resize = new Resize(el, options);
			resize.init();
			//将对象记录在元素里
			el.data('directive:resize',resize)
		},
		unbind(el,binding,vnode){
			//获取对象
			let resize = el.data('directive:resize')
			if(resize){
				//移除绑定在body上的事件
				resize._setOff();
			}
		}
	})
}


export default Resize