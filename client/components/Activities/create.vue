<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">

            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="ACTIVITY NAME">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="AVAILABLE">
                    <el-select v-model="form.available">
                        <el-option label="TRUE" value="true"></el-option>
                        <el-option label="FALSE" value="false"></el-option>
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
                title: 'アクティビティ追加画面',
                form: {
                    name: '',
                    available: '',
                }
            }
        },
        methods: {
            onSubmit() {
                axios.post("/api/twilio/activities/create", JSON.stringify({
                        name: this.form.name,
                        activity: this.form.activity,
                        skills: this.form.skills,
                        languages: this.form.languages,
                    }))
                    .then(response => {
                        if (response.data.status === 'OK') {
                            location.href = '/#/activities';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "アクティビティを登録しました。"
                                }
                            );
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "アクティビティの登録に失敗しました"
                                }
                            );
                        }
                    });
            },
            onCancel() {
                location.href = '/#/activities';
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