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
                title: 'タスクキュー追加画面',
                form: {
                    task_queue_key: '',
                    task_queue_val: '',
                    max_reserved_worker: '',
                }
            }
        },
        mounted() {
            console.log(this.$route.params.sid);
            axios.get("/api/twilio/taskqueues/show/"+this.$route.params.sid)
                .then(response => {
                    if (response.data.status === 'OK') {
                        var split_data = response.data.friendlyName.split('-');
                        this.form.task_queue_key = split_data[0];
                        this.form.task_queue_val = split_data[1];
                        this.form.max_reserved_worker = response.data.maxReservedWorkers;
                        // this.form.attributes = response.data.attributes;
                    } else {
                        console.log('タスクキュー情報の取得に失敗しました');
                        Notification.error(
                            {
                                title: "Error",
                                message: "タスクキュー情報の取得に失敗しました"
                            }
                        );
                    }
                });
        },
        methods: {
            onSubmit() {
                axios.put("/api/twilio/taskqueues/update", JSON.stringify({
                        sid: this.$route.params.sid,
                        task_queue_key: this.form.task_queue_key,
                        task_queue_val: this.form.task_queue_val,
                        max_reserved_worker: this.form.max_reserved_worker,
                    }))
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            console.log('タスクキューを更新しました。');
                            location.href = '/#/taskqueues';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "タスクキューを更新しました。"
                                }
                            );
                        } else {
                            console.log('タスクキューの更新に失敗しました');
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "タスクキューの更新に失敗しました"
                                }
                            );
                        }
                    });
            },
            onCancel() {
                location.href = '/#/taskqueues';
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