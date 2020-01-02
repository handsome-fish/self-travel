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
          prop="level"
          label="等级"
          width="150"
          sortable>
        </el-table-column>
        <el-table-column
          prop="number"
          label="所需点赞数"
          width="150">
        </el-table-column>
        <el-table-column
          prop="rebate"
          label="折扣"
          width="150">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       icon="el-icon-edit">编辑</el-button>
<!--            <el-button type="danger"-->
<!--                       @click="handleDelete(scope.row)"-->
<!--                       icon="el-icon-delete">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input v-model="editForm.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所需点赞次数" :label-width="formLabelWidth">
          <el-input v-model="editForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="折扣" :label-width="formLabelWidth">
          <el-input v-model="editForm.rebate" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="editLevel()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增窗口 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input v-model="addForm.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所需点赞次数" :label-width="formLabelWidth">
          <el-input v-model="addForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="折扣" :label-width="formLabelWidth">
          <el-input v-model="addForm.rebate" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addLevel()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    getLevelDetail,
    updateLevel,
    addLevel,
    getAllLevel
  } from "../../api/levelStandard"

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        editFormVisible: false,//是否显示编辑窗口
        editForm: {
          level: undefined,
          number: undefined,
          rebate: undefined
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        addForm: {
          level: undefined,
          number: undefined,
          rebate: undefined
        }
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getAllLevel().then(res => {
          this.tableForm = res.data.data;
          console.log(res)
        })
      },
      //编辑数据
      handleEdit(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //保存编辑
      editLevel() {
        updateLevel(this.editForm).then(res => {
          if (res.data.resultEnum === "SUCCESS") {
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            });
            this.getData()
          }
          else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            })
          }
        });
        this.editFormVisible = false;
      },
      //新增数据
      handleAdd() {
        //先将表单清空
        this.addForm = {
          level: undefined,
          number: undefined,
          rebate: undefined
        };
        this.addFormVisible = true
      },
      //将新增的数据添加到数据库中
      addLevel() {
        // console.log(this.addForm)
        addLevel(this.addForm).then(res => {
          if (res.data.resultEnum === "SUCCESS") {
            this.$message({
              message: '添加成功',
              type: 'success',
              center: true
            });
            this.getData()
          }
          else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            })
          }
        });
        this.addFormVisible = false
      },
      cancel() {
        this.addFormVisible = false;
        this.editFormVisible = false
      },
      //删除数据
      // handleDelete(row) {
      //   this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     delSpot(row).then(res => {
      //       if (res.data.resultEnum === "SUCCESS") {
      //         this.$message({
      //           message: res.data.message,
      //           type: 'success',
      //           center: true
      //         });
      //         this.getData()
      //       }
      //       else {
      //         this.$message({
      //           message: res.data.message,
      //           type: 'error',
      //           center: true
      //         })
      //       }
      //     })
      //   })
      // }
    },
    created() {
      this.getData()
    }
  }
</script>
<style>
  .table-grid-content {
    border-radius: 4px;
    height: 50px;
    background: #ebeef5;
    padding: 10px;
  }
  .table-input {
    outline-style: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 200px;
    font-size: 14px;
    height: 30px;
  }
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

