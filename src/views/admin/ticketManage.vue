<template>
  <div>
    <el-row>
      <template>
        <el-select v-model="selectedProvinceId" placeholder="请选择省份" filterable @change="getCity">
          <el-option
            v-for="item in selectedProvinceOptions"
            :key="item.pid"
            :label="item.province"
            :value="item.pid">
          </el-option>
        </el-select>
        <el-select v-model="selectedCityId" placeholder="请选择市区" filterable @change="getSpotByCid">
          <el-option
            v-for="item in selectedCityOptions"
            :key="item.cid"
            :label="item.city"
            :value="item.cid">
          </el-option>
        </el-select>
        <el-select v-model="selectedSpotId" placeholder="请选择景点" filterable @change="getData">
          <el-option
            v-for="item in selectedSpotOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
          prop="spotID"
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
          <el-input v-model="editForm.start" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-input v-model="editForm.end"></el-input>
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
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-input v-model="addForm.start" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-input v-model="addForm.end"></el-input>
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

  import {
    getProvince,
    getCity
  } from "../../api/location"

  import {
    getSpotByCid
  } from "../../api/spot"

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
          spotID: '3',
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        addForm: {
          start: '',
          end: '',
          spotID: '',
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
        },
        //搜索
        searchData: '',
        selectedProvinceOptions: [],
        selectedCityOptions: [],
        selectedSpotOptions: [],
        selectedSpotId: '',
        selectedProvinceId: '',
        selectedCityId: ''
      }
    },
    methods: {
      //获取省份信息
      getProvince() {
        getProvince()
          .then(res => {
            console.log(res);
            this.selectedProvinceOptions = res.data.data
          })
      },
      //获取城市信息
      getCity() {
        this.selectedCityId = '';
        this.selectedSpotId = '';
        getCity({pid: this.selectedProvinceId})
          .then(res => {
            console.log(res);
            this.selectedCityOptions = res.data.data
          })
      },
      //获取景区
      getSpotByCid() {
        this.selectedSpotId = '';
        getSpotByCid({cid: this.selectedCityId})
          .then(res => {
            console.log(res);
            this.selectedSpotOptions = res.data.data
          })
      },
      //获取表格数据
      getData() {
        getTicket({spotID: this.selectedSpotId}).then(res => {
          this.tableForm = res.data.data;
          console.log(res)
        })
      },
      //编辑数据
      handleEdit(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.editForm.spotID = this.selectedSpotId
      },
      //保存编辑
      editTicket() {
        modTicket(this.editForm).then(res => {
          if (res.data.resultEnum === "SUCCESS") {
            this.$message({
              message: res.data.message,
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
          start: '',
          end: '',
          spotID: this.selectedSpotId,
          priceAdult: '',
          priceStudent: '',
          priceChild: ''
        };
        this.addFormVisible = true
      },
      //将新增的数据添加到数据库中
      addTicket() {
        // console.log(this.addForm)
        addTicket(this.addForm).then(res => {
          if (res.data.resultEnum === "SUCCESS") {
            this.$message({
              message: res.data.message,
              type: 'success',
              center: true
            });
            this.spotID = this.addForm.spotID;
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
            if (res.data.resultEnum === "SUCCESS") {
              this.$message({
                message: res.data.message,
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
      this.getProvince()
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

