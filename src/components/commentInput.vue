<template>
  <div>
    <el-col :offset="2" :span="8" class="text-align">
      <el-input v-model="commentForm.content"
                placeholder="请输入评论信息"
                type="textarea"
                :autosize='{ minRows: 2, maxRows: 3}'>
      </el-input>
      <el-row :gutter="20">
        <el-col :span="8" :offset="10" style="text-align: right">
          <el-button type="primary" @click="addComment(album)">
            发表
          </el-button>
        </el-col>
        <el-col :span="4"  style="text-align: right">
          <el-button @click="cancel">
            取消
          </el-button>
        </el-col>
      </el-row>
    </el-col>

  </div>
</template>

<script>
    export default {
      name: "commentInput",
      props: [
        'album',
        'userEmail'
      ],
      data() {
        return {
          commentForm: {
            content: '',
            time: '',
            objId: '',
            userEmail: ''
          }
        }
      },
      methods: {
        //将Date转成Datetime String
        getTimeStrByDate(date) {
          let y = date.getFullYear();
          let M = date.getMonth() + 1;
          let d = date.getDate();
          let H = date.getHours();
          let m = date.getMinutes();
          let s = date.getSeconds();
          return y + '-' + (M < 10 ? ('0' + M) : M) + '-' +
            (d < 10 ? ('0' + d) : d) + " " + (H < 10 ? ('0' + H) : H) + ":" +
            (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s)
        },
        //添加评论
        addComment(album) {
          this.commentForm.objId = album.record.id;
          this.commentForm.time = this.getTimeStrByDate(new Date());
          this.commentForm.userEmail = this.userEmail;
          if (!this.commentForm.content) {
            this.$message({
              message: '评论不能为空',
              type: 'error',
              center: true
            });
          } else {
            console.log(this.commentForm);
            this.$emit('comment', this.commentForm);
          }
        },
        cancel() {
          this.commentForm.content = '';
        },
      }
    }
</script>

<style scoped>
  .text-align {
    text-align: left;
  }
</style>
