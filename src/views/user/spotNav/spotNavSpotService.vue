<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border stripe>
        <el-table-column
          prop="name"
          label="名称"
          width="50">
        </el-table-column>
        <el-table-column
          prop="seat"
          label="位置"
          width="100">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="50">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="服务电话"
          width="100">
        </el-table-column>
        <el-table-column
          label="图片"
          width="100">
          <template slot-scope="scope">
            <img
              style="width:80px;height:80px;border:none;"
              :src="scope.row.image"
              class="image">
          </template>
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="企业简介"
          width="100">
        </el-table-column>
        <el-table-column
          prop="maxNum"
          label="酒店容量"
          width="50">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="50">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handlePurchase(scope.row)"
                       icon="el-icon-edit">购票</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 购票窗口 -->
    <el-dialog title="购票" :visible.sync="purchaseCompanyDialogVisible">
      <el-form :model="purchaseCompanyForm" ref="purchaseCompanyForm">
        <el-form-item label="预定日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="purchaseCompanyForm.orderDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="purchaseCompanyForm.number">
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="purchaseCompany()" :loading="addLoading">添加购物车</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  import {
    newCompanyOrder
  } from "../../../api/order";
  import {
    getCompanyBySpotId
  } from "../../../api/company";
  import {SPOT_ID, USER_INFO} from "../../../utils/constant";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        purchaseCompanyDialogVisible: false,
        purchaseCompanyForm: {
          state: '',
          orderDate: '', //预定日期 Date
          time: '', //Datetime
          price: '',
          userEmail: '',
          companyId: '',
          number: ''
        },
        addLoading: false,
        selectedSpotId: '',
        userEmail: '',
        rowData: undefined
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getCompanyBySpotId({spotId: this.selectedSpotId}).then(res => {
          this.tableForm = res.data.data;
          console.log(res)
        })
      },
      cancel() {
        this.purchaseCompanyDialogVisible = false
      },
      handlePurchase(row) {
        this.purchaseCompanyDialogVisible = true;
        this.rowData = row
      },
      //将Date转成Date String
      getDateStrByDate(date) {
        let y = date.getFullYear();
        let M = date.getMonth() + 1;
        let d = date.getDate();
        return y + '-' + (M < 10 ? ('0' + M) : M) + '-' +
          (d < 10 ? ('0' + d) : d)
      },
      //将Date转成Datetime String
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
      //组装传入后端的购票表单
      combinePurchaseForm() {
        this.purchaseCompanyForm.companyId = this.rowData.id;
        this.purchaseCompanyForm.orderDate = this.getDateStrByDate(this.purchaseCompanyForm.orderDate);
        this.purchaseCompanyForm.state = '1';
        this.purchaseCompanyForm.price = this.purchaseCompanyForm.number * this.rowData.price;
        this.purchaseCompanyForm.time = this.getTimeStrByDate(new Date());
        this.purchaseCompanyForm.userEmail = this.userEmail;
      },
      //清空购票表单
      clearPurchaseForm() {
        this.purchaseCompanyForm.companyId = '';
        this.purchaseCompanyForm.orderDate = '';
        this.purchaseCompanyForm.price = '';
        this.purchaseCompanyForm.time = '';
        this.purchaseCompanyForm.number = ''
      },
      purchaseCompany() {
        this.addLoading = true;
        this.combinePurchaseForm();
        let newOrderForm = {
          userEmail: this.purchaseCompanyForm.userEmail,
          companyId: this.purchaseCompanyForm.companyId,
          time: this.purchaseCompanyForm.time,
          orderDate: this.purchaseCompanyForm.orderDate,
          num: this.purchaseCompanyForm.number
        };
        newCompanyOrder(newOrderForm)
          .then(res => {
            if (res.data.code === '100') {
              this.addLoading = false;
              this.$message({
                message: '已加入购物车',
                type: 'success',
                center: true
              });
              this.purchaseCompanyDialogVisible = false;
              this.clearPurchaseForm();
            } else {
              this.addLoading = false;
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              });
              this.clearPurchaseForm();
            }
          })
      }
    },
    created() {
      this.selectedSpotId = sessionStorage.getItem(SPOT_ID);
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


