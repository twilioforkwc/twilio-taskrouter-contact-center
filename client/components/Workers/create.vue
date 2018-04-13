<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">

            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="氏名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="ACTIVITY">
                    <el-select v-model="form.activity">
                        <el-option v-for="activity in activities" :label="activity.friendlyName" :value="activity.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="LANGUAGES">
                    <el-select v-model="form.languages" multiple>
                        <el-option v-for="language in languages" :label="language.name" :value="language.identifer"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SKILLS">
                    <el-select v-model="form.skills" multiple>
                        <el-option v-for="skill in skills" :label="skill.name" :value="skill.identifer"></el-option>
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

    var vueObj;

    export default {
        data() {
            return {
                title: 'オペーレーター追加画面',
                activities: [],
                languages: [],
                skills: [],
                form: {
                    name: '',
                    activity: '',
                    skills: '',
                    languages: '',
                    attributes: ''
                }
            }
        },
        mounted() {
            vueObj = this;
            this.getLanguages();
            this.getSkills();
            this.getActivities();
        },
        methods: {
            getLanguages: function () {
                axios.get("/api/db/files/languages")
                    .then(response => {
                        this.languages = response.data.result;
                    });
            },
            getSkills: function () {
                axios.get("/api/db/files/skills")
                    .then(response => {
                        this.skills = response.data.result;
                    });
            },
            getActivities() {
                axios.get("/api/twilio/activities")
                    .then(response => {
                        console.log(response.data);
                        this.activities = response.data;
                        this.activities.forEach(element => {
                            if(element.friendlyName == vueObj.form.activity){
                                vueObj.form.activity = element.sid;
                            }
                        });
                    });
            },
            onSubmit() {
                axios.post("/api/twilio/workers/create", JSON.stringify({
                        name: this.form.name,
                        activity: this.form.activity,
                        skills: this.form.skills,
                        languages: this.form.languages,
                    }))
                    .then(response => {
                        if (response.data.status === 'OK') {
                            console.log('ワーカーの登録に成功しました');
                            location.href = '/#/workers';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "ワーカーを登録しました。"
                                }
                            );
                        } else {
                            console.log('ワーカーの登録に失敗しました');
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワーカーの登録に失敗しました"
                                }
                            );
                        }
                    });
            },
            onCancel() {
                location.href = '/#/workers';
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