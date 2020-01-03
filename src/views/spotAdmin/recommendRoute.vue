<template>
  <div>
    <el-row>
      <template>
        <el-button type="primary" @click="handleAdd()" icon="el-icon-circle-plus-outline">新增</el-button>
      </template>
    </el-row>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border>
        <el-table-column
          prop="name"
          label="路线名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="路线简介"
          width="300">
        </el-table-column>
        <el-table-column
          prop="spotName"
          label="所属景区"
          width="200">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       icon="el-icon-edit">编辑</el-button>
            <el-button type="danger"
                       @click="handleDelete(scope.row)"
                       icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rule">
        <el-form-item label="路线名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="路线简介" :label-width="formLabelWidth" prop="introduce">
          <el-input v-model="editForm.introduce">
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="editLine()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增窗口 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rule">
        <el-form-item label="路线名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="路线简介" :label-width="formLabelWidth" prop="introduce">
          <el-input v-model="addForm.introduce">
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addLine()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    addTicket,
    delTicket,
    modTicket,
    getTicket
  } from "../../api/ticket"
  import {addLine, deleteLine, getLine, getSpotByUserEmail, updateLine} from "../../api/spot";
  import {USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        rule: {
          name: [
            {required: true, message: '请输入路线名称', trigger: "blur" }
          ],
          introduce: [
            {required: true, message: '请输入路线简介', trigger: 'blur'}
          ]
        },
        editFormVisible: false,//是否显示编辑窗口
        editForm: {
          id: '',
          name: '',
          introduce: '',
          spotId: ''
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        addForm: {
          name: '',
          introduce: '',
          spotId: ''
        },
        userEmail: '',
        selectedSpotId:  '',
        spotName: ''
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotByUserEmail({userEmail: this.userEmail}).then(res0 => {
          console.log(res0);
          this.selectedSpotId = res0.data.data[0].spotDTO.id;
          this.spotName = res0.data.data[0].spotDTO.name;
          getLine({spotId: this.selectedSpotId}).then(res => {
            this.tableForm = res.data.data;
            this.tableForm.forEach((val, index) => {
              val.spotName = this.spotName
            })
          })
        })
      },
      //编辑数据
      handleEdit(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.editForm.spotId = this.selectedSpotId;
      },
      //保存编辑
      editLine() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.addLoading = true;
            updateLine(this.editForm).then(res => {
              console.log(res);
              if (res.data.code === "100") {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  center: true
                });
              }
              else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
              this.getData();
              this.addLoading = false;
              this.editFormVisible = false;
            });
          } else {
            this.$message({
              message: '请填写完整信息',
              type: 'error',
              center: true
            });
            return false;
          }
        })
      },
      //新增数据
      handleAdd() {
        //先将表单清空
        this.addForm = {
          name: '',
          introduce: '',
          spotId: this.selectedSpotId
        };
        this.addFormVisible = true
      },
      //将新增的数据添加到数据库中
      addLine() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            this.addLoading = true;
            console.log(this.addForm);
            addLine(this.addForm).then(res => {
              if (res.data.code === "100") {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  center: true
                });
              }
              else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
              this.getData();
              this.addLoading = false;
              this.addFormVisible = false
            })
          } else {
            this.$message({
              message: '请填写完整信息',
              type: 'error',
              center: true
            });
            return false;
          }
        })
      },
      cancel() {
        this.addFormVisible = false;
        this.editFormVisible = false;
      },
      //删除数据
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLine({id: row.id}).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '删除成功',
                type: 'success',
                center: true
              });
            }
            else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
            this.getData()
          })
        })
      },
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.getData()
    }
  }
</script>
<style>
  .Table-table {
    padding: 5px;
  }
  .el-table td {
    padding: 0px;
  }
  .el-table th {
    padding: 0px;
  }
</style>

