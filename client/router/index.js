import Vue from 'vue'
import Router from 'vue-router'
import SiteTop from '../components/SiteTop.vue'
import WorkersIndex from '../components/Workers/index.vue'
import MyTest2 from '../components/MyTest2.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'SiteTop',
            component: SiteTop
        },
        {
            path: '/workers',
            name: 'Workers',
            component: Workers
        },
        {
            path: '/workers/show',
            name: 'Workers',
            component: Workers
        },
        {
            path: '/test2',
            name: 'MyTest2',
            data: { message: 'weiweihogehoge' },
            component: MyTest2
        }
    ]
})
