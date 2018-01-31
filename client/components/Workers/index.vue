<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            <el-table :data="operators" style="width: 100%">
                <router-link to="workers/[ここにワーカーSID]">
                    <el-table-column prop="friendlyName" label="オペーレーター" width="180"></el-table-column>
                </router-link>
                <el-table-column prop="activityName" label="ACTIVITY" width="180">
                </el-table-column>
                <el-table-column prop="dateStatusChanged" label="ACTIVITY経過時間">
                </el-table-column>
                <el-table-column prop="available" label="AVAILABLE">
                </el-table-column>
            </el-table>
        </div>
        <button v-on:click="awesomeClick">オペーレーターを追加</button>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        name: 'Workers',
        data() {
            return {
                count: 0,
                value1: 50,
                title: 'オペーレーター管理画面',
                msg: 'Welcome to Your Vue.js App!!',
                operators: []
            }
        },
        mounted() {
            axios.get("http://localhost:3000/api/twilio/workers")
                .then(response => {
                    console.log(response.data[0]);
                    this.msg = response.data[0].friendlyName
                    this.operators = response.data;
                })
        },
        methods: {
            awesomeClick: function () {
                console.log('clicked');
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