<template>
</template>

<script>
    export default {
        name: 'SuperVisors',
        data() {
            return {
            }
        },
        methods: {
            getToken: function() {
                axios.get("/api/twilio/capabilities/generateToken/" + this.$route.params.sid)
                    .then(response => {
                        Twilio.Device.setup(response.data.token);
                    });
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
