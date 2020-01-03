<template>
  <div>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8" style="text-align: left">
        <img
          style="width:250px;height:250px;border:none;"
          :src="tableForm.spotPhoto64DTOS[0].base64data"
          :alt="tableForm.spotDTO.name">
      </el-col>
      <el-col :span="8" style="text-align: left">
        <span style="font-weight: bold; ">简介:</span>
        <p>{{tableForm.spotDTO.introduce}}</p>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">热线电话:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{tableForm.spotDTO.phone}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">详细位置:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{tableForm.spotDTO.seat}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" :gutter="20">
      <el-col :offset="2" :span="2" style="text-align: right">
        <span style="font-weight: bold">接待量:</span>
      </el-col>
      <el-col :span="6" style="text-align: left;margin-top: 4px">
        <span >{{tableForm.spotDTO.maxNum}}</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    getSpotByCid,
    getSpotInfo
  } from "../../../api/spot";
  import {SPOT_ID} from "../../../utils/constant";

  export default {
    data() {
      return {
        tableForm: {},
        formLabelWidth: '120px',
        spotID: ''
      }
    },
    methods: {
      //获取景区
      getSpot() {
        getSpotInfo({id: this.spotID})
          .then(res => {
            this.tableForm = res.data.data
          })
      }
    },
    created() {
      this.spotID = sessionStorage.getItem(SPOT_ID);
      this.getSpot()
    }
  }
</script>
<style>
  .el-table td {
    padding: 0px;
  }
  .el-table th {
    padding: 0px;
  }
</style>

