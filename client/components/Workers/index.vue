<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            
            <el-table :data="operators" style="width: 100%">
                <el-table-column label="登録日" width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.dateCreated }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="氏名" width="180">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>Name: {{ scope.row.friendlyName }}</p>
                            <p>Sid: {{ scope.row.sid }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.friendlyName }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="アクティビティ" width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.activityName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleShow(scope.$index, scope.row)">Show</el-button>
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" @click="handleCreate()">オペーレーターを追加</el-button>
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
                title: 'オペーレーター管理画面',
                msg: 'Welcome to Your Vue.js App!!',
                operators: []
            }
        },
        mounted() {
            axios.get("/api/twilio/workers")
                .then(response => {
                    console.log(response.data[0]);
                    this.msg = response.data[0].friendlyName
                    this.operators = response.data;
                });
        },
        methods: {
            handleCreate: function () {
                location.href = '/#/workers/create';
            },
            handleShow: function (index, row_data) {
                location.href = '/#/workers/show';
            },
            handleEdit: function (index, row_data) {
                location.href = '/#/workers/show';
            },
            handleDelete: function (index, row_data) {
                // location.href = '/#/workers/show';
                axios.get("/api/twilio/workers/"+row_data.sid+"/delete")
                    .then(response => {
                        location.href = '/#/workers';
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