<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table :data="tableForm" ref="tableForm" height="500" border stripe>
        <el-table-column
          label="图片"
          width="100">
          <template slot-scope="scope">
            <img
              style="width:80px;height:80px;border:none;"
              :src="scope.row.spotPhoto64DTOS[0].base64data"
              class="image"
              :alt="scope.row.spotDTO.name">
          </template>
        </el-table-column>
        <el-table-column
          prop="spotDTO.name"
          label="景区名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.cid"
          label="景区地区"
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.seat"
          label="具体位置"
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.introduce"
          label="景区简介"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.phone"
          label="电话"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.maxNum"
          label="最高接待量"
          width="100"
          sortable>
        </el-table-column>
      </el-table>
    </div>

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
        tableForm: [],
        formLabelWidth: '120px',
        spotID: ''
      }
    },
    methods: {
      //获取景区
      getSpot() {
        getSpotInfo({id: this.spotID})
          .then(res => {
            console.log(res);
            let arr = [];
            arr.push(res.data.data);
            console.log(arr);
            this.tableForm = arr
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

