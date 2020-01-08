<template>
  <div>
    <!-- 筛选条件   -->
    <div>
      <el-row :gutter="20" style="text-align: left">
        <el-col :span="6">
          省份:
          <el-select v-model="selectedProvinceId" placeholder="请选择省份" filterable @change="getCity">
            <el-option
              v-for="item in selectedProvinceOptions"
              :key="item.pid"
              :label="item.province"
              :value="item.pid">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          市区:
          <el-select v-model="selectedCityId" placeholder="请选择市区" filterable>
            <el-option
              v-for="item in selectedCityOptions"
              :key="item.city"
              :label="item.city"
              :value="item.city">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          人数:
          <el-input-number v-model="num" controls-position="right" :min="1" :max="10" placeholder="请输入人数">
          </el-input-number>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getRecommendation()">获取推荐</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="text-align: left; margin-top: 30px">
        <el-col :span="12">
          开始日期和结束日期:
          <el-date-picker
            v-model="startEnd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          预算价格(元):
          <el-input-number v-model="price" :controls="false" :min="30">
          </el-input-number>
        </el-col>
      </el-row>
    </div>

    <!-- 显示推荐方案 -->
    <div style="margin-top: 30px">
      <!--  找到方案    -->
      <el-collapse v-model="activeNames" v-if="recommendationVisible">
        <el-collapse-item v-for="(recommendation, index) in recommendations" :name="index+1" :key="index">
          <template slot="title">
            <span style="font-weight: bold; font-size: x-large;color: #2c3e50">推荐方案{{index+1}}</span>
            <el-button type="text" style="text-align: right; float: right" @click="handlePurchaseRecommendation(recommendation)">添加方案</el-button>
          </template>
          <el-row v-for="(item, index) in recommendation" style="margin-top: 20px" :key="index">
            <el-row>
              <el-col :offset="2" :span="4" style="text-align: left">
                <span style="font-weight: bold; font-size: large">Day{{item.dayId}}</span>
              </el-col>
              <el-col :span="6" style="float: right;">
                <span style="font-size: medium">参考价格(元):
                  <span style="color: rgba(172,18,21,1)">{{item.cost | currency('¥')}}</span>
                </span>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="5">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div slot="header">
                    <span>上午景点</span>
                  </div>
                  <img
                    :src="item.spotIdAM.spotPhoto64DTOS[0].base64data"
                    class="image"
                    :alt="item.spotIdAM.spotDTO.name"
                    @click="handleClickSpot(item.spotIdAM.spotDTO.id)">
                  <div style="padding: 14px;">
                    <span>{{item.spotIdAM.spotDTO.name}}</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div slot="header" v-if="item.companyIdAM.id">
                    <span>午餐饭店</span>
                  </div>
                  <div slot="header" v-else>
                    <span>无推荐饭店</span>
                  </div>
                  <img
                    v-if="item.companyIdAM.id"
                    :src="item.companyIdAM.image"
                    class="image"
                    :alt="item.companyIdAM.name"
                    @click="handleClickSpotService(item.companyIdAM.id)">
                  <div v-if="item.companyIdAM.id" style="padding: 14px;">
                    <span>{{item.companyIdAM.name}}</span>
                    <i class="el-icon-knife-fork" v-if="item.companyIdAM.type === 'restaurant'">
                    </i>
                    <i v-else class="el-icon-office-building">
                    </i>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div slot="header">
                    <span>下午景点</span>
                  </div>
                  <img
                    :src="item.spotIdPM.spotPhoto64DTOS[0].base64data"
                    class="image"
                    :alt="item.spotIdPM.spotDTO.name"
                    @click="handleClickSpot(item.spotIdPM.spotDTO.id)">
                  <div style="padding: 14px;">
                    <span>{{item.spotIdPM.spotDTO.name}}</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div slot="header" v-if="item.companyIdPM.id">
                    <span>晚上酒店</span>
                  </div>
                  <div slot="header" v-else>
                    <span>无推荐酒店</span>
                  </div>
                  <img
                    v-if="item.companyIdPM.id"
                    :src="item.companyIdPM.image"
                    class="image"
                    :alt="item.companyIdPM.name"
                    @click="handleClickSpotService(item.companyIdPM.id)">
                  <div v-if="item.companyIdPM.id" style="padding: 14px;">
                    <span>{{item.companyIdPM.name}}</span>
                    <i class="el-icon-knife-fork" v-if="item.companyIdPM.type === 'restaurant'">
                    </i>
                    <i v-else class="el-icon-office-building">
                    </i>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-row>
        </el-collapse-item>
      </el-collapse>

      <!--  未找到方案    -->
      <div v-else style="color: crimson; margin-top: 170px">
        未匹配到方案, 请重新查询!
      </div>
    </div>

    <!--加载   -->
    <div v-if="loading" style="margin-top: 200px">
      <div v-loading="loading"
           element-loading-text="努力推荐中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
      </div>
    </div>
  </div>
</template>

<script>
  import {SPOT_ID, USER_INFO} from "../../utils/constant";
  import {getCity, getProvince} from "../../api/location";
  import {getDetail, getRecommendation} from "../../api/user";
  import {getSpotInfo} from "../../api/spot";
  import {getCompanyByCompanyId} from "../../api/company";
  import {currency} from "../../utils/currency";
  import {newRecommendationOrder} from "../../api/order";

  export default {
    name: "recommendation",
    data() {
      return {
        userEmail: '',
        selectedProvinceOptions: [],
        selectedCityOptions: [],
        selectedProvinceId: '',
        selectedCityId: '',
        num: '',
        startEnd: [],
        price: '',
        recommendations: [],
        // recommendation: [],
        loading: false,
        activeNames: '1',
        recommendationVisible: true,
        // isComplete: false,
        // spotAMComplete: false,
        // spotPMComplete: false,
        // companyAMComplete: false,
        // companyPMComplete: false
      }
    },
    methods: {
      //获取省份信息
      getProvince() {
        getProvince()
          .then(res => {
            this.selectedProvinceOptions = res.data.data
          })
      },
      //获取城市信息
      getCity() {
        this.selectedCityId = '';
        getCity({pid: this.selectedProvinceId})
          .then(res => {
            this.selectedCityOptions = res.data.data
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
      //将Date转成Date+n天的Date String
      getDateStrByDateAndDays(date, days) {
        if (!days) {
          days = 1;
        }
        console.log(date);
        date.setDate(date.getDate() + days);
        console.log(date);
        return this.getDateStrByDate(date)
      },
      //获取推荐方案
      getRecommendation() {
        this.loading = true;
        this.recommendationVisible = true;
        //入参
        let recommendForm = {
          userEmail: this.userEmail,
          city: this.selectedCityId,
          num: this.num ? 1 : this.num,
          startDate: this.getDateStrByDate(this.startEnd[0]),
          endDate: this.getDateStrByDate(this.startEnd[1]),
          money: this.price
        };
        getDetail(recommendForm)
          .then(res => {
            if (res.data.data.length === 0) {
              this.recommendationVisible = false;
            } else {
              this.recommendations = res.data.data;
              // console.log(this.recommendations)
            }
            this.loading = false;
          })
        // getRecommendation(recommendForm)
        //   .then(res => {
        //     //组装详细数据
        //     // this.recommendations = res.data.data;
        //     this.recommendations = [];
        //     if (res.data.data.length === 0) {
        //       this.recommendationVisible = false;
        //     } else {
        //       for (let resIndex = 0; resIndex < res.data.data.length; resIndex++) {
        //         let root = res.data.data[resIndex];
        //         console.log(root);
        //         // 是否完成组装一个commendation
        //         // let isComplete = false;
        //         for (let rootIndex = 0; rootIndex < root.length; rootIndex++) {
        //           this.spotAMComplete = false;
        //           this.spotPMComplete = false;
        //           this.companyAMComplete = false;
        //           this.companyPMComplete = false;
        //           let val = root[rootIndex];
        //           console.log(val);
        //           this.getRecommendationDetail(val);
        //         }
        //
        //         console.log(this.recommendation);
        //         this.recommendations.push(this.recommendation);
        //         this.recommendation = [];
        //
        //       }
        //     }
        //     this.loading = false;
        //   })
      },
      //获取方案详情
      getRecommendationDetail(val) {
        let spotIdAM = '', companyIdAM = '', spotIdPM = '', companyIdPM = '';
        for (;!(this.spotAMComplete && this.spotPMComplete && this.companyAMComplete && this.companyPMComplete);) {
          getSpotInfo({id: val.spotIdAM})
            .then(spotAM => {
              spotIdAM = spotAM.data.data;
              this.spotAMComplete = true;
            });
          //val.companyIdAM/PM 可能为空
          if (!val.companyIdAM) {
            companyIdAM = {
              type: 0,
              message: '无匹配饭店'
            };
            this.companyAMComplete = true;
          } else {
            getCompanyByCompanyId({companyId: val.companyIdAM})
              .then(companyAM => {
                companyIdAM = companyAM.data.data;
                this.companyAMComplete = true;
              });
          }
          getSpotInfo({id: val.spotIdPM})
            .then(spotPM => {
              spotIdPM = spotPM.data.data;
              this.spotPMComplete = true;
            });
          if (!val.companyIdPM) {
            companyIdPM = {
              type: 0,
              message: '无匹配酒店'
            };
            this.companyPMComplete = true;
          } else {
            getCompanyByCompanyId({companyId: val.companyIdPM})
              .then(companyPM => {
                companyIdPM = companyPM.data.data;
                this.companyPMComplete = true
              });
          }
        }
        this.recommendation.push({
            dayId: val.dayId,
            spotIdAM: spotIdAM,
            companyIdAM: companyIdAM,
            spotIdPM: spotIdPM,
            companyIdPM: companyIdPM,
            cost: val.cost
          });
      },
      // getRecommendationDetail(val) {
      //   let spotIdAM = '', companyIdAM = '', spotIdPM = '', companyIdPM = '';
      //   getSpotInfo({id: val.spotIdAM})
      //     .then(spotAM => {
      //       spotIdAM = spotAM.data.data;
      //       //val.companyIdAM/PM 可能为空
      //       if (!val.companyIdAM) {
      //         companyIdAM = {
      //           type: 0,
      //           message: '无匹配饭店'
      //         };
      //         if (!val.companyIdPM) {
      //           companyIdPM = {
      //             type: 0,
      //             message: '无匹配酒店'
      //           };
      //           getSpotInfo({id: val.spotIdPM})
      //             .then(spotPM => {
      //               spotIdPM = spotPM.data.data;
      //               this.recommendation.push({
      //                 dayId: val.dayId,
      //                 spotIdAM: spotIdAM,
      //                 companyIdAM: companyIdAM,
      //                 spotIdPM: spotIdPM,
      //                 companyIdPM: companyIdPM,
      //                 cost: val.cost
      //               });
      //               // isComplete = true;
      //               // console.log(recommendation)
      //             });
      //         } else {
      //           getCompanyByCompanyId({companyId: val.companyIdPM})
      //             .then(companyPM => {
      //               companyIdPM = companyPM.data.data;
      //               getSpotInfo({id: val.spotIdPM})
      //                 .then(spotPM => {
      //                   spotIdPM = spotPM.data.data;
      //                   this.recommendation.push({
      //                     dayId: val.dayId,
      //                     spotIdAM: spotIdAM,
      //                     companyIdAM: companyIdAM,
      //                     spotIdPM: spotIdPM,
      //                     companyIdPM: companyIdPM,
      //                     cost: val.cost
      //                   });
      //                   // isComplete = true;
      //                 });
      //             });
      //         }
      //       } else {
      //         getCompanyByCompanyId({companyId: val.companyIdAM})
      //           .then(companyAM => {
      //             companyIdAM = companyAM.data.data;
      //             if (!val.companyIdPM) {
      //               companyIdPM = {
      //                 type: 0,
      //                 message: '无匹配酒店'
      //               };
      //               getSpotInfo({id: val.spotIdPM})
      //                 .then(spotPM => {
      //                   spotIdPM = spotPM.data.data;
      //                   this.recommendation.push({
      //                     dayId: val.dayId,
      //                     spotIdAM: spotIdAM,
      //                     companyIdAM: companyIdAM,
      //                     spotIdPM: spotIdPM,
      //                     companyIdPM: companyIdPM,
      //                     cost: val.cost
      //                   });
      //                   // isComplete = true;
      //                 });
      //             } else {
      //               getCompanyByCompanyId({companyId: val.companyIdPM})
      //                 .then(companyPM => {
      //                   companyIdPM = companyPM.data.data;
      //                   getSpotInfo({id: val.spotIdPM})
      //                     .then(spotPM => {
      //                       spotIdPM = spotPM.data.data;
      //                       this.recommendation.push({
      //                         dayId: val.dayId,
      //                         spotIdAM: spotIdAM,
      //                         companyIdAM: companyIdAM,
      //                         spotIdPM: spotIdPM,
      //                         companyIdPM: companyIdPM,
      //                         cost: val.cost
      //                       });
      //                       // isComplete = true;
      //                       // console.log(this.recommendation)
      //                     });
      //                 });
      //             }
      //           });
      //       }
      //     });
      // },
      handleClickSpot(id) {
        sessionStorage.setItem(SPOT_ID, id);
        this.$router.push({name: 'spotNavSpotInfo'})
      },
      handleClickSpotService(id) {
        sessionStorage.setItem(SPOT_ID, id);
        this.$router.push({name: 'spotNavSpotService'})
      },
      //处理方案入参
      handlePurchaseRecommendation(recommendation) {
        this.$confirm('是否确认将该方案加入购物车?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //组装入参
          let recommendationOrder = [], orderDate = '', spotIdAM = '', companyIdAM = '',
            spotIdPM = '', companyIdPM = '', userEmail = '', num = '';
          recommendation.forEach((val) => {
            orderDate = this.getDateStrByDateAndDays(this.startEnd[0], val.dayId);
            spotIdAM = val.spotIdAM.spotDTO.id;
            companyIdAM = val.companyIdAM.id;
            spotIdPM = val.spotIdPM.spotDTO.id;
            companyIdPM = val.companyIdPM.id;
            userEmail = this.userEmail;
            num = this.num;
            recommendationOrder.push({
              orderDate: orderDate,
              spotIdAM: spotIdAM,
              companyIdAM: companyIdAM,
              spotIdPM: spotIdPM,
              companyIdPM: companyIdPM,
              userEmail: userEmail,
              num: num
            });
          });
          console.log('recommendationOrder');
          console.log(recommendationOrder);
          this.purchaseRecommendation(recommendationOrder)
        })
      },
      //将方案加入购物车
      purchaseRecommendation(recommendationOrder) {
        newRecommendationOrder({list: recommendationOrder})
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '加入成功',
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
          })
      }
    },
    filters: {
      currency: currency
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      if (!this.userEmail) {
        this.$router.push({name: 'login'})
      }
      this.getProvince();
    }
  }
</script>

<style scoped>
  .image {
    width: 100%;
    height: 200px;
    display: block;
  }
</style>
