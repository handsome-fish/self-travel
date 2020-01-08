<template>
  <div>
    <el-col :offset="2" class="text-align">
      <div class="item" v-for="item in replyList">
        <el-row :gutter="20">
          <el-col :span="4" class="font-size-small text-align-right">
            <i class="el-icon-user">
            </i>{{item.userEmail}}
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
    import {getAnswers} from "../api/user";

    export default {
      name: "questionReply",
      props: [
        'replyList',
        'questionId'
      ],
      data() {
        return {
          replyList: []
        }
      },
      methods: {
        getReplyByQuestionId() {
          getAnswers({objId:this.questionId})
            .then(res => {
              console.log('replyList');
              console.log(res);
              this.replyList = res.data.data;
            })
        }
      },
      created() {
        this.getReplyByQuestionId()
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
