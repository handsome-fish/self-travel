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
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          type="index"-->
        <!--          width="50">-->
        <!--        </el-table-column>-->
        <el-table-column
          prop="id"
          label="编号"
          width="50"
          sortable>
        </el-table-column>
        <el-table-column
          prop="start"
          label="开始时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="end"
          label="结束时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="spotName"
          label="所属景区"
          width="180">
        </el-table-column>
        <el-table-column
          prop="priceAdult"
          label="成人票价"
          width="180">
        </el-table-column>
        <el-table-column
          prop="priceStudent"
          label="学生价格"
          width="150">
        </el-table-column>
        <el-table-column
          prop="priceChild"
          label="儿童票价"
          width="100"
          sortable>
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
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.start"
            type="datetime"
            placeholder="选择开始时间"
            style="float: left; width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.end"
            type="datetime"
            placeholder="选择结束时间"
            style="float: left; width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成人票价" :label-width="formLabelWidth">
          <el-input v-model="editForm.priceAdult" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生价格" :label-width="formLabelWidth">
          <el-input v-model="editForm.priceStudent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="儿童票价" :label-width="formLabelWidth">
          <el-input v-model="editForm.priceChild" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="editTicket()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增窗口 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="开始和结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="startEnd"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="float: left; width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成人票价" :label-width="formLabelWidth">
          <el-input v-model="addForm.priceAdult" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.priceStudent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="儿童票价" :label-width="formLabelWidth">
          <el-input v-model="addForm.priceChild"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addTicket()" :loading="addLoading">确定</el-button>
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
  import {getSpotByUserEmail} from "../../api/spot";
  import {USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        editFormVisible: false,//是否显示编辑窗口
        editForm: {
          id: '',
          start: '',
          end: '',
          spotID: '',
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        startEnd: [],
        addForm: {
          start: '',
          end: '',
          spotID: '',
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
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
          getTicket({spotID: this.selectedSpotId}).then(res => {
            this.tableForm = res.data.data;
            this.tableForm.forEach((val, index) => {
              val.spotName = this.spotName
            })
            // console.log(res)
          })
        })
      },
      //编辑数据
      handleEdit(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.editForm.spotID = this.selectedSpotId
        this.editForm.start = this.getDateByTimeStr(this.editForm.start);
        this.editForm.end = this.getDateByTimeStr(this.editForm.end);
      },
      //保存编辑
      editTicket() {
        this.editForm.start = this.getTimeStrByDate(this.editForm.start);
        this.editForm.end = this.getTimeStrByDate(this.editForm.end);
        modTicket(this.editForm).then(res => {
          console.log(res);
          if (res.data.code === "100") {
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
      //将Datetime转成Datetime String
      getTimeStrByDate(date) {
        let y = date.getFullYear();
        let M = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return y + '-' + (M < 10 ? ('0' + M) : M) + '-' +
          (d < 10 ? ('0' + d) : d) + " " + (H < 10 ? ('0' + H) : H) + ":" +
          (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s)
      },
      //将Datetime String转成Datetime
      getDateByTimeStr(timeStr) {
        let timeArr = timeStr.split(" ");
        let d = timeArr[0].split("-");
        let t = timeArr[1].split(":");
        return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
      },
      //新增数据
      handleAdd() {
        //先将表单清空
        this.addForm = {
          start: '',
          end: '',
          spotID: this.selectedSpotId,
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
        };
        this.startEnd = [];
        this.addFormVisible = true
      },
      //将新增的数据添加到数据库中
      addTicket() {
        // console.log(this.addForm)
        this.addForm.start = this.getTimeStrByDate(this.startEnd[0]);
        this.addForm.end = this.getTimeStrByDate(this.startEnd[1]);
        console.log(this.addForm);
        addTicket(this.addForm).then(res => {
          if (res.data.code === "100") {
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
        this.editFormVisible = false;
      },
      //删除数据
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTicket(row).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '删除成功',
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

