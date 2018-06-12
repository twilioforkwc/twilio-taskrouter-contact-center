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
                <el-form-item label="TASK RESERVATION TIMEOUT">
                    <el-input v-model="form.taskReservationTimeout"></el-input>
                </el-form-item>
                <template>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="Edit with UI" name="first">
                            <template>
                                <el-row :gutter="20" type="flex" class="row-bg" justify="space-between">
                                    <el-col :span="12">
                                        <div class="grid-content">
                                            <el-form-item label="フィルターラベル">
                                                <el-input v-model="form.filter_friendly_name"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="grid-content">
                                            <el-form-item label="キューの選択">
                                                <el-select v-model="form.task_queue_sid">
                                                    <el-option v-for="task_queue in task_queue_datas"
                                                               v-bind:label="task_queue.friendlyName"
                                                               v-bind:value="task_queue.sid">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" type="flex" class="row-bg" justify="space-between">
                                    <el-col :span="24">
                                        <div class="grid-content">
                                            <el-form-item label="Configuration">
                                                <el-input v-model="form.expression" type="textarea" :rows="6" :value="form.expression"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>
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
                    task_queue_sid: '',
                    assignmentCallbackUrl: '',
                    fallbackAssignmentCallbackUrl: '',
                    taskReservationTimeout: '',
                    configuration: '',
                    expression: '',
                    dateCreated: '',
                    dateUpdated: '',
                },
                task_queue_datas: [],
                activeName: 'first',
            }
        },
        mounted() {
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
                        filterFriendlyName: this.form.filter_friendly_name,
                        startTime: this.form.start_time,
                        endTime: this.form.end_time,
                        selectedLanguage: this.form.selected_language,
                        selectedSkill: this.form.selected_skill,
                        expression: encodeURIComponent(this.form.expression),
                    }))
                    .then(response => {
                        // console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            location.href = '/#/workflows';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "ワークフローを更新しました。"
                                }
                            );
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワークフローの更新に失敗しました。\n"
                                            +"Error："+response.data.message
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
                        if (response.data.status === 'OK') {
                            var filter = response.data.filters[0];
                            this.form.name = response.data.friendlyName;
                            this.form.sid = response.data.sid;
                            this.form.assignmentCallbackUrl = response.data.assignmentCallbackUrl;
                            this.form.fallbackAssignmentCallbackUrl = response.data.fallbackAssignmentCallbackUrl;
                            this.form.taskReservationTimeout = response.data.taskReservationTimeout;
                            this.form.configuration = JSON.stringify(JSON.parse(response.data.configuration), null, "    ").replace(/'\n'/g, '');
                            this.form.dateCreated = response.data.dateCreated;
                            this.form.dateUpdated = response.data.dateUpdated;
                            this.form.filter_friendly_name = filter.filter_friendly_name;
                            this.form.task_queue_sid = filter.targets[0].queue;
                            this.form.expression = filter.expression;
                        } else {
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
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }
    .el-select {
        width: 100%;
    }
    pre {
        white-space: pre-wrap ;
    }
</style>