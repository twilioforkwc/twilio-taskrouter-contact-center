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
                <el-form-item label="属性">
                    <el-input type="textarea" v-model="form.attributes" disabled></el-input>
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

    var vueObj;

    export default {
        data() {
            return {
                title: 'オペーレーター編集画面',
                activities: [],
                languages: [],
                skills: [],
                form: {
                    name: '',
                    activity: '',
                    skills: [],
                    languages: [],
                    attributes: []
                }
            }
        },
        mounted() {
            vueObj = this;
            this.getLanguages();
            this.getSkills();
            this.getActivities();
            this.getWorkerInfo();
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
            getWorkerInfo() {
                axios.get("/api/twilio/workers/show/" + this.$route.params.sid)
                    .then(response => {
                        if (response.data.status === 'OK') {
                            this.form.name = response.data.friendlyName;
                            this.form.activity = response.data.activityName;
                            this.form.skills = JSON.parse(response.data.attributes).technical_skill;
                            this.form.languages = JSON.parse(response.data.attributes).languages;
                            this.form.attributes = response.data.attributes;
                        } else {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "ワーカー情報の取得に失敗しました"
                                }
                            );
                        }
                    });
            },
            getActivities() {
                axios.get("/api/twilio/activities")
                    .then(response => {
                        this.activities = response.data;
                        this.activities.forEach(element => {
                            if(element.friendlyName == vueObj.form.activity){
                                vueObj.form.activity = element.sid;
                            }
                        });
                    });
            },
            onSubmit() {
                axios.put("/api/twilio/workers/update", JSON.stringify({
                        sid: this.$route.params.sid,
                        name: this.form.name,
                        activity: this.form.activity,
                        skills: this.form.skills,
                        languages: this.form.languages,
                    }))
                    .then(response => {
                        if (response.data.status === 'OK') {
                            location.href = '/#/workers';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "ワーカーを更新しました。"
                                }
                            );
                        } else {
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
    .el-form-item__content {
        text-align: left;
    }
</style>