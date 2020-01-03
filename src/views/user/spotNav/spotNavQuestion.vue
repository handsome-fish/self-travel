<template>
  <div style="width: 90%">

    <el-collapse v-model="activeName" accordion @change="getData">
      <el-collapse-item name="1">
        <template slot="title">
          发表问题<i class="el-icon-question">
        </i>
        </template>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
          <el-button type="primary" @click="addQuestion" round size="large" class="button">发表问题</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="查看问题">
        <div class="item" v-for="(question_item, index) in questionList">
          <el-row :gutter="20">
            <el-col :span="4" class="font-size text-align-right">
              <i class="el-icon-user">
              </i>{{question_item.userEmail}}
            </el-col>
            <el-col :span="4" class="text-align time">
              {{question_item.time}}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="4" class="text-align font-size" style="color: brown">
              <p>{{question_item.content}}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="2" :offset="3" class="text-align-right">
              <el-button icon="el-icon-chat-dot-round" type="mini" @click="handleReply(question_item.id)">
              </el-button>
            </el-col>
            <el-col :span="2" class="text-align">
              <el-button icon="el-icon-more" type="mini" @click="getReplyByQuestionID(question_item.id)">
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="questionReplyVisible" class="bg-purple-light" style="margin-top: 20px">
            <span></span>
            <QuestionReply v-bind:question-id="question_item.id">
            </QuestionReply>
          </el-row>
          <el-row style="margin-top: 20px">
            <div class="tableTitle"></div>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 回复窗口 -->
    <el-dialog title="添加回复" :visible.sync="replyFormVisible">
      <el-form :model="replyForm" ref="replyForm">
        <el-form-item label="回复">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            placeholder="请输入回复内容"
            :autosize="{ minRows: 3, maxRows: 6}">
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="reply()">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

  import {
    addQuestion,
    getAllQuestions,
    addAnswer,
    getAnswers
  } from "../../../api/user";
  import {SPOT_ID, USER_INFO} from "../../../utils/constant";
  import questionReply from "../../../components/questionReply";

  export default {
    data() {
      return {
        activeName: '1',
        textarea: '',
        userEmail: '',
        spotID: '',
        questionList: [],
        replyFormVisible: false, //回复窗口
        replyForm: {
          content: '',
          objId: '',
          time: '',
          userEmail: ''
        },
        questionReplyVisible: false
      }
    },
    methods: {
      addQuestion() {
        if (!this.textarea) {
          this.$alert('不能为空!')
        } else {
          let addForm = {
            content: this.textarea,
            time: this.getTimeStrByDate(new Date()),
            userEmail: this.userEmail,
            spotId: this.spotID
          };
          addQuestion(addForm)
            .then(res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '问题添加成功',
                  type: 'success',
                  center: true
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
              this.textarea = ''
            })
        }
      },
      getData() {
        getAllQuestions({spotId: this.spotID})
          .then(res => {
            this.questionList = res.data.data;
          })
      },
      handleReply(id) {
        this.replyFormVisible = true;
        this.replyForm.userEmail = this.userEmail;
        this.replyForm.time = this.getTimeStrByDate(new Date());
        this.replyForm.objId = id;
        this.replyForm.content = ''
      },
      reply() {
        addAnswer(this.replyForm)
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '回复成功',
                type: 'success',
                center: true
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                center: true
              })
            }
            this.replyFormVisible = false;
            this.getData()
          })
      },
      getReplyByQuestionID(id) {
        this.questionReplyVisible = !this.questionReplyVisible;
      },
      getDateByTimeStr(timeStr) {
        let timeArr = timeStr.split(" ");
        let d = timeArr[0].split("-");
        let t = timeArr[1].split(":");
        return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
      },
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
      cancel() {
        this.replyFormVisible = false
      }
    },
    components: {
      QuestionReply: questionReply
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.spotID = sessionStorage.getItem(SPOT_ID)
    }
  }
</script>

<style scoped>
  .button {
  margin: 10px;
  }

 .question-item-li {
   padding: 5px;
 }
  .text-align {
    text-align: left;
  }
  .font-size {
    font-size: 15px;
  }
  .text-align-right {
    text-align: right;
  }
 .item {
   margin-bottom: 30px;
 }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 90%;
    height: 1px;
    background-color: #d4d4d4;
    text-align: left;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }

</style>
