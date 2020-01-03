<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border>
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
            <el-button @click="handlePurchase(scope.row)"
                       icon="el-icon-edit">购票</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 购票窗口 -->
    <el-dialog title="购票" :visible.sync="purchaseTicketDialogVisible">
      <el-form :model="purchaseTicketForm" ref="purchaseTicketForm">
        <el-form-item label="预定日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="purchaseTicketForm.orderDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成人票" :label-width="formLabelWidth">
          <el-input v-model="purchaseTicketForm.adultTicket">
          </el-input>
        </el-form-item>
        <el-form-item label="学生票" :label-width="formLabelWidth">
          <el-input v-model="purchaseTicketForm.studentTicket">
          </el-input>
        </el-form-item>
        <el-form-item label="儿童票" :label-width="formLabelWidth">
          <el-input v-model="purchaseTicketForm.childTicket">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <span style="color: #545c64">原价(元):
        <del>{{ oldPriceComputed | currency('¥')}}</del>
        </span>
        <span style="font-weight: bold">
          折扣价(元): {{ priceComputed | currency('¥') }}
        </span>
      </div>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="purchaseTicket()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    getTicket
  } from "../../../api/ticket";

  import {
    newOrder
  } from "../../../api/order";
  import {
    getRebateByUserEmail
  } from "../../../api/levelStandard";
  import {SPOT_ID, USER_INFO} from "../../../utils/constant";
  import {getSpotInfo} from "../../../api/spot";
  import {currency} from "../../../utils/currency";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        purchaseTicketDialogVisible: false,
        purchaseTicketForm: {
          adultTicket: '',
          studentTicket: '',
          childTicket: '',
          ticketType: '',
          state: '',
          orderDate: '', //预定日期 Date
          time: '', //Datetime
          userEmail: '',
          spotId: '',
          ticketID: ''
        },
        addLoading: false,
        selectedSpotId: '',
        userEmail: '',
        rowData: undefined,
        price: undefined, //折扣后价格
        oldPrice: undefined, //总价
        rebate: undefined //折扣
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotInfo({id: this.selectedSpotId})
          .then(res => {
            // console.log(res);
            let arr = [];
            arr.push(res.data.data);
            getTicket({spotID: this.selectedSpotId}).then(res => {
              this.tableForm = res.data.data;
              this.tableForm.forEach((val, index) => {
                val.spotName = arr[0].spotDTO.name
              })
              // console.log(res)
            })
          });
      },
      cancel() {
        this.purchaseTicketDialogVisible = false
      },
      handlePurchase(row) {
        this.purchaseTicketDialogVisible = true;
        this.rowData = row;
        //获取该用户折扣
        getRebateByUserEmail({userEmail: this.userEmail})
          .then( res => {
            this.rebate = res.data.data
          })
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
        this.purchaseTicketForm.state = '1';
        this.purchaseTicketForm.orderDate = this.getDateStrByDate(this.purchaseTicketForm.orderDate);
        this.purchaseTicketForm.time = this.getTimeStrByDate(new Date());
        this.purchaseTicketForm.userEmail = this.userEmail;
        this.purchaseTicketForm.spotId = this.selectedSpotId;
        this.purchaseTicketForm.ticketID = this.rowData.id
      },
      //清空购票表单
      clearPurchaseForm() {
        this.purchaseTicketForm.adultTicket = '';
        this.purchaseTicketForm.studentTicket = '';
        this.purchaseTicketForm.childTicket = '';
        this.purchaseTicketForm.orderDate = '';
        this.purchaseTicketForm.time = '';
      },
      purchaseTicket() {
        this.addLoading = true;
        this.combinePurchaseForm();
        let newOrderForm = {
          userEmail: this.purchaseTicketForm.userEmail,
          spotId: this.purchaseTicketForm.spotId,
          ticketID: this.purchaseTicketForm.ticketID,
          orderDate: this.purchaseTicketForm.orderDate,
          adultNum: this.purchaseTicketForm.adultTicket,
          childNum: this.purchaseTicketForm.childTicket,
          studentNum: this.purchaseTicketForm.studentTicket
        };
        newOrder(newOrderForm)
          .then(res => {
            if (res.data.code === '100') {
              this.addLoading = false;
              this.$message({
                message: '已加入购物车',
                type: 'success',
                center: true
              });
              this.purchaseTicketDialogVisible = false;
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
    filters: {
      currency: currency
    },
    computed: {
      //计算原价
      oldPriceComputed() {
        return this.rowData ? this.rowData.priceAdult * this.purchaseTicketForm.adultTicket +
          this.rowData.priceStudent * this.purchaseTicketForm.studentTicket +
          this.rowData.priceChild * this.purchaseTicketForm.childTicket : 1000
      },
      //计算折扣价
      priceComputed() {
        return this.rowData ? (this.rowData.priceAdult * this.purchaseTicketForm.adultTicket +
          this.rowData.priceStudent * this.purchaseTicketForm.studentTicket +
          this.rowData.priceChild * this.purchaseTicketForm.childTicket) *
          this.rebate : 0
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


