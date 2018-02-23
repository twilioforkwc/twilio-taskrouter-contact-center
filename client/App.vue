<template>
    <div id="app">
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1', '2', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-setting"></i>Settings</template>
                        <el-menu-item-group>
                            <template slot="title">オペレーター管理</template>
                            <router-link to="/workers">
                                <el-menu-item index="1-1">一覧</el-menu-item>
                            </router-link>
                            <router-link to="/workers/create">
                                <el-menu-item index="1-2">新規登録</el-menu-item>
                            </router-link>
                            <router-link to="/test2">
                                <el-menu-item index="1-3">テスト</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <template slot="title">IVR設定</template>
                            <router-link to="/ivrs">
                                <el-menu-item index="1-4">詳細</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <template slot="title">ワークフロー設定</template>
                            <router-link to="/workflows">
                                <el-menu-item index="1-5">ワークフローリスト</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <template slot="title">タスクキュー</template>
                            <router-link to="/taskqueues">
                                <el-menu-item index="1-6">タスクキューリスト</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>Super Visor</template>
                        <el-menu-item-group>
                            <template slot="title">Group 1</template>
                            <el-menu-item index="2-1">Option 1</el-menu-item>
                            <el-menu-item index="2-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>Agent</template>
                        <el-menu-item-group>
                            <template slot="title">Group 1</template>
                            <el-menu-item index="3-1">Option 1</el-menu-item>
                            <el-menu-item index="3-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <router-view/>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>