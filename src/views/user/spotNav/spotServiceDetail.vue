<template>
  <div>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8" style="text-align: left">
        <img
          style="width:250px;height:250px;border:none;"
          :src="companyData.image"
          :alt="companyData.name">
      </el-col>
      <el-col :span="8" style="text-align: left">
        <span style="font-weight: bold; ">简介:</span>
        <p>{{companyData.introduce}}</p>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">热线电话:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{companyData.phone}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">详细位置:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{companyData.seat}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">接待量:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{companyData.maxNum}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">价格:</span>
      </el-col>
      <el-col :span="2" style="text-align: left;margin-top: 4px">
        <span >{{companyData.price}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="3" :span="2" style="text-align: right">
        <el-button @click="handlePurchase()"
                   icon="el-icon-edit" type="primary">购票</el-button>
      </el-col>
    </el-row>

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
  import {COMPANY_ID, USER_INFO} from "../../../utils/constant";
    import {getCompanyByCompanyId} from "../../../api/company";
    import {newCompanyOrder} from "../../../api/order";

    export default {
      name: "spotServiceDetail",
      data() {
        return {
          companyId: '',
          companyData: {},
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
          formLabelWidth: '120px',
          rowData: undefined,
          userEmail: ''
        }
      },
      methods: {
        getData() {
          getCompanyByCompanyId({companyId: this.companyId})
            .then(res => {
              this.companyData = res.data.data
            })
        },
        cancel() {
          this.purchaseCompanyDialogVisible = false
        },
        handlePurchase() {
          if (!this.userEmail) {
            this.$alert('请先登录!')
          } else {
            this.purchaseCompanyDialogVisible = true;
            this.rowData = this.companyData
          }
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
        this.companyId = sessionStorage.getItem(COMPANY_ID);
        this.userEmail = sessionStorage.getItem(USER_INFO);
        this.getData()
      }
    }
</script>

<style scoped>

</style>
