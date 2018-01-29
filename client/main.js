import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import locale from 'element-ui/lib/locale/lang/ja'

Vue.use(ElementUI, {locale});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
