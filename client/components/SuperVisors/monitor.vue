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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">会話を聞く</el-button>
                        <el-button size="mini" type="success" @click="handleDelete(scope.$index, scope.row)">会話に参加する</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" @click="handleCreate()" size="mini">オペーレーターを追加</el-button>
            </div>

        </div>
    </div>
</template>

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
                        // Twilio.Device.setup(response.data.token);
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
                        // $message.html('Sync is not live (websocket connection <span style="color: red">' + state + '</span>)…');
                        console.log('disabled');
                        vueObj.message = 'Sync is not live (websocket connection <span style="color: red">' + state + '</span>)…';
                    } else {
                        console.log('connected');
                        // // Now that we're connected, lets light up our board and play!
                        // $buttons.attr('disabled', false);
                        // $message.html('Sync is live!');
                        vueObj.message = 'Sync is live!';
                    }
                });
                syncClient.document('LexTechSupport').then(function (syncDoc) {
                    var data = syncDoc.value;
                    if (data.board) {
                        // updateUserInterface(data);
                    }

                    // Any time the board changes, we want to show the new state. The 'updated'
                    // event is for this.
                    syncDoc.on('updated', function (event) {
                        console.debug("Board was updated", event.isLocal ? "locally." : "by the other guy.");
                        // updateUserInterface(event.value);
                    });

                    // Let's make our buttons control the game state in Sync…
                    $('html').on('click', function (e) {
                        // Toggle the value: X, O, or empty
                        // toggleCellValue($(e.target));
                        console.log(e);

                        // Send updated document to Sync. This will trigger "updated" events for all players.
                        var data = readGameBoardFromUserInterface();
                        syncDoc.set(data);
                    });
                });
            },
        }
    }

    //Read the state of the UI and create a new document
    function readGameBoardFromUserInterface() {
        console.log('readGameBoardFromUserInterface');
        var board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        // for (var row = 0; row < 3; row++) {
        //     for (var col = 0; col < 3; col++) {
        //         var selector = '[data-row="' + row + '"]' +
        //             '[data-col="' + col + '"]';
        //         board[row][col] = $(selector).html().replace('&nbsp;', '');
        //     }
        // }

        return { board: board };
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
