import Vue from 'vue'
import Router from 'vue-router'
import SiteTop from '../components/SiteTop.vue'
import WorkersIndex from '../components/Workers/index.vue'
import WorkersCreate from '../components/Workers/create.vue'
import WorkersEdit from '../components/Workers/edit.vue'
import MyTest2 from '../components/SiteTop.vue'
import IvrIndex from '../components/Ivrs/index.vue'
import WorkflowIndex from '../components/Workflows/index.vue'
import WorkflowCreate from '../components/Workflows/create.vue'
import WorkflowEdit from '../components/Workflows/edit.vue'
import TaskQueueIndex from '../components/TaskQueues/index.vue'
import TaskQueueCreate from '../components/TaskQueues/create.vue'
import TaskQueueEdit from '../components/TaskQueues/edit.vue'
import ActivitiesIndex from '../components/Activities/index.vue'
import ActivitiesCreate from '../components/Activities/create.vue'
import ActivitiesEdit from '../components/Activities/edit.vue'
import OperatorsShow from '../components/Operators/show.vue'
import SVMonitor from '../components/SuperVisors/monitor.vue'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'SiteTop', component: SiteTop },
        { path: '/ivrs', name: 'IvrIndex', component: IvrIndex },
        { path: '/workers', name: 'Workers', component: WorkersIndex },
        { path: '/workers/create', name: 'WorkersCreate', component: WorkersCreate },
        { path: '/workers/:sid/edit', name: 'WorkersEdit', component: WorkersEdit },
        { path: '/workflows', name: 'WorkflowIndex', component: WorkflowIndex },
        { path: '/workflows/create', name: 'WorkflowCreate', component: WorkflowCreate },
        { path: '/workflows/:sid/edit', name: 'WorkflowEdit', component: WorkflowEdit },
        { path: '/taskqueues', name: 'TaskQueueIndex', component: TaskQueueIndex },
        { path: '/taskqueues/create', name: 'TaskQueueCreate', component: TaskQueueCreate },
        { path: '/taskqueues/:sid/edit', name: 'TaskQueueEdit', component: TaskQueueEdit },
        { path: '/activities', name: 'ActivitiesIndex', component: ActivitiesIndex },
        { path: '/activities/create', name: 'ActivitiesCreate', component: ActivitiesCreate },
        { path: '/activities/:sid/edit', name: 'ActivitiesEdit', component: ActivitiesEdit },
        { path: '/operators/:sid/show', name: 'OperatorsShow', component: OperatorsShow },
        { path: '/sv/monitor', name: 'SVMonitor', component: SVMonitor },
        { path: '/test2', name: 'MyTest2', data: { message: 'weiweihogehoge' }, component: MyTest2 }
    ]
})
