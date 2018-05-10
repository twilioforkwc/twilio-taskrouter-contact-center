<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            
            <el-table :data="operators" style="width: 100%">
                <el-table-column label="WORKFLOW">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.friendlyName }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="SID">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="TASKRESERVATIONTIMEOUT">
                    <template slot-scope="scope">

                        <span>{{ scope.row.taskReservationTimeout }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="ASSIGNMENTCALLBACKURL">
                    <template slot-scope="scope">
                        <span>{{ scope.row.assignmentCallbackUrl }}</span>
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
                <el-button size="mini" type="primary" @click="handleCreate()"><i class="el-icon-plus"></i></el-button>
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
                title: 'ワークフロー',
                operators: []
            }
        },
        mounted() {
            axios.get("/api/twilio/workflows")
                .then(response => {
                    console.log(response.data[0]);
                    this.operators = response.data;
                });
        },
        methods: {
            handleCreate: function () {
                location.href = '/#/workflows/create';
            },
            handleShow: function (index, row_data) {
                location.href = '/#/workflows/'+row_data.sid+'/show';
            },
            handleEdit: function (index, row_data) {
                location.href = '/#/workflows/'+row_data.sid+'/edit';
            },
            handleDelete: function (index, row_data) {
                axios.delete("/api/twilio/workflows/"+row_data.sid)
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            location.href = '/#/workflows';
                        } else {
                            console.log('NGNGNGNGNGGN');
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