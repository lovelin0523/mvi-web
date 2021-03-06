import $util from "../../util/util"
import Spy from "./spy"

Spy.install = Vue=>{
	//滚动侦听
	Vue.directive('spy', {
		inserted(el, binding) {
			let options = {};
			if($util.isObject(binding.value)){
				Object.assign(options,binding.value);
			}
			let spy = new Spy(el,options);
			spy.init();
			//将对象记录在元素里
			el.data('directive:spy',spy)
		},
		unbind(el, binding){
			//获取对象
			let spy = el.data('directive:spy')
			if(spy){
				//移除容器队列监听的滚动事件
				spy._setOff();
			}
		}
	})
}

export default Spy