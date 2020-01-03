<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border>
        <el-table-column
          prop="record.name"
          label="相册名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="record.introduce"
          label="相册简介"
          width="150">
        </el-table-column>
<!--        <el-table-column-->
<!--          label="相册图片"-->
<!--          width="200">-->
<!--          <template slot-scope="scope">-->
<!--            <img v-for="(item) in scope.record" :src="item" :alt="scope.record.name">-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       @click="handleDelete(scope.row)"
                       icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {
    delAlbumById,
    getAlbumBySpotID
  } from "../../api/album";
  import {USER_INFO} from "../../utils/constant";
  import {getSpotByUserEmail} from "../../api/spot";

  export default {
    data() {
      return {
        tableForm: [],
        userEmail: '',
        spotID: ''
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotByUserEmail({userEmail: this.userEmail}).then(res0 => {
          console.log(res0);
          this.spotID = res0.data.data[0].spotDTO.id;
          getAlbumBySpotID({spotId: this.spotID}).then(res => {
            this.tableForm = res.data.data;
            this.tableForm.forEach((val, index) => {
              console.log(val.record.base64Datas)
            })
          })
        })
      },
      //删除数据
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAlbumById({id: row.record.id}).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '删除成功',
                type: 'success',
                center: true
              });
            }
            else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
            this.getData()
          })
        })
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.getData()
    }
  }
</script>
<style>
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

