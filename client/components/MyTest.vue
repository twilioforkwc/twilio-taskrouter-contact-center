<template>
    <div class="hello">
        <h1>{{ msg }}{{ count }}</h1>
        <h2>MyTest Links</h2>
        <button v-on:click="awesomeClick">Click!</button>
        hogehogehoge
        <el-slider v-model="value1"></el-slider>
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
    </div>
</template>

<script>

    const WORKER = 'defaultman';
    import axios from 'axios';

    export default {
        name: 'HelloWorld',
        data() {
            return {
                count: 0,
                value1: 50,
                msg: 'Welcome to Your Vue.js App!!'
            }
        },
        mounted() {
            axios.get("http://localhost:3000/api/twilio/workers")
                .then(response => {
                    console.log(response.data[0]);
                    this.msg = response.data[0].friendlyName
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
    }
</style>