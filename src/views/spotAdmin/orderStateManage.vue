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
          label="数量"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.orderRecord.companyId">×{{ scope.row.orderRecord.num }}</span>
            <span v-else>
              成人票 ×{{ scope.row.orderRecord.adultNum }}
            <br>
            学生票 ×{{ scope.row.orderRecord.studentNum }}
            <br>
            儿童票 ×{{ scope.row.orderRecord.childNum }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderRecord.time"
          label="订单时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="orderRecord.orderDate"
          label="预定时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="orderRecord.price"
          label="票价(元)"
          width="200">
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
    consumeCompanyOrder, consumeTravelOrder,
    getNormalOrderForConsume,
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
          getNormalOrderForConsume({userEmail: this.email, spotId: this.spotID})
            .then(res => {
              this.tableForm = res.data.data
            })
        })
      },
      handleEditState(row) {
        if (row.orderRecord.companyId) {
          consumeCompanyOrder({id: row.orderRecord.id})
            .then(res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '消费成功',
                  type: 'success',
                  center: true
                })
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
            });
          this.getData()
        } else {
          consumeTravelOrder({id: row.orderRecord.id})
            .then(res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '消费成功',
                  type: 'success',
                  center: true
                })
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
            });
          this.getData()
        }
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

