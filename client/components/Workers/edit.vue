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
                        <el-option label="OFFLINE" value="offline"></el-option>
                        <el-option label="IDLE" value="idle"></el-option>
                        <el-option label="BUSY" value="busy"></el-option>
                        <el-option label="RESERVED" value="reserved"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="LANGUAGES">
                    <el-select v-model="form.languages" multiple>
                        <el-option label="JAPANESE" value="jp"></el-option>
                        <el-option label="ENGLISH" value="en"></el-option>
                        <el-option label="SPANISH" value="es"></el-option>
                        <el-option label="CHINESE" value="ch"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SKILLS">
                    <el-select v-model="form.skills" multiple>
                        <el-option label="C#" value="csharp"></el-option>
                        <el-option label="CURL" value="curl"></el-option>
                        <el-option label="JAVA" value="java"></el-option>
                        <el-option label="NODE.JS" value="nodejs"></el-option>
                        <el-option label="PHP" value="php"></el-option>
                        <el-option label="PYTHON" value="python"></el-option>
                        <el-option label="RUBY" value="ruby"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性">
                    <!-- <el-popover trigger="hover" placement="top">
                        <p>Attributes model each Worker's unique properties as a JSON document. TaskQueues route Tasks to Workers
                            based on these attributes. Example: {"name": "Alice", "technical_skill": 5, "languages": ["ru",
                            "en"]}</p>
                    </el-popover> -->
                    <el-input type="textarea" v-model="form.attributes" disabled></el-input>
                    <!-- <div slot="reference" class="name-wrapper">
                    </div> -->
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
                title: 'オペーレーター追加画面',
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
            axios.get("/api/twilio/workers/show/" + this.$route.params.sid)
                .then(response => {
                    console.log(response.data.status);
                    if (response.data.status === 'OK') {
                        // location.href = '/#/workers';
                        console.log(response.data.attributes);
                        console.log(JSON.parse(response.data.attributes).technical_skill);
                        console.log(response.data.attributes["technical_skill"]);
                        this.form.name = response.data.friendlyName;
                        this.form.activity = response.data.activityName;
                        this.form.skills = JSON.parse(response.data.attributes).technical_skill;
                        this.form.languages = JSON.parse(response.data.attributes).languages;
                        this.form.attributes = response.data.attributes;
                    } else {
                        console.log('ワーカー情報の取得に失敗しました');
                        Notification.error(
                            {
                                title: "Error",
                                message: "ワーカー情報の取得に失敗しました"
                            }
                        );
                    }
                });
        },
        methods: {
            onSubmit() {
                axios.put("/api/twilio/workers/update", JSON.stringify({
                        sid: this.$route.params.sid,
                        name: this.form.name,
                        activity: this.form.activity,
                        skills: this.form.skills,
                        languages: this.form.languages,
                        // attributes: this.form.attributes
                    }))
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            console.log('ワーカーの更新に成功しました');
                            location.href = '/#/workers';
                            Notification.success(
                                {
                                    title: "Success",
                                    message: "ワーカーを更新しました。"
                                }
                            );
                        } else {
                            console.log('ワーカーの更新に失敗しました');
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