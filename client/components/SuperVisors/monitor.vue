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
                        <el-button size="mini" type="primary" @click="join" :data-sid="scope.row.sid">会話を聞く</el-button>
                        <el-button size="mini" type="success" @click="join" :data-sid="scope.row.sid">会話に参加する</el-button>
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
    var conn;

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
                axios.get("/api/twilio/capabilities/generateToken/supervisor")
                    .then(response => {
                        Twilio.Device.setup(response.data.token);
                        Twilio.Device.disconnect(function (con) {
                            conn = null;
                        });
                        Twilio.Device.error(function (error) {
                            Notification.error(
                                {
                                    title: "Error",
                                    message: "接続に失敗しました"
                                }
                            );
                        });
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
            join: function(e) {
                var obj = $(e.target);
                if(obj.parent().hasClass('hangup')) {
                    this.disConnect(obj);
                    return;
                }
                var sid = obj.parent().attr('data-sid');
                if(!sid || conn) {
                    return;
                }
                var muted = false;
                if(obj.parent().hasClass('el-button--primary')) {
                    muted = true;
                }
                var params = {
                    App_Muted: muted,
                    App_WorkerSID: sid
                };
                conn = Twilio.Device.connect(params);
                obj.text('切断').parent().addClass('hangup');
            },
            disConnect: function(obj) {
                obj.parent().removeClass('hangup');
                if(obj.parent().hasClass('el-button--primary')) {
                    obj.text('会話を聞く');
                } else {
                    obj.text('会話に参加する');
                }
                if(conn) conn.disconnect();
            },
        }
    }
</script>