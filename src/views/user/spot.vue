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

    <!-- 表格 -->
    <div class="Table-table">
      <!--  热门景点表格    -->
      <el-table
        id="tableHotThree"
        :data="tableForm"
        ref="tableForm"
        height="500"
        border
        stripe
        @row-click="handleClick"
        v-if="hotThreeVisible">
        <el-table-column
          label="图片"
          width="100">
          <template slot-scope="scope">
            <img
              style="width:80px;height:80px;border:none;"
              :src="scope.row.record.spotPhoto64DTOS[0].base64data"
              class="image"
              :alt="scope.row.record.spotDTO.name">
          </template>
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.name"
          label="景区名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.cid"
          label="景区地区"
          width="100">
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.seat"
          label="具体位置"
          width="100">
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.introduce"
          label="景区简介"
          width="150">
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.phone"
          label="电话"
          width="150">
        </el-table-column>
        <el-table-column
          prop="record.spotDTO.maxNum"
          label="最高接待量"
          width="100"
          sortable>
        </el-table-column>
      </el-table>

      <!-- 普通景点表格     -->
      <el-table
        v-else
        id="table"
        :data="tableForm"
        ref="tableForm"
        border
        stripe
        @row-click="handleClick">
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
        this.selectedSpotId = '';
        getSpotByCid({cid: this.selectedCityId})
          .then(res => {
            // console.log(res);
            this.hotThreeVisible = false;
            this.tableForm = res.data.data
          })
      },
      //获取三个热门景点
      getThreeHotSpot() {
        getThreeHotSpot()
          .then( res => {
            this.tableForm = res.data.data
          })
      },
      handleClick(row) {
        if (this.hotThreeVisible) {
          sessionStorage.setItem(SPOT_ID, row.record.spotDTO.id)
        } else {
          sessionStorage.setItem(SPOT_ID, row.spotDTO.id);
        }
        this.$router.push({name: 'spotNavSpotInfo'})
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
</style>

