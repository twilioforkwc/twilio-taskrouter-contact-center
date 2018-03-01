<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">

            <el-form ref="form" :model="form">
                <el-form-item label="わかりやすい名前">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="CALLBACKURL">
                    <el-input v-model="form.assignmentCallbackUrl"></el-input>
                </el-form-item>
                <el-form-item label="フォールバックURL">
                    <el-input v-model="form.fallbackAssignmentCallbackUrl"></el-input>
                </el-form-item>
                <el-form-item label="TASKRESERVATIONTIMEOUT">
                    <el-input v-model="form.taskReservationTimeout"></el-input>
                </el-form-item>
                <template>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="Edit with UI" name="first">
                            <!-- <el-form-item label="タスクキューの選択">
                                <el-input type="textarea" v-model="form.configuration" disabled></el-input>
                            </el-form-item> -->
                            <template>
                                <el-form-item label="フィルターラベル">
                                    <el-input v-model="form.filter_label"></el-input>
                                </el-form-item>
                                <el-form-item label="キューの選択">
                                    <el-select v-model="form.task_queue_sid">
                                        <el-option v-for="task_queue in task_queue_datas" v-bind:label="task_queue.friendlyName" v-bind:value="task_queue.sid"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="始業時間">
                                    <el-time-select v-model="form.start_time" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }" placeholder="Select time"> </el-time-select>
                                </el-form-item>
                                <el-form-item label="終業時間">
                                    <el-time-select v-model="form.end_time" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }" placeholder="Select time"> </el-time-select>
                                </el-form-item>
                                <el-form-item label="言語の選択">
                                    <el-select v-model="form.selected_language" multiple>
                                        <el-option v-for="task_queue in task_queue_datas" v-if="checkKey(task_queue.friendlyName, 'languages')" v-bind:label="getKey(task_queue.friendlyName)" v-bind:value="getKey(task_queue.friendlyName)"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="スキルの選択">
                                    <el-select v-model="form.selected_skill" multiple>
                                        <el-option v-for="task_queue in task_queue_datas" v-if="checkKey(task_queue.friendlyName, 'skills')" v-bind:label="getKey(task_queue.friendlyName)" v-bind:value="getKey(task_queue.friendlyName)"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="View as JSON" name="second">
                            <pre>
                                {{ form.configuration }}
                            </pre>
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">Update</el-button>
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
                title: 'ワークフロー編集画面',
                form: {
                    name: '',
                    sid: '',
                    assignmentCallbackUrl: '',
                    fallbackAssignmentCallbackUrl: '',
                    taskReservationTimeout: '',
                    configuration: '',
                    dateCreated: '',
                    dateUpdated: '',
                },
                task_queue_datas: [],
                activeName: 'first',
            }
        },
        mounted() {
            // console.log(this.$route.params.sid);
            this.getWorkflowData();
            this.getTaskQueuesList();
        },
        methods: {
            onSubmit() {
                axios.put("/api/twilio/workflows/update", JSON.stringify({
                        sid: this.$route.params.sid,
                        friendlyName: this.form.name,
                        assignmentCallbackUrl: this.form.assignmentCallbackUrl,
                        fallbackAssignmentCallbackUrl: this.form.fallbackAssignmentCallbackUrl,
                        taskReservationTimeout: this.form.taskReservationTimeout,
                        task_queue_sid: this.form.task_queue_sid,
                        filterLabel: this.form.task_queue_sid,
                        startTime: this.form.start_time,
                        endTime: this.form.end_time,
                        selectedLanguage: this.form.selected_language,
                        selectedSkill: this.form.selected_skill,
                    }))
                    .then(response => {
                        // console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            // console.log('ワークフローの更新に成功しました');
                            location.href = '/#/workflows';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "ワークフローを更新しました。"
                                }
                            );
                        } else {
                            // console.log('ワークフローの更新に失敗しました');
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワークフローの登録に失敗しました"
                                }
                            );
                        }
                    });
            },
            onCancel() {
                location.href = '/#/workflows';
            },
            getWorkflowData: function () {
                axios.get("/api/twilio/workflows/show/" + this.$route.params.sid)
                    .then(response => {
                        // console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            this.form.name = response.data.friendlyName;
                            this.form.sid = response.data.sid;
                            this.form.assignmentCallbackUrl = response.data.assignmentCallbackUrl;
                            this.form.fallbackAssignmentCallbackUrl = response.data.fallbackAssignmentCallbackUrl;
                            this.form.taskReservationTimeout = response.data.taskReservationTimeout;
                            this.form.configuration = JSON.stringify(response.data.configuration, null, "    ");
                            this.form.dateCreated = response.data.dateCreated;
                            this.form.dateUpdated = response.data.dateUpdated;
                        } else {
                            // console.log('ワークフロー情報の取得に失敗しました');
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワークフロー情報の取得に失敗しました"
                                }
                            );
                        }
                    });
            },
            getTaskQueuesList: function () {
                axios.get("/api/twilio/taskqueues")
                    .then(response => {
                        this.task_queue_datas = response.data;
                    });
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            getKey: function (data) {
                return data.split('-')[1];
            },
            checkKey: function (data, key) {
                if(data.split('-')[0] == key){
                    return true;
                }
                return false;
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
    .el-form-item__content {
        text-align: left;
    }
</style>