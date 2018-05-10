<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            
            <el-table :data="activities" style="width: 100%">
                <el-table-column label="アクティビティ">
                    <template slot-scope="scope">
                        <span>{{ scope.row.friendlyName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="SID">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Availability">
                    <template slot-scope="scope">
                        <span>{{ scope.row.available }}</span>
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
                <el-button type="primary" @click="handleCreate()" size="mini">アクティビティを追加</el-button>
            </div>

        </div>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        name: 'Workers',
        data() {
            return {
                count: 0,
                value1: 50,
                title: 'アクティビティ管理画面',
                msg: 'Welcome to Your Vue.js App!!',
                activities: []
            }
        },
        mounted() {
            axios.get("/api/twilio/activities")
                .then(response => {
                    this.msg = response.data[0].friendlyName
                    this.activities = response.data;
                });
        },
        methods: {
            handleCreate: function () {
                location.href = '/#/activities/create';
            },
            handleShow: function (index, row_data) {
                location.href = '/#/activities/'+row_data.sid+'/show';
            },
            handleEdit: function (index, row_data) {
                location.href = '/#/activities/'+row_data.sid+'/edit';
            },
            handleDelete: function (index, row_data) {
                axios.delete("/api/twilio/activities/"+row_data.sid)
                    .then(response => {
                        if (response.data.status === 'OK') {
                            location.href = '/#/activities';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "アクティビティを削除しました。"
                                }
                            );
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "アクティビティの削除に失敗しました"
                                }
                            );
                        }
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