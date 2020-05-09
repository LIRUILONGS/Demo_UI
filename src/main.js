import Vue from 'vue'
import App from './App.vue'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css';
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import 'font-awesome/css/font-awesome.min.css'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import VueParticles from 'vue-particles'
import store from "./vuex/store"
import router from './router'
import ElementUI from 'element-ui'

let options = {
    fullscreenEl: false
};
Vue.use(preview, options)
Vue.use(preview)
Vue.use(VCharts)
Vue.use(GeminiScrollbar)
Vue.use(VCharts)
Vue.use(VueParticles)
Vue.use(ElementUI);
Vue.config.productionTip = false

import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

router.beforeEach((to, from, next) => {
        if (to.path == '/') {
            next();
        } else {
            if (window.sessionStorage.getItem("user")) {

                next();
            }
        }
    }
)

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
