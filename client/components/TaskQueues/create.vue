<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">

            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="SELECT KEY">
                    <el-select v-model="form.task_queue_key">
                        <el-option label="SKILL" value="skills"></el-option>
                        <el-option label="LANGUAGE" value="languages"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="INPUT VALUE">
                    <el-input v-model="form.task_queue_val"></el-input>
                </el-form-item>
                <el-form-item label="RESERVATION ACTIVITY">
                    <el-select v-model="form.reservation_activity">
                        <el-option v-for="activity in activities_datas" v-bind:label="activity.friendlyName" v-bind:value="activity.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ASSIGNMENT ACTIVITY">
                    <el-select v-model="form.assignment_activity">
                        <el-option v-for="activity in activities_datas" v-bind:label="activity.friendlyName" v-bind:value="activity.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="MAX RESERVED WORKER">
                    <el-select v-model="form.max_reserved_worker">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                        <el-option label="6" value="6"></el-option>
                        <el-option label="7" value="7"></el-option>
                        <el-option label="8" value="8"></el-option>
                        <el-option label="9" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">Create</el-button>
                    <el-button @click="onCancel">Cancel</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>



<script>

    import axios from 'axios';
    import { Notification } from 'element-ui';
    export default {
        data() {
            return {
                title: 'タスクキュー追加画面',
                form: {
                    task_queue_key: '',
                    task_queue_val: '',
                    max_reserved_worker: '',
                },
                activities_datas: [],
            }
        },
        mounted() {
            this.getActivityList();
        },
        methods: {
            onSubmit() {
                axios.post("/api/twilio/taskqueues/create", JSON.stringify({
                        task_queue_key: this.form.task_queue_key,
                        task_queue_val: this.form.task_queue_val,
                        reservation_activity: this.form.reservation_activity,
                        assignment_activity: this.form.assignment_activity,
                        max_reserved_worker: this.form.max_reserved_worker,
                    }))
                    .then(response => {
                        if (response.data.status === 'OK') {
                            location.href = '/#/taskqueues';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "タスクキューを登録しました。"
                                }
                            );
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "タスクキューの登録に失敗しました"
                                }
                            );
                        }
                    });
            },
            onCancel() {
                location.href = '/#/taskqueues';
            },
            getActivityList: function () {
                axios.get("/api/twilio/activities")
                    .then(response => {
                        this.activities_datas = response.data;
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