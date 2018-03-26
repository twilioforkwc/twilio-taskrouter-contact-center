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
                axios.get("/api/twilio/capabilities/generateToken/supervisor")
                    .then(response => {
                        Twilio.Device.setup(response.data.token);
                        Twilio.Device.ready(function (device) {
                            log('Twilio.Device Ready!');
                            // document.getElementById('call-controls').style.display = 'block';
                            // updateSyncClient('待機中', null);
                        });
                        Twilio.Device.error(function (error) {
                            log('Twilio.Device Error: ' + error.message);
                        });

                        Twilio.Device.connect(function (conn) {
                            log('Successfully established call!');
                            // updateSyncClient('通話中', conn.sid);
                            // document.getElementById('button-call').style.display = 'none';
                            // document.getElementById('button-pickup').style.display = 'none';
                            // document.getElementById('button-hangup').style.display = 'inline';
                            // volumeIndicators.style.display = 'block';
                            // bindVolumeIndicators(conn);
                            // conn.volume(function (inputVolume, outputVolume) {
                            //     var inputColor = 'red';
                            //     if (inputVolume < .50) {
                            //         inputColor = 'green';
                            //     } else if (inputVolume < .75) {
                            //         inputColor = 'yellow';
                            //     }

                            //     inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
                            //     inputVolumeBar.style.background = inputColor;

                            //     var outputColor = 'red';
                            //     if (outputVolume < .50) {
                            //         outputColor = 'green';
                            //     } else if (outputVolume < .75) {
                            //         outputColor = 'yellow';
                            //     }

                            //     outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
                            //     outputVolumeBar.style.background = outputColor;
                            // });
                        });

                        Twilio.Device.disconnect(function (conn) {
                            log('Call ended.');
                            // document.getElementById('button-call').style.display = 'inline';
                            // document.getElementById('button-hangup').style.display = 'none';
                            // document.getElementById('button-pickup').style.display = 'none';
                            // volumeIndicators.style.display = 'none';
                            // updateSyncClient('待機中', conn.sid);
                        });

                        Twilio.Device.incoming(function (conn) {
                            log('Incoming connection from ' + conn.parameters.From);
                            // document.getElementById('button-call').style.display = 'none';
                            // document.getElementById('button-pickup').style.display = 'inline';
                            // tmpConnect = conn;
                            // updateSyncClient('着信中');
                        });

                        console.log(response.data);
                        // setClientNameUI(response.data.identity);

                        // Twilio.Device.audio.on('deviceChange', updateAllDevices);

                        // // Show audio selection UI if it is supported by the browser.
                        // if (Twilio.Device.audio.isSelectionSupported) {
                        //     document.getElementById('output-selection').style.display = 'block';
                        // }
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
                        // $message.html('Sync is not live (websocket connection <span style="color: red">' + state + '</span>)…');
                        console.log('disabled');
                        vueObj.message = 'Sync is not live (websocket connection ' + state + '...';
                    } else {
                        console.log('connected');
                        // // Now that we're connected, lets light up our board and play!
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
                    To: '+815031963222'
                };
                console.log('Calling ' + params.To + '...');
                Twilio.Device.connect(params);
            },
        }
    }
</script>