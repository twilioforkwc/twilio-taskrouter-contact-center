import Vue from 'vue'
import Router from 'vue-router'
import SiteTop from '../components/SiteTop.vue'
import WorkersIndex from '../components/Workers/index.vue'
import WorkersCreate from '../components/Workers/create.vue'
import WorkersShow from '../components/Workers/show.vue'
import WorkersEdit from '../components/Workers/edit.vue'
import MyTest2 from '../components/SiteTop.vue'
import IvrIndex from '../components/Ivrs/index.vue'
import WorkflowIndex from '../components/Workflows/index.vue'
import WorkflowCreate from '../components/Workflows/create.vue'
import WorkflowShow from '../components/Workflows/show.vue'
import WorkflowEdit from '../components/Workflows/edit.vue'
import TaskQueueIndex from '../components/TaskQueues/index.vue'
import TaskQueueCreate from '../components/TaskQueues/create.vue'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'SiteTop', component: SiteTop },
        { path: '/ivrs', name: 'IvrIndex', component: IvrIndex },
        { path: '/workers', name: 'Workers', component: WorkersIndex },
        { path: '/workers/create', name: 'WorkersCreate', component: WorkersCreate },
        { path: '/workers/:sid/show', name: 'WorkersShow', component: WorkersShow },
        { path: '/workers/:sid/edit', name: 'WorkersEdit', component: WorkersEdit },
        { path: '/workflows', name: 'WorkflowIndex', component: WorkflowIndex },
        { path: '/workflows/create', name: 'WorkflowCreate', component: WorkflowCreate },
        { path: '/workfloks/:sid/show', name: 'WorkflowShow', component: WorkflowShow },
        { path: '/workflows/:sid/edit', name: 'WorkflowEdit', component: WorkflowEdit },
        { path: '/taskqueues', name: 'TaskQueueIndex', component: TaskQueueIndex },
        { path: '/taskqueues/create', name: 'TaskQueueCreate', component: TaskQueueCreate },
        { path: '/test2', name: 'MyTest2', data: { message: 'weiweihogehoge' }, component: MyTest2 }
    ]
})
