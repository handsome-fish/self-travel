<template>
  <div>

    <!-- 景点服务概略信息 -->
    <el-row
      v-for="(item, index) in tableForm"
      :key="index"
      v-if="index % 3 === 0"
      style="margin-bottom: 30px;margin-top: 15px">
      <el-col :span="7" v-for="(item, i) in sublist(index)" v-if="item" :key="i" :offset="i > 0 ? 1 : 0" style="padding-left: 50px">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="item.image" class="image" :alt="item.name">
          <div style="padding: 14px;">
            <span>{{item.name}}</span>
            <i class="el-icon-knife-fork" v-if="item.type === 'restaurant'">
            </i>
            <i v-else class="el-icon-office-building">
            </i>
            <div style="text-align: right;line-height: 12px;">
              <el-button type="text" class="button" @click="handleServiceDetail(item)">详细信息</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--加载   -->
    <div v-if="loading" style="margin-top: 250px">
      <div v-loading="loading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getCompanyBySpotId
  } from "../../../api/company";
  import {COMPANY_ID, SPOT_ID, USER_INFO} from "../../../utils/constant";

  export default {
    data() {
      return {
        loading: true,
        tableForm: [],
        selectedSpotId: '',
        userEmail: '',
        serviceDetail: '',
        serviceDetailVisible: false
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getCompanyBySpotId({spotId: this.selectedSpotId}).then(res => {
          this.loading = false;
          this.tableForm = res.data.data;
          console.log(res)
        })
      },
      sublist(index) {
        let sublist = [];
        sublist[0] = this.tableForm[index];
        sublist[1] = this.tableForm[index+1];
        sublist[2] = this.tableForm[index+2];
        return sublist
      },
      handleServiceDetail(item) {
        sessionStorage.setItem(COMPANY_ID, item.id);
        this.$router.push({name: 'spotServiceDetail'})
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
  .image {
    width: 100%;
    display: block;
  }
  .el-table td {
    padding: 0px;
  }
  .el-table th {
    padding: 0px;
  }
</style>


