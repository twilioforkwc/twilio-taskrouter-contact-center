<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title }}</h1>
        <div style="margin: 10px 0;">
            
            <el-table :data="ivr_settings" style="width: 100%">
                <el-table-column label="登録日">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.dateCreated }}</span>
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
                        <span style="margin-left: 10px">{{ scope.row.activityName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" @click="handleCreate()">オペーレーターを追加</el-button>
            </div>

        </div>
    </div>
</template>

<script>

    import axios from 'axios';

    // var process = {env : {NODE_ENV: 'production'}}
    // var fs = require('fs');

    // var data = {
    //     number: 1,
    //     say: 'this is a number one.',
    //     play: 'this is a number one.'
    // };

    // var fs = require('fs');
    // const fs = require('fs-extra')
    // var data = "write!!\n";
    // try {
    //     fs.writeFile('writetest.txt', data, function (err) {
    //         console.log(err);
    //     });   
    // } catch (error) {
    //     console.log(error);
    // }

    // var fs = require('fs');
    // var data = "write!!\n";
    // fs.writeFile('writetest.txt', data, function (err) {
    //     console.log(err);
    // });   

    // // sqlite3を使う準備
    // var sqlite3 = require("sqlite3").verbose();
    // // :memory:を指定すると揮発性のDBができる。
    // // DBファイルを指定する事で、永続化したDBを扱う事もができる。
    // var db = new sqlite3.Database(":ttcc:");

    // // serialize関数を使うと、
    // // それぞれの行が実行されたら、次の行が実行される。
    // // parallel関数を用いることで、平行実行もできる。
    // db.serialize(function () {

    //     // テーブルを作成する。
    //     db.run("CREATE TABLE team (info TEXT");

    //     // データを登録する。
    //     var stmt = db.prepare("INSERT INTO team VALUES (?)");
    //     for (var i = 0; i < 10; i++)
    //         stmt.run("team " + i);
    //     stmt.finalize();
            
    //     // データを更新する。
    //     var stmt2 = db.prepare("UPDATE team SET info = ? WHERE info = ?");
    //     for (var i = 0; i < 10; i+=3)
    //         stmt2.run("team 10" + i, "team " + i);
    //     stmt2.finalize();
            
    //     //参照する。
    //     // 参照用関数は他にもあるが、今回は取得したものを1件ずつ扱うeach関数を利用する。
    //     // 引数(row)のプロパティに、SELECT句で指定した要素があるので、
    //     // たとえば「row.info」といったアクセスで値を取り出せる。
    //     db.each("SELECT rowid AS id, info FROM team", function (err, row) {
    //         console.log(row.id + " : " + row.info);
    //     });
    // });

    // // DBを閉じる。
    // db.close();

    // var fs = require('fs')

    // fs.writeFile('./myfile.txt', 'Content to write', { flag: 'w' }, function(err) {
    //     if (err) 
    //         return console.error(err); 
    //     fs.readFile('./myfile.txt', 'utf-8', function (err, data) {
    //         if (err)
    //             return console.error(err);
    //         console.log(data);
    //     });
    // })

    // var jsonfile = require('jsonfile');
    // var file = 'data.json';
    // jsonfile.readFile(file, function(err, obj) {
    //     console.dir(obj)
    // });

    // fs.writeFileSync('ivr_settings.json', data);

    export default {
        name: 'Workers',
        data() {
            return {
                count: 0,
                value1: 50,
                title: 'オペーレーター管理画面',
                ivr_settings: []
            }
        },
        mounted() {
            axios.get("/api/twilio/workers")
                .then(response => {
                    console.log(response.data[0]);
                    this.ivr_settings = response.data;
                });
        },
        methods: {
            handleCreate: function () {
                location.href = '/#/workers/create';
            },
            handleShow: function (index, row_data) {
                location.href = '/#/workers/'+row_data.sid+'/show';
            },
            handleEdit: function (index, row_data) {
                location.href = '/#/workers/'+row_data.sid+'/edit';
            },
            handleDelete: function (index, row_data) {
                // location.href = '/#/workers/show';
                axios.delete("/api/twilio/workers/"+row_data.sid)
                    .then(response => {
                        console.log(response.data.status);
                        if (response.data.status === 'OK') {
                            location.href = '/#/workers';
                        } else {
                            console.log('NGNGNGNGNGGN');
                        }
                    });
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

    a {
        color: #42b983;
    }

    el-table-column:first-child {
        text-align: center;
    }

</style>