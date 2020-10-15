import Vue from "vue";
import './plugins/axios'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from './plugins/vuetify';

import ProcessWriter from './plugins/processWriter';

Vue.config.productionTip = false;

Vue.use(ProcessWriter);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
