<template>
</template>

<script>
    import axios from 'axios';
    import { Notification } from 'element-ui';

    //Our interface to the Sync service
    var syncClient;

    export default {
        name: 'SuperVisors',
        data() {
            return {
            }
        },
        mounted() {
            this.getToken();
        },
        methods: {
            getToken: function() {
                axios.get("/api/twilio/token_generator/generate/supervisor")
                    .then(response => {
                        // Twilio.Device.setup(response.data.token);
                        syncClient = new Twilio.Sync.Client(response.data.token, { logLevel: 'info' });
                        syncClient.on('connectionStateChanged', function (state) {
                            if (state != 'connected') {
                                // $message.html('Sync is not live (websocket connection <span style="color: red">' + state + '</span>)…');
                                console.log(('connected'));
                            } else {
                                // // Now that we're connected, lets light up our board and play!
                                // $buttons.attr('disabled', false);
                                // $message.html('Sync is live!');
                                console.log(('disabled'));
                            }
                        });
                    });
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
