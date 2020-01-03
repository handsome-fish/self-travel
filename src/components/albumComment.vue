<template>
  <div>
    <el-col :offset="2" class="text-align">
      <div class="item" v-for="item in comment">
        <el-row :gutter="20">
          <el-col :span="4" class="font-size-small text-align-right">
            <i class="el-icon-user">
            </i>{{album.detail.name}}
          </el-col>
          <el-col :span="4" class="font-size-small">
            {{item.time}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4" class="text-align font-size-small">
            <p>{{item.content}}</p>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </div>
</template>

<script>
    import {getCommentByAlbumID} from "../api/album";

    export default {
      name: "albumComment",
      props: [
        'album',
        'albumId'
      ],
      data() {
        return {
          comment: []
        }
      },
      methods: {
        //获取评论
        getCommentByAlbumID() {
          getCommentByAlbumID({objId: this.albumId})
            .then(res => {
              if (res.data.code === '100') {
                this.comment = res.data.data;
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
      created() {
        this.getCommentByAlbumID()
      }
    }
</script>

<style scoped>
  .text-align {
    text-align: left;
  }
  .text-align-right {
    text-align: right;
  }
  .font-size-small {
    font-size: 10px;
  }
  .item {
    margin-bottom: 10px;
  }
</style>
