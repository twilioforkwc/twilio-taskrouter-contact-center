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
                        <el-option label="Offline" value="offline"></el-option>
                        <el-option label="Idle" value="idle"></el-option>
                        <el-option label="Busy" value="busy"></el-option>
                        <el-option label="Reserved" value="reserved"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性">
                    <el-popover trigger="hover" placement="top">
                        <p>Attributes model each Worker's unique properties as a JSON document. TaskQueues route Tasks to Workers
                            based on these attributes. Example: {"name": "Alice", "technical_skill": 5, "languages": ["ru",
                            "en"]}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-input type="textarea" v-model="form.attributes"></el-input>
                        </div>
                    </el-popover>
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
    export default {
        data() {
            return {
                title: 'オペーレーター追加画面',
                form: {
                    name: '',
                    activity: '',
                    attributes: ''
                }
            }
        },
        mounted() {
            axios.get("/api/twilio/workers/show/" + this.$route.params.sid)
                .then(response => {
                    if (response.data.status === 'OK') {
                        this.form.name = response.data.friendlyName;
                        this.form.activity = response.data.activityName;
                        this.form.attributes = response.data.attributes;
                    }
                });
        },
        methods: {
            onSubmit() {
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