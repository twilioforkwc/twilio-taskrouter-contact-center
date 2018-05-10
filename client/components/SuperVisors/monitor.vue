<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ message }}</h1>
        <div style="margin: 10px 0;">
            <el-table :data="operators" style="width: 100%">
                <el-table-column label="最終ログイン">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span>{{ scope.row.dateCreated }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="氏名">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>Name: {{ scope.row.friendlyName }}</p>
                            <p>Sid: {{ scope.row.sid }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.friendlyName }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="アクティビティ">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span>{{ scope.row.activityName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="ステータス">
                    <template slot-scope="scope">
                        <span :id="scope.row.sid" class="status"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary">会話を聞く</el-button>
                        <el-button size="mini" type="success" @click="join">会話に参加する</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script>
    import axios from 'axios';
    import { Notification } from 'element-ui';

    //Our interface to the Sync service
    var syncClient;
    var vueObj;

    export default {
        name: 'SuperVisors',
        data() {
            return {
                message: 'Hello, This is default message.',
                operators: [],
            }
        },
        mounted() {
            vueObj = this;
            this.getToken();
            this.getOperators();
        },
        methods: {
            getToken: function() {
                axios.get("/api/twilio/token_generator/generate/supervisor")
                    .then(response => {
                        this.listenSyncClient(response);
                    });
            },
            getOperators: function() {
                axios.get("/api/twilio/workers")
                    .then(response => {
                        this.operators = response.data;
                    });
            },
            listenSyncClient: function(response) {
                syncClient = new Twilio.Sync.Client(response.data.token, { logLevel: 'info' });
                syncClient.on('connectionStateChanged', function (state) {
                    if (state != 'connected') {
                        vueObj.message = 'Sync is not live (websocket connection ' + state + '...';
                    } else {
                        vueObj.message = 'Sync is live!';
                    }
                });
                syncClient.map('users').then(function (map) {
                    map.on('itemUpdated', function (args) {
                        $('#'+args.item.key).text(args.item.value.status);
                    });
                });
            },
            join: function() {
                var params = {
                    To: '+815031963222' // TODO: 動的に変更する
                };
                Twilio.Device.connect(params);
            },
        }
    }
</script>