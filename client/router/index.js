import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import MyTest from '../components/MyTest.vue'
import MyTest2 from '../components/MyTest2.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/test',
            name: 'MyTest',
            data: { message: 'weiweihogehoge' },
            component: MyTest
        },
        {
            path: '/',
            name: 'HelloWorld',
            data: { message: 'weiweihogehoge' },
            component: HelloWorld
        },
        {
            path: '/test2',
            name: 'MyTest2',
            data: { message: 'weiweihogehoge' },
            component: MyTest2
        }
    ]
})
