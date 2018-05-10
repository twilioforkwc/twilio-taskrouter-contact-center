<template>
    <div id="controls" class="hello">
        <div id="info">
            <p class="instructions">Twilio Client</p>
            <div id="client-name"></div>
            <div id="output-selection">
                <label>Ringtone Devices</label>
                <select id="ringtone-devices" multiple></select>
                <label>Speaker Devices</label>
                <select id="speaker-devices" multiple></select>
                <br/>
                <a id="get-devices">Seeing unknown devices?</a>
            </div>
        </div>
        <div id="call-controls">
            <p class="instructions">Make a Call:</p>
            <input id="phone-number" type="text" placeholder="Enter a phone # or client name" />
            <button id="button-call">Call</button>
            <button id="button-pickup">Answer the call</button>
            <button id="button-hangup">Hangup</button>
            <div id="volume-indicators">
                <label>Mic Volume</label>
                <div id="input-volume"></div>
                <br/>
                <br/>
                <label>Speaker Volume</label>
                <div id="output-volume"></div>
            </div>
        </div>
        <div id="log" style="color:#ccc !important;"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { Notification } from 'element-ui';

    var tmpConnect;
    //Our interface to the Sync service
    var syncClient;
    var vueObj;
    var agentSid;

    export default {
        name: 'HelloWorld',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        mounted() {
            this.getToken();
            agentSid = this.$route.params.sid;
        },
        methods: {
            getToken: function() {
                axios.get("/api/twilio/token_generator/generate/"+this.$route.params.sid)
                    .then(response => {
                        // Twilio.Device.setup(response.data.token);
                        this.listenSyncClient(response);
                    });
                axios.get("/api/twilio/capabilities/generateToken/" + this.$route.params.sid)
                    .then(response => {
                        var speakerDevices = document.getElementById('speaker-devices');
                        var ringtoneDevices = document.getElementById('ringtone-devices');
                        var outputVolumeBar = document.getElementById('output-volume');
                        var inputVolumeBar = document.getElementById('input-volume');
                        var volumeIndicators = document.getElementById('volume-indicators');
                        Twilio.Device.setup(response.data.token);
                        Twilio.Device.ready(function (device) {
                            log('Twilio.Device Ready!');
                            document.getElementById('call-controls').style.display = 'block';
                            updateSyncClient('待機中', null);
                        });
                        Twilio.Device.error(function (error) {
                            log('Twilio.Device Error: ' + error.message);
                            updateSyncClient(error.message, null);
                        });

                        Twilio.Device.connect(function (conn) {
                            log('Successfully established call!');
                            updateSyncClient('通話中', conn.sid);
                            document.getElementById('button-call').style.display = 'none';
                            document.getElementById('button-pickup').style.display = 'none';
                            document.getElementById('button-hangup').style.display = 'inline';
                            volumeIndicators.style.display = 'block';
                            conn.volume(function (inputVolume, outputVolume) {
                                var inputColor = 'red';
                                if (inputVolume < .50) {
                                    inputColor = 'green';
                                } else if (inputVolume < .75) {
                                    inputColor = 'yellow';
                                }

                                inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
                                inputVolumeBar.style.background = inputColor;

                                var outputColor = 'red';
                                if (outputVolume < .50) {
                                    outputColor = 'green';
                                } else if (outputVolume < .75) {
                                    outputColor = 'yellow';
                                }

                                outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
                                outputVolumeBar.style.background = outputColor;
                            });
                        });

                        Twilio.Device.disconnect(function (conn) {
                            log('Call ended.');
                            document.getElementById('button-call').style.display = 'inline';
                            document.getElementById('button-hangup').style.display = 'none';
                            document.getElementById('button-pickup').style.display = 'none';
                            volumeIndicators.style.display = 'none';
                            updateSyncClient('待機中', conn.sid);
                        });

                        Twilio.Device.incoming(function (conn) {
                            log('Incoming connection from ' + conn.parameters.From);
                            document.getElementById('button-call').style.display = 'none';
                            document.getElementById('button-pickup').style.display = 'inline';
                            tmpConnect = conn;
                            updateSyncClient('着信中');
                        });

                        console.log(response.data);
                        setClientNameUI(response.data.identity);

                        // Show audio selection UI if it is supported by the browser.
                        if (Twilio.Device.audio.isSelectionSupported) {
                            document.getElementById('output-selection').style.display = 'block';
                        }
                    });
            },
            bindVolumeIndicators: function(connection) {
                connection.volume(function (inputVolume, outputVolume) {
                    var inputColor = 'red';
                    if (inputVolume < .50) {
                        inputColor = 'green';
                    } else if (inputVolume < .75) {
                        inputColor = 'yellow';
                    }

                    inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
                    inputVolumeBar.style.background = inputColor;

                    var outputColor = 'red';
                    if (outputVolume < .50) {
                        outputColor = 'green';
                    } else if (outputVolume < .75) {
                        outputColor = 'yellow';
                    }

                    outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
                    outputVolumeBar.style.background = outputColor;
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
                        vueObj.message = 'Sync is live!';
                    }
                });
            },
        }
    }

    $(function () {

        var speakerDevices = document.getElementById('speaker-devices');
        var ringtoneDevices = document.getElementById('ringtone-devices');
        var outputVolumeBar = document.getElementById('output-volume');
        var inputVolumeBar = document.getElementById('input-volume');
        var volumeIndicators = document.getElementById('volume-indicators');
        // Bind button to make call
        document.getElementById('button-call').onclick = function () {
            // get the phone number to connect the call to
            var params = {
                To: document.getElementById('phone-number').value
            };

            console.log('Calling ' + params.To + '...');
            Twilio.Device.connect(params);
        };

        // Bind button to hangup call
        document.getElementById('button-hangup').onclick = function () {
            log('Hanging up...');
            Twilio.Device.disconnectAll();
        };

        // Bind button to pick up the call
        document.getElementById('button-pickup').onclick = function () {
            log('Answered...');
            // Twilio.Device.disconnectAll();
            tmpConnect.accept();
        };

        document.getElementById('get-devices').onclick = function () {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(updateAllDevices);
        };

        speakerDevices.addEventListener('change', function () {
            var selectedDevices = [].slice.call(speakerDevices.children)
                .filter(function (node) { return node.selected; })
                .map(function (node) { return node.getAttribute('data-id'); });

            Twilio.Device.audio.speakerDevices.set(selectedDevices);
        });

        ringtoneDevices.addEventListener('change', function () {
            var selectedDevices = [].slice.call(ringtoneDevices.children)
                .filter(function (node) { return node.selected; })
                .map(function (node) { return node.getAttribute('data-id'); });

            Twilio.Device.audio.ringtoneDevices.set(selectedDevices);
        });

        function updateAllDevices() {
            updateDevices(speakerDevices, Twilio.Device.audio.speakerDevices.get());
            updateDevices(ringtoneDevices, Twilio.Device.audio.ringtoneDevices.get());
        }
    });

    function updateSyncClient(status, call_sid) {
        syncClient.map('users').then(function (map) {
            map.update(agentSid, { status: status });
        });
    }

    // Activity log
    function log(message) {
        var logDiv = document.getElementById('log');
        logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    // Set the client name in the UI
    function setClientNameUI(clientName) {
        var div = document.getElementById('client-name');
        div.innerHTML = 'Your client name: <strong>' + clientName + '</strong>';
    }
</script>

<style scoped>
    body,
    p {
        padding: 0;
        margin: 0;
    }

    body {
        background: #272726;
    }

    label {
        text-align: left;
        font-family: Helvetica, sans-serif;
        font-size: 1.25em;
        color: #777776;
        display: block;
    }

    div#controls {
        padding: 20px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        background-color: #333;
    }

    div#controls div {
        flex: 1;
    }
    div#controls div#log {
        flex: 100%;
    }

    div#controls div#call-controls,
    div#controls div#info {
        width: 16em;
        margin: 0 1.5em;
        text-align: center;
    }
    div#controls div#info div#output-selection {
        display: none;
    }

    div#controls div#info a {
        font-size: 1.1em;
        color: khaki;
        text-decoration: underline;
        cursor: pointer;
    }

    div#controls div#info select {
        width: 300px;
        height: 60px;
        margin-bottom: 2em;
    }

    div#controls div#info label {
        width: 300px;
    }

    div#controls div#call-controls div#volume-indicators {
        display: none;
        padding: 10px;
        margin-top: 20px;
        width: 500px;
        text-align: left;
    }

    div#controls div#call-controls div#volume-indicators > div {
        display: block;
        height: 20px;
        width: 0;
    }

    div#controls p.instructions {
        text-align: left;
        margin-bottom: 1em;
        font-family: Helvetica-LightOblique, Helvetica, sans-serif;
        font-style: oblique;
        font-size: 1.25em;
        color: #777776;
    }

    div#controls div#info #client-name {
        text-align: left;
        margin-bottom: 1em;
        font-family: "Helvetica Light", Helvetica, sans-serif;
        font-size: 1.25em;
        color: #777776;
    }

    div#controls button {
        width: 15em;
        height: 2.5em;
        margin-top: 1.75em;
        border-radius: 1em;
        font-family: "Helvetica Light", Helvetica, sans-serif;
        font-size: .8em;
        font-weight: lighter;
        outline: 0;
    }

    div#controls button:active {
        position: relative;
        top: 1px;
    }

    div#controls div#call-controls {
        display: none;
    }

    div#controls div#call-controls input {
        font-family: Helvetica-LightOblique, Helvetica, sans-serif;
        font-style: oblique;
        font-size: 1em;
        width: 100%;
        height: 2.5em;
        padding: .5em;
        display: block;
    }

    div#controls div#call-controls button {
        color: #fff;
        background: 0 0;
        border: 1px solid #686865;
    }

    div#controls div#call-controls button#button-hangup {
        display: none;
    }

    div#controls div#call-controls button#button-pickup {
        display: none;
    }

    div#controls div#log {
        border: 1px solid #686865;
        width: 35%;
        height: 9.5em;
        margin-top: 2.75em;
        text-align: left;
        padding: 1.5em;
        float: right;
        overflow-y: scroll;
    }

    div#controls div#log p {
        color: #686865 !important;
        font-family: 'Share Tech Mono', 'Courier New', Courier, fixed-width;
        font-size: 1.25em;
        line-height: 1.25em;
        margin-left: 1em;
        text-indent: -1.25em;
        width: 90%;
    }
</style>
