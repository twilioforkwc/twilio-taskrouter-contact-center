<template>
    <div style="width: calc(100% - 10px); padding: 10px;">
        <h1>{{ title_lang }}</h1>
        <div style="margin: 10px 0;">
            <el-table :data="languages" style="width: 100%">
                <el-table-column label="言語名">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="識別子">
                    <template slot-scope="scope">
                        <span>{{ scope.row.identifer }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="DTMF">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pin_code }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Lang属性">
                    <template slot-scope="scope">
                        <span>{{ scope.row.lang }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="読み上げ内容">
                    <template slot-scope="scope">
                        <span>{{ scope.row.text }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index)">Edit</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" size="small" @click="createDialog = true"><i class="el-icon-plus"></i></el-button>
            </div>

            <el-dialog title="言語追加" :visible.sync="createDialog">
                <el-form :model="form_create">
                    <el-form-item label="言語名" :label-width="formLabelWidth">
                        <el-input v-model="form_create.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="識別子" :label-width="formLabelWidth">
                        <el-input v-model="form_create.identifer" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="DTMF" :label-width="formLabelWidth">
                        <el-input v-model="form_create.pin_code" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Lang属性" :label-width="formLabelWidth">
                        <el-input v-model="form_create.lang" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="読み上げ内容" :label-width="formLabelWidth">
                        <el-input v-model="form_create.text" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="handleCreate()">Regist</el-button>
                </span>
            </el-dialog>

            <el-dialog title="言語編集" :visible.sync="updateDialog">
                <el-form :model="form_update">
                    <el-form-item label="言語名" :label-width="formLabelWidth">
                        <el-input v-model="form_update.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="識別子" :label-width="formLabelWidth">
                        <el-input v-model="form_update.identifer" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="DTMF" :label-width="formLabelWidth">
                        <el-input v-model="form_update.pin_code" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Lang属性" :label-width="formLabelWidth">
                        <el-input v-model="form_update.lang" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="読み上げ内容" :label-width="formLabelWidth">
                        <el-input v-model="form_update.text" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="handleUpdate()">Update</el-button>
                </span>
            </el-dialog>

        </div>
        <h1>{{ title_skill }}</h1>
        <div style="margin: 10px 0;">
            <el-table :data="skills" style="width: 100%">
                <el-table-column label="スキル名">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="識別子">
                    <template slot-scope="scope">
                        <span>{{ scope.row.identifer }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleSkillEdit(scope.$index)">Edit</el-button>
                        <el-button size="mini" type="danger" @click="handleSkillDelete(scope.$index)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="width: 100%; padding: 10px; text-align: left;">
                <el-button type="primary" size="small" @click="createSkillDialog = true"><i class="el-icon-plus"></i></el-button>
            </div>

            <el-dialog title="スキル追加" :visible.sync="createSkillDialog">
                <el-form :model="form_create">
                    <el-form-item label="スキル名" :label-width="formLabelWidth">
                        <el-input v-model="form_skill_create.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="識別子" :label-width="formLabelWidth">
                        <el-input v-model="form_skill_create.identifer" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createSkillDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="handleSkillCreate()">Regist</el-button>
                </span>
            </el-dialog>

            <el-dialog title="スキル編集" :visible.sync="updateSkillDialog">
                <el-form :model="form_update">
                    <el-form-item label="スキル名" :label-width="formLabelWidth">
                        <el-input v-model="form_skill_update.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="識別子" :label-width="formLabelWidth">
                        <el-input v-model="form_skill_update.identifer" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateSkillDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="handleSkillUpdate()">Update</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'ivr_settings',
        data() {
            return {
                count: 0,
                value1: 50,
                title_lang: '設定言語一覧',
                title_skill: '設定スキル一覧',
                languages: [],
                skills: [],
                createDialog: false,
                updateDialog: false,
                createSkillDialog: false,
                updateSkillDialog: false,
                form_create: {
                    name: '',
                    identifer: '',
                    pin_code: '',
                    lang: '',
                    text: '',
                },
                form_update: {
                    name: '',
                    identifer: '',
                    pin_code: '',
                    lang: '',
                    text: '',
                },
                form_skill_create: {
                    name: '',
                    identifer: '',
                },
                form_skill_update: {
                    name: '',
                    identifer: '',
                },
                tmp_index: null,
                formLabelWidth: '120px',
            }
        },
        mounted() {
            this.getLanguages();
            this.getSkills();
        },
        methods: {
            getLanguages: function () {
                axios.get("/api/db/files/languages")
                    .then(response => {
                        this.languages = response.data.result;
                    });
            },
            getSkills: function () {
                axios.get("/api/db/files/skills")
                    .then(response => {
                        this.skills = response.data.result;
                    });
            },
            handleCreate: function () {
                this.createDialog = false;
                this.languages.push(this.form_create);
                this.saveLanguages();
            },
            handleSkillCreate: function () {
                this.createSkillDialog = false;
                this.skills.push(this.form_skill_create);
                this.saveSkills();
            },
            handleEdit: function (index) {
                this.updateDialog = true;
                this.form_update = this.languages[index];
                this.tmp_index = index;
            },
            handleSkillEdit: function (index) {
                this.updateSkillDialog = true;
                this.form_skill_update = this.skills[index];
                this.tmp_index = index;
            },
            handleUpdate: function () {
                this.updateDialog = false;
                this.languages[this.tmp_indx] = this.form_update;
                this.saveLanguages();
            },
            handleSkillUpdate: function () {
                this.updateSkillDialog = false;
                this.skills[this.tmp_indx] = this.form_skill_update;
                this.saveSkills();
            },
            handleDelete: function (index) {
                this.languages.splice(index,1);
                this.saveLanguages();
            },
            handleSkillDelete: function (index) {
                this.skills.splice(index,1);
                this.saveSkills();
            },
            saveLanguages: function() {
                axios.post("/api/db/files/languages", this.languages)
                    .then(response => {
                        this.getLanguages();
                    });
            },
            saveSkills: function() {
                axios.post("/api/db/files/skills", this.skills)
                    .then(response => {
                        console.log(response.data.message);
                        this.getSkills();
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