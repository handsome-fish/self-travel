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
        <el-select v-model="selectedCityId" placeholder="请选择市区" filterable>
          <el-option
            v-for="item in selectedCityOptions"
            :key="item.city"
            :label="item.city"
            :value="item.city">
          </el-option>
        </el-select>
        <el-button type="primary" @click="getSpotByCid()">查询景点</el-button>
      </template>
    </el-row>

    <!-- 景点概略信息 -->
    <el-row
      v-for="(item, index) in tableForm"
      :key="index"
      v-if="index % 3 === 0"
      style="margin-bottom: 30px;margin-top: 15px">
      <el-col :span="7" v-for="(item, i) in sublist(index)" v-if="item" :key="i" :offset="i > 0 ? 1 : 0" style="padding-left: 50px">
        <!--  热门景点信息    -->
        <el-card :body-style="{ padding: '0px' }" shadow="hover" v-if="hotThreeVisible">
          <img :src="item.record.spotPhoto64DTOS[0].base64data" class="image" :alt="item.record.spotDTO.name" @click="handleClick(item)">
          <div style="padding: 14px;">
            <span>{{item.record.spotDTO.name}}</span>
            <div style="text-align: right">
              <span class="time">点赞量: {{item.detail}}</span>
            </div>
          </div>
        </el-card>
        <!--  普通景点信息     -->
        <el-card :body-style="{ padding: '0px' }" shadow="hover" v-else>
          <img :src="item.spotPhoto64DTOS[0].base64data" class="image" :alt="item.spotDTO.name" @click="handleClick(item)">
          <div style="padding: 14px;">
            <span>{{item.spotDTO.name}}</span>
            <div style="text-align: right">
              <span class="time">容量: {{item.spotDTO.maxNum}}</span>
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
    addSpot,
    delSpot,
    modSpot,
    getSpot,
    getAllSpot,
    getSpotByCid,
    getSpotInfo,
    getThreeHotSpot
  } from "../../api/spot"
  import {getCity, getProvince} from "../../api/location";
  import {SPOT_ID} from "../../utils/constant";

  export default {
    data() {
      return {
        loading: true,
        tableForm: [],
        formLabelWidth: '120px',
        selectedProvinceOptions: [],
        selectedCityOptions: [],
        selectedSpotOptions: [],
        selectedSpotId: '',
        selectedProvinceId: '',
        selectedCityId: '',
        hotThreeVisible: true
      }
    },
    methods: {
      //获取省份信息
      getProvince() {
        getProvince()
          .then(res => {
            // console.log(res);
            this.selectedProvinceOptions = res.data.data
          })
      },
      //获取城市信息
      getCity() {
        this.selectedCityId = '';
        this.selectedSpotId = '';
        getCity({pid: this.selectedProvinceId})
          .then(res => {
            this.selectedCityOptions = res.data.data
          })
      },
      //获取景区
      getSpotByCid() {
        this.loading = true;
        this.tableForm = [];
        this.selectedSpotId = '';
        getSpotByCid({cid: this.selectedCityId})
          .then(res => {
            // console.log(res);
            this.hotThreeVisible = false;
            this.loading = false;
            this.tableForm = res.data.data
          })
      },
      //获取三个热门景点
      getThreeHotSpot() {
        getThreeHotSpot()
          .then( res => {
            this.loading =false;
            this.tableForm = res.data.data
          })
      },
      handleClick(item) {
        if (this.hotThreeVisible) {
          sessionStorage.setItem(SPOT_ID, item.record.spotDTO.id)
        } else {
          sessionStorage.setItem(SPOT_ID, item.spotDTO.id);
        }
        this.$router.push({name: 'spotNavSpotInfo'})
      },
      sublist(index) {
        let sublist = [];
        sublist[0] = this.tableForm[index];
        sublist[1] = this.tableForm[index+1];
        sublist[2] = this.tableForm[index+2];
        return sublist
      }
    },
    created() {
      this.getProvince();
      this.getThreeHotSpot()
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
    height: 250px;
    display: block;
  }
</style>

