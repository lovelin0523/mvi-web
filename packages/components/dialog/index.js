import $util from "../../util/util"
import dialogComponent from "./dialog"

const Dialog = {};

Dialog.install = function(Vue){
	// 生成一个Vue的子类
	const DialogConstructor = Vue.extend(dialogComponent)
	
	//提示框
	Vue.prototype.$alert = (options,callback) => {
		// 生成一个该子类的实例
		const instance = new DialogConstructor();
		if($util.isObject(options)){
			instance.title = options.title;
			instance.message = options.message;
			instance.btnText = options.btnText;
			instance.btnColor = options.btnColor;
			instance.width = options.width;
			instance.zIndex = options.zIndex;
			instance.callback = options.callback;
			instance.animation = options.animation;
			instance.local = options.local;
			instance.usePadding = options.usePadding;
			instance.radius = options.radius;
			instance.timeout = options.timeout;
			instance.overlayColor = options.overlayColor;
		}else if(typeof(options) == "string"){
			instance.message = options;
			instance.callback = callback;
		}
		instance.type = "alert";
		// 挂载该实例
		instance.$mount();
		//如果实例元素没有添加到页面，则进行添加
		if(!$util.isContains(document.body,instance.$el)){
			if(typeof(options.local) == 'string' && options.local){
				var el = document.body.querySelector(options.local);
				if(el){
					el.appendChild(instance.$el);
				}else{
					document.body.appendChild(instance.$el)
				}
			}else if($util.isElement(options.local)){
				options.local.appendChild(instance.$el)
			}else{
				document.body.appendChild(instance.$el)
			}
		}
	}
	
	//确认框
	Vue.prototype.$confirm = (options,callback) => {
		// 生成一个该子类的实例
		const instance = new DialogConstructor();
		if($util.isObject(options)){
			instance.title = options.title;
			instance.message = options.message;
			instance.btnText = options.btnText;
			instance.btnColor = options.btnColor;
			instance.width = options.width;
			instance.zIndex = options.zIndex;
			instance.callback = options.callback;
			instance.animation = options.animation;
			instance.local = options.local;
			instance.usePadding = options.usePadding;
			instance.radius = options.radius;
			instance.timeout = options.timeout;
			instance.overlayColor = options.overlayColor;
		}else if(typeof(options) == "string"){
			instance.message = options;
			instance.callback = callback;
		}
		instance.type = "confirm";
		// 挂载该实例
		instance.$mount();
		//如果实例元素没有添加到页面，则进行添加
		if(!$util.isContains(document.body,instance.$el)){
			if(typeof(options.local) == 'string' && options.local){
				var el = document.body.querySelector(options.local);
				if(el){
					el.appendChild(instance.$el);
				}else{
					document.body.appendChild(instance.$el)
				}
			}else if($util.isElement(options.local)){
				options.local.appendChild(instance.$el)
			}else{
				document.body.appendChild(instance.$el)
			}
		}
	}
	
	//信息输入框
	Vue.prototype.$prompt = (options,callback) => {
		// 生成一个该子类的实例
		const instance = new DialogConstructor();
		if($util.isObject(options)){
			instance.title = options.title;
			instance.message = options.message;
			instance.btnText = options.btnText;
			instance.btnColor = options.btnColor;
			instance.width = options.width;
			instance.zIndex = options.zIndex;
			instance.callback = options.callback;
			instance.input.value = options.value;
			instance.input.type = options.type;
			instance.input.placeholder = options.placeholder;
			instance.input.maxlength = options.maxlength;
			instance.input.autofocus = options.autofocus;
			instance.input.clearable = options.clearable;
			instance.animation = options.animation;
			instance.local = options.local;
			instance.usePadding = options.usePadding;
			instance.radius = options.radius;
			instance.timeout = options.timeout;
			instance.overlayColor = options.overlayColor;
		}else if(typeof(options) == "string"){
			instance.message = options,
			instance.callback = callback;
		}
		instance.type = "prompt";
		// 挂载该实例
		instance.$mount();
		//如果实例元素没有添加到页面，则进行添加
		if(!$util.isContains(document.body,instance.$el)){
			if(typeof(options.local) == 'string' && options.local){
				var el = document.body.querySelector(options.local);
				if(el){
					el.appendChild(instance.$el);
				}else{
					document.body.appendChild(instance.$el)
				}
			}else if($util.isElement(options.local)){
				options.local.appendChild(instance.$el)
			}else{
				document.body.appendChild(instance.$el)
			}
		}
	}
}

export default Dialog