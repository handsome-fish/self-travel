<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border>
        <el-table-column
          prop="id"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          width="150">
        </el-table-column>
        <el-table-column
          prop="time"
          label="评论时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userEmail"
          label="评论者邮箱"
          width="100">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       @click="handleDelete(scope.row)"
                       icon="el-icon-delete">删除该评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {
    getCommentBySpotID,
    delComment
  } from "../../api/album";
  import {USER_INFO} from "../../utils/constant";
  import {getSpotByUserEmail} from "../../api/spot";
  import {getTicket} from "../../api/ticket";

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
          getCommentBySpotID({spotId: this.spotID})
            .then(res => {
              this.tableForm = res.data.data
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
          delComment(row.id).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '删除成功',
                type: 'success',
                center: true
              });
              this.getData()
            }
            else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
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

