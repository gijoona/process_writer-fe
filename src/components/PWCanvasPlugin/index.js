import PWCanvas from './PWCanvas.vue';

const PWCanvasStore = {
	showPWCanvas: false,
	pwNodes: [],
	displayPWCanvas(val) {
		this.showPWCanvas = val;
	}
}

const PWCanvasPlugin = {
	install(Vue) {
		let app = new Vue({
			data: {
				pwcanvasStore: PWCanvasStore
			}
		});

		Vue.prototype.$pwcanvas = app.pwcanvasStore;
		Vue.component('pw-canvas', PWCanvas);
	}
};

export default PWCanvasPlugin;