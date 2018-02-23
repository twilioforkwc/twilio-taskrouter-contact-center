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
                <!-- <el-form-item label="属性">
                    <el-popover trigger="hover" placement="top">
                        <p>Attributes model each Worker's unique properties as a JSON document. TaskQueues route Tasks to Workers based on these attributes. Example: {"name": "Alice", "technical_skill": 5, "languages": ["ru", "en"]}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-input type="textarea" v-model="form.attributes"></el-input>
                        </div>
                    </el-popover>
                </el-form-item> -->
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
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">Create</el-button>
                    <el-button>Cancel</el-button>
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
                title: 'ワークフロー追加画面',
                form: {
                    name: '',
                    activity: '',
                    skills: '',
                    languages: '',
                    attributes: ''
                }
            }
        },
        methods: {
            onSubmit() {
                axios.post("/api/twilio/workflows/create", JSON.stringify({
                        name: this.form.name,
                        activity: this.form.activity,
                        skills: this.form.skills,
                        languages: this.form.languages,
                    }))
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            console.log('ワーカーの登録に成功しました');
                            location.href = '/#/workflows';
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