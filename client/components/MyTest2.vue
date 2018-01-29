<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple">test1</div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">test2</div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">test3</div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">test4</div>
            </el-col>
        </el-row>
        <div class="block">
            <span class="demonstration">Switch when indicator is hovered (default)</span>
            <el-carousel height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="block">
            <span class="demonstration">Switch when indicator is clicked</span>
            <el-carousel trigger="click" height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                value1: 50,
                item: 'test'
            }
        }
    }
</script>

<style>
    .template {
        display: flex;
    }
    .el-row {
        width: 100%;
        padding: 10px;
        flex: 1;
        display: flex;
        /* margin-bottom: 20px; */
    }

    .el-col {
        justify-content: center;
        align-items: center;
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>