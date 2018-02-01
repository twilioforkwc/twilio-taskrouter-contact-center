import Vue from 'vue'
import Router from 'vue-router'
import SiteTop from '../components/SiteTop.vue'
import WorkersIndex from '../components/Workers/index.vue'
import WorkersCreate from '../components/Workers/create.vue'
import WorkersShow from '../components/Workers/show.vue'
import MyTest2 from '../components/SiteTop.vue'

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
            component: WorkersIndex
        },
        {
            path: '/workers/create',
            name: 'WorkersCreate',
            component: WorkersCreate
        },
        {
            path: '/workers/show',
            name: 'WorkersShow',
            component: WorkersShow
        },
        {
            path: '/test2',
            name: 'MyTest2',
            data: { message: 'weiweihogehoge' },
            component: MyTest2
        }
    ]
})
