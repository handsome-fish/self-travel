<template>
  <div>
<!--    <div class="bg-grey font-grey-light font-size-large bg-height">-->
<!--      <el-row>-->
<!--        <el-col :span="6" class="text-align-center title-margin-top">-->
<!--          <span>订单内容</span>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center title-margin-top">-->
<!--          <span>原价</span>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center title-margin-top">-->
<!--          <span>数量</span>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center title-margin-top">-->
<!--          <span>总价</span>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->

    <!-- 订单信息 -->
<!--    <div class="overflow">-->
<!--      <el-row v-for="(item, index) in orderList" :key="index">-->
<!--        <el-col :span="6" class="text-align">-->
<!--          <div class="item-img-position">-->
<!--            <img :src="item.spotName" :alt="item.spotName" class="item-img">-->
<!--          </div>-->
<!--          <div class="item-font-margin-top item-font-weight">-->
<!--            <span>{{item.spotName}}</span>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center">-->
<!--          <div class="item-font-margin-top">-->
<!--            <span>{{item.price}}</span>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center">-->
<!--          <div class="item-font-margin-top font-grey">-->
<!--            <span>×{{item.ticketType}}</span>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-center font-grey">-->
<!--          <div class="item-font-margin-top">-->
<!--            <span>{{item.price}}</span>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="4" class="text-align-right">-->
<!--          <div class="item-button-margin-top">-->
<!--            <el-button @click="pay(item.id)" v-if="item.state === '1'" type="primary">支付</el-button>-->
<!--            <el-button v-if="item.state === '2'" @click="refund(item.id)" type="warning">退款</el-button>-->
<!--            <el-button v-if="item.state === '3'" disabled type="success">已使用</el-button>-->
<!--            <el-button v-if="item.state === '4'" disabled>已退款</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->

    <!-- 展示订单信息 -->
    <el-row
      v-for="(item, index) in orderList"
      :key="index"
      v-if="index % 3 === 0"
      style="margin-bottom: 30px;margin-top: 15px">
      <el-col :span="7" v-for="(item, i) in sublist(index)" v-if="item" :key="i" :offset="i > 0 ? 1 : 0" style="padding-left: 50px">
        <!--  门票订单      -->
        <el-card :body-style="{ padding: '0px' }" shadow="hover" v-if="item.orderRecord.ticketType">
          <img :src="item.orderDetail.spotPhoto64DTOS[0].base64data" class="image" :alt="item.orderDetail.spotDTO.name">
          <div style="padding: 14px;">
            <span>{{item.orderDetail.spotDTO.name}}</span>
            <div class="bottom">
              <time class="time">{{ item.orderRecord.time }}</time>
              <el-button type="text" class="button" @click="handleOrderDetail(item)">详细信息</el-button>
            </div>
          </div>
        </el-card>
        <!--  服务订单      -->
        <el-card :body-style="{ padding: '0px' }" shadow="hover" v-else>
          <img :src="item.orderDetail.image" class="image" :alt="item.orderDetail.name">
          <div style="padding: 14px;">
            <span>{{item.orderDetail.name}}</span>
            <div class="bottom">
              <time class="time">{{ item.orderRecord.time }}</time>
              <el-button type="text" class="button" @click="handleOrderDetail(item)">详细信息</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单详细信息   -->
    <el-dialog title="订单信息" :visible.sync="orderDetailDialogVisible">

      <!--  门票信息    -->
      <div v-if="travelOrderVisible">
        <el-row>
          <el-col :span="8" style="text-align: left">
            景点名称: {{ orderDetail ? orderDetail.orderDetail.spotDTO.name : '' }}
          </el-col>
          <el-col :offset="8" :span="8" style="text-align: right">
            订单状态: {{ orderState[orderDetail ?  orderDetail.orderRecord.state  : 1].state }}
          </el-col>
        </el-row>
        <el-row>
          <img :src="orderDetail ? orderDetail.orderDetail.spotPhoto64DTOS[0].base64data : '' "
               style="width: 100%; height: 300px;"
               :alt="orderDetail ? orderDetail.orderDetail.spotDTO.name : '' ">
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            订单时间: {{ orderDetail ? orderDetail.orderRecord.time : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            预定日期: {{ orderDetail ? orderDetail.orderRecord.orderDate : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            详细信息:
          </el-col>
          <el-col :offset="2">
            成人票 ×{{ orderDetail ? orderDetail.orderRecord.adultNum : '' }}
            <br>
            学生票 ×{{ orderDetail ? orderDetail.orderRecord.studentNum : '' }}
            <br>
            儿童票 ×{{ orderDetail ? orderDetail.orderRecord.childNum : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="4">
            原价: <del>{{ orderDetail ? orderDetail.orderRecord.oldPrice : '' }}</del>
          </el-col>
          <el-col :span="4">
            折扣价: {{ orderDetail ? orderDetail.orderRecord.price : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-button
              @click="pay(orderDetail ? orderDetail.orderRecord.id : '')"
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '3'" type="primary">支付</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '1'"
              @click="refund(orderDetail ? orderDetail.orderRecord.id : '')" type="warning">退款</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '2'"
              @click="toComment(orderDetail ? orderDetail : '')"
              type="success">去评价</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '4'"
              disabled>已退款</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </div>

      <!--  服务信息    -->
      <div v-else>
        <el-row>
          <el-col :span="8" style="text-align: left">
            公司名称: {{ orderDetail ? orderDetail.orderDetail.name : '' }}
          </el-col>
          <el-col :offset="8" :span="8" style="text-align: right">
            订单状态: {{ orderState[orderDetail ?  orderDetail.orderRecord.state  : 1].state }}
          </el-col>
        </el-row>
        <el-row>
          <img :src="orderDetail ? orderDetail.orderDetail.image : '' "
               style="width: 100%; height: 300px;"
               :alt="orderDetail ? orderDetail.orderDetail.name : '' ">
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            订单时间: {{ orderDetail ? orderDetail.orderRecord.time : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            预定日期: {{ orderDetail ? orderDetail.orderRecord.orderDate : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="8">
            数量 ×{{ orderDetail ? orderDetail.orderRecord.num : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="4">
            价格: {{ orderDetail ? orderDetail.orderRecord.price : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-button
              @click="pay(orderDetail ? orderDetail.orderRecord.id : '')"
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '3'" type="primary">支付</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '1'"
              @click="refund(orderDetail ? orderDetail.orderRecord.id : '')" type="warning">退款</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '2'"
              @click="toComment(orderDetail ? orderDetail : '')"
              type="success">去评价</el-button>
            <el-button
              v-if="(orderDetail ? orderDetail.orderRecord.state : '') === '4'"
              disabled>已退款</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import {
    getNormalOrder, payCompanyOrder,
    payTravelOrder, refundCompanyOrder, refundTravelOrder
  } from "../../api/order";
  import {SPOT_ID, USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        orderList: [],
        spotForm: {
          name: '',
          id: ''
        },
        userEmail: '',
        orderDetailDialogVisible: false,
        travelOrderVisible: false,
        companyOrderVisible: false,
        orderDetail: '',
        orderState: [
          {
            state: ''
          },
          {
            state: '已消费'
          },
          {
            state: '待消费'
          },
          {
            state: '待付款'
          },
          {
            state: '已退款'
          }
        ]
      }
    },
    methods: {
      //获取该用户订单列表
      getOrderList() {
        getNormalOrder({userEmail: this.userEmail})
          .then( res => {
            console.log(res);
            this.orderList = res.data.data
          })
      },
      sublist(index) {
        let sublist = [];
        sublist[0] = this.orderList[index];
        sublist[1] = this.orderList[index+1];
        sublist[2] = this.orderList[index+2];
        return sublist
      },
      //显示订单详情
      handleOrderDetail(item) {
        this.orderDetailDialogVisible = true;
        if (item.orderRecord.ticketType) {
          this.travelOrderVisible = true;
          this.companyOrderVisible = false
        } else {
          this.travelOrderVisible = false;
          this.companyOrderVisible = true
        }
        this.orderDetail = item
      },
      //退款
      refund(id) {
        this.$confirm('是否确定退款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.travelOrderVisible) {
            refundTravelOrder({id: id})
              .then( res => {
                if (res.data.code === '100') {
                  this.$message({
                    message: '已退款',
                    type: 'success',
                    center: true
                  });
                  this.getOrderList();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                    center:true
                  })
                }
                this.cancel()
              })
          } else {
            refundCompanyOrder({id: id})
              .then( res => {
                if (res.data.code === '100') {
                  this.$message({
                    message: '已退款',
                    type: 'success',
                    center: true
                  });
                  this.getOrderList();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                    center:true
                  })
                }
                this.cancel()
              })
          }
        })
      },
      //支付
      pay(id) {
        if (this.travelOrderVisible) {
          payTravelOrder({id: id})
            .then( res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '支付成功',
                  type: 'success',
                  center: true
                });
                this.getOrderList();
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center:true
                })
              }
              this.cancel()
            })
        } else {
          payCompanyOrder({id: id})
            .then( res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '支付成功',
                  type: 'success',
                  center: true
                });
                this.getOrderList();
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center:true
                })
              }
              this.cancel()
            })
        }
      },
      //去评价
      toComment(orderDetail) {
        if (this.travelOrderVisible) {
          sessionStorage.setItem(SPOT_ID, orderDetail.orderDetail.spotDTO.id)
        } else {
          sessionStorage.setItem(SPOT_ID, orderDetail.orderDetail.spotId)
        }
        this.$router.push({name: 'spotNavComment'})
      },
      cancel() {
        this.travelOrderVisible = false;
        this.companyOrderVisible = false;
        this.orderDetailDialogVisible = false;
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.getOrderList();
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    display: block;
  }
  .text-align {
    text-align: left;
  }
  .font-size {
    font-size: 14px;
  }
  .text-align-right {
    text-align: right;
  }
  .text-align-center {
    text-align: center;
  }
  .overflow {
    overflow: scroll;
  }
  .item-img {
    width: 100px;
    height: 100px;
  }
  .item-img-position {
    float: left;
    width: 40%;
  }
  .item-font-margin-top {
    margin-top: 40px;
  }
  .item-button-margin-top {
    margin-top: 30px;
  }
  .font-grey {
    color: rgba(179,160,160,1)
  }
  .item-float-left {
    float: left;
  }
  .item-font-weight {
    font-weight: 700;
  }
  .bg-grey {
    background-color: #1B253A;
  }
  .font-grey-light {
    color: rgba(172,149,149,1);
  }
  .font-size-large {
    font-size: large;
  }
  .bg-height {
    height: 50px;
  }
  .title-margin-top {
    margin-top: 13px;
  }
</style>
