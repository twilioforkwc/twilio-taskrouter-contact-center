<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            
            <el-table :data="task_queue_datas" style="width: 100%">
                <el-table-column label="タスクキュー">
                    <template slot-scope="scope">
                        <span>{{ scope.row.friendlyName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="TOTALTASK">
                    <template slot-scope="scope">
                        <span>0</span>
                    </template>
                </el-table-column>
                <el-table-column label="MAX RESERVE WORKERS">
                    <template slot-scope="scope">
                        <span>{{ scope.row.maxReservedWorkers }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="TARGET WORKER EXPRESSION">
                    <template slot-scope="scope">
                        <span>{{ scope.row.targetWorkers }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" @click="handleCreate()" size="mini"><i class="el-icon-plus"></i></el-button>
            </div>

        </div>
    </div>
</template>

<script>

    import axios from 'axios';
    import { Notification } from 'element-ui';
    export default {
        name: 'Workers',
        data() {
            return {
                count: 0,
                value1: 50,
                title: 'タスクキュー',
                task_queue_datas: []
            }
        },
        mounted() {
            this.getListData();
        },
        methods: {
            handleCreate: function () {
                location.href = '/#/taskqueues/create';
            },
            handleShow: function (index, row_data) {
                location.href = '/#/taskqueues/'+row_data.sid+'/show';
            },
            handleEdit: function (index, row_data) {
                location.href = '/#/taskqueues/'+row_data.sid+'/edit';
            },
            handleDelete: function (index, row_data) {
                axios.delete("/api/twilio/taskqueues/"+row_data.sid)
                    .then(response => {
                        if (response.data.status === 'OK') {
                            this.getListData();
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "タスクキューを削除しました。"
                                }
                            );
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "タスクキューの削除に失敗しました"
                                }
                            );
                        }
                    });
            },
            getListData: function () {
                axios.get("/api/twilio/taskqueues")
                    .then(response => {
                        this.task_queue_datas = response.data;
                    });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1,
    h2 {
        font-weight: normal;
    }

    a {
        color: #42b983;
    }

    el-table-column:first-child {
        text-align: center;
    }

</style>