<template>
  <div>

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
<!--        <ul class="question-item-li" v-for="(question_item, index) in questionList">-->
<!--          <div class="listen">-->
<!--            <i class="el-icon-user"></i>{{question_item.userEmail}}el-icon-watch-->
<!--          </div>-->
<!--        </ul>-->
        <ul class="box item"
            v-for="(question_item, index) in questionList"
            :index="index"
            :key="question_item.id"
            style="list-style: none">
          <li class="left">
            <i class="el-icon-user">
            </i>{{question_item.userEmail}}
          </li>
          <li class="right">
            <span>{{question_item.content}}</span>
            <p>{{question_item.time}}</p>
          </li>
          <i class="el-icon-s-comment">
          </i>
          <el-button  type="text" @click="handleReply(question_item.id)">回复</el-button>
          <i class="el-icon-tickets">
          </i>
          <el-button @click="getReplyByQuestionID(question_item.id)" type="text">查看回复</el-button>
          <ul v-for="(reply_item, index) in replyList[question_item.id]"
              :index="index"
              :key="reply_item.id"
              v-if="replyListVisible[question_item.id]"
              style="list-style: none">
            <li class="left">
              <i class="el-icon-user">
              </i>{{reply_item.userEmail}}
            </li>
            <li class="right">
              <span>{{reply_item.content}}</span>
              <p>{{reply_item.time}}</p>
            </li>
          </ul>
        </ul>
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
    getAnswerByQuestionID,
    getAnswers
  } from "../../../api/user";
  import {SPOT_ID, USER_INFO} from "../../../utils/constant";

  export default {
    data() {
      return {
        activeName: '1',
        textarea: '',
        userEmail: '',
        spotID: '',
        questionList: [],
        replyListVisible: [false],
        replyList: [[]],
        replyFormVisible: false, //回复窗口
        replyForm: {
          content: '',
          objId: '',
          time: '',
          userEmail: ''
        }
      }
    },
    methods: {
      addQuestion() {
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
              this.textarea = ''
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
      },
      getData() {
        getAllQuestions({spotId: this.spotID})
          .then(res => {
            // console.log('getQuestionBySpotId');
            // console.log(res);
            this.questionList = res.data.data;
          })
      },
      handleReply(id) {
        this.replyFormVisible = true;
        this.replyForm.userEmail = this.userEmail;
        this.replyForm.time = this.getTimeStrByDate(new Date());
        this.replyForm.objId = id
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
              this.replyFormVisible = false
              this.getData()
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                center: true
              })
            }
          })
      },
      getReplyByQuestionID(id) {
        getAnswers({objId:id})
          .then(res => {
            console.log('replyList');
            console.log(res);
            this.replyList[id] = res.data.data;
            console.log(this.replyList);
            console.log(this.replyListVisible);
            this.replyListVisible[id] = true
          })
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

 .item {
   margin-bottom: 10px;
 }

  /*.box {*/
  /*margin-bottom: 15px;*/
  /*}*/

  /*.left {*/
  /*  margin-bottom: 15px;*/
  /*  width: 30px;*/
  /*  height: 30px;*/
  /*  float: left;*/
  /*}*/

  /*.right {*/
  /*  margin-bottom: 15px;*/
  /*  float: left;*/
  /*  width: 90%;*/
  /*  padding-left: 10px;*/
  /*  box-sizing: border-box;*/
  /*}*/
</style>
