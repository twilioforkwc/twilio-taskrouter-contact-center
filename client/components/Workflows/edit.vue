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
                <el-form-item label="属性">
                    <el-input type="textarea" v-model="form.configuration" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">Update</el-button>
                    <router-link to="/workflows"><el-button>Cancel</el-button></router-link>
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
                    activity: '',
                    skills: [],
                    languages: [],
                    attributes: ''
                }
            }
        },
        mounted() {
            console.log(this.$route.params.sid);
            axios.get("/api/twilio/workflows/show/" + this.$route.params.sid)
                .then(response => {
                    console.log(response.data.status);
                    if (response.data.status === 'OK') {
                        this.form.name = response.data.friendlyName;
                        this.form.sid = response.data.sid;
                        this.form.assignmentCallbackUrl = response.data.assignmentCallbackUrl;
                        this.form.fallbackAssignmentCallbackUrl = response.data.fallbackAssignmentCallbackUrl;
                        this.form.taskReservationTimeout = response.data.taskReservationTimeout;
                        this.form.configuration = response.data.configuration;
                        this.form.dateCreated = response.data.dateCreated;
                        this.form.dateUpdated = response.data.dateUpdated;
                    } else {
                        console.log('ワークフロー情報の取得に失敗しました');
                        Notification.error(
                            {
                                title: "Error",
                                message: "ワークフロー情報の取得に失敗しました"
                            }
                        );
                    }
                });
        },
        methods: {
            onSubmit() {
                axios.put("/api/twilio/workflows/update", JSON.stringify({
                        sid: this.$route.params.sid,
                        friendlyName: this.form.name,
                        assignmentCallbackUrl: this.form.assignmentCallbackUrl,
                        fallbackAssignmentCallbackUrl: this.form.fallbackAssignmentCallbackUrl,
                        taskReservationTimeout: this.form.taskReservationTimeout,
                    }))
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            console.log('ワークフローの更新に成功しました');
                            location.href = '/#/workflows';
                        } else {
                            console.log('ワークフローの更新に失敗しました');
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワークフローの登録に失敗しました"
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
    .el-form-item__content {
        text-align: left;
    }
</style>