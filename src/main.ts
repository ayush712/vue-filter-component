import Vue from 'vue';
import App from './App.vue';
import buefy from 'buefy';
declare module 'vee-validate';
import 'buefy/dist/buefy.css';
Vue.config.productionTip = false;
Vue.use(buefy);
new Vue({
    render: (h) => h(App),
}).$mount('#app');
