<template>
  <div>

    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入用户邮箱" v-model="email" @change="getData" @blur="getData">
          <template slot="prefix">
            <i class="el-icon-search">
            </i>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border stripe>
        <el-table-column
          prop="ticketID"
          label="编号"
          width="50"
          sortable>
        </el-table-column>
        <el-table-column
          prop="ticketType"
          label="票类型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="state"
          label="订单状态"
          width="100">
        </el-table-column>
        <el-table-column
          prop="time"
          label="订单时间"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderDate"
          label="预定时间"
          width="70">
        </el-table-column>
        <el-table-column
          prop="price"
          label="票价"
          width="70">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEditState(scope.row)"
                       icon="el-icon-edit">受理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  import {
    getOrder,
    updateOrderState
  } from "../../api/order"
  import {USER_INFO} from "../../utils/constant";
  import {getSpotByUserEmail} from "../../api/spot";

  export default {
    data() {
      return {
        tableForm: [],
        userEmail: '',
        email: '',
        spotID: '',
        orderForm: []
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotByUserEmail({userEmail: this.userEmail}).then(res0 => {
          console.log(res0);
          this.spotID = res0.data.data[0].spotDTO.id;
          getOrder({userEmail: this.email, spotID: this.spotID})
            .then(res => {
              this.tableForm = res.data.data
            })
        })
      },
      handleEditState(row) {
        this.orderForm = Object.assign({}, row);
        this.orderForm.state = 2;
        updateOrderState(this.orderForm)
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '已消费',
                type: 'success',
                center: true
              });
              this.tableForm = []
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
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

