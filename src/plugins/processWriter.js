import PWCanvas from '@/components/PWCanvasPlugin';
import "es6-promise/auto";

export default {
	install(Vue) {
		Vue.use(PWCanvas);
	}
}