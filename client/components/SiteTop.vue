<!-- <link rel="stylesheet" href="/dist/site.css"> -->
<template>
    <!-- <div class="hello">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <ul>
            <li>
                <a href="https://vuejs.org" target="_blank">
                    Core Docs
                </a>
            </li>
            <li>
                <a href="https://forum.vuejs.org" target="_blank">
                    Forum
                </a>
            </li>
            <li>
                <a href="https://chat.vuejs.org" target="_blank">
                    Community Chat
                </a>
            </li>
            <li>
                <a href="https://twitter.com/vuejs" target="_blank">
                    Twitter
                </a>
            </li>
            <br>
            <li>
                <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
                    Docs for This Template
                </a>
            </li>
        </ul>
        <h2>Ecosystem</h2>
        <ul>
            <li>
                <a href="http://router.vuejs.org/" target="_blank">
                    vue-router
                </a>
            </li>
            <li>
                <a href="http://vuex.vuejs.org/" target="_blank">
                    vuex
                </a>
            </li>
            <li>
                <a href="http://vue-loader.vuejs.org/" target="_blank">
                    vue-loader
                </a>
            </li>
            <li>
                <a href="https://github.com/vuejs/awesome-vue" target="_blank">
                    awesome-vue
                </a>
            </li>
        </ul>
    </div> -->
    <div>
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
            <div id="log"></div>
        </div>
    </div>
</template>

<script type="text/javascript" src="//media.twiliocdn.com/sdk/js/client/v1.4/twilio.min.js"></script>
<!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script> -->
<!-- <script src="/dist/quickstart.js"></script> -->
<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /* h1,
    h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    } */
    /* @import url(https://fonts.googleapis.com/css?family=Share+Tech+Mono); */

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
        padding: 3em;
        max-width: 1200px;
        margin: 0 auto;
    }

    div#controls div {
        float: left;
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
        color: #686865;
        font-family: 'Share Tech Mono', 'Courier New', Courier, fixed-width;
        font-size: 1.25em;
        line-height: 1.25em;
        margin-left: 1em;
        text-indent: -1.25em;
        width: 90%;
    }
</style>
