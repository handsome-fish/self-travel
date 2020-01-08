<template>
  <div class="back">
    <div class="registerMode">
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px" class="demo-ruleForm login-page" >
        <el-form-item prop="email">
          <el-col :span="10">
            <el-input id="email" v-model="registerForm.email" placeholder="请输入邮箱">
              <template slot="prepend">邮箱</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="name">
          <el-col :span="10">
            <el-input id="name" v-model="registerForm.name" placeholder="请输入昵称">
              <template slot="prepend">昵称</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-col :span="10">
            <el-input id="password" v-model="registerForm.password" type="password" show-password placeholder="请输入密码">
              <template slot="prepend">密码</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="phone">
          <el-col :span="10">
            <el-input id="phone" v-model="registerForm.phone" placeholder="请输入手机号码">
              <template slot="prepend">手机号码</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="identity">
          <el-col :span="10">
            <el-input id="identity" v-model="registerForm.identity" placeholder="请输入身份证号码">
              <template slot="prepend">身份证号码</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="inputWords">
          <el-col :span="10">
            <el-input v-model="registerForm.inputWords" placeholder="请输入验证码">
              <el-button
                slot="append"
                v-on:click="sendMail"
                style="background-color: rgba(96,61,172,1); color: #1B253A"
                v-if="timeOver">{{buttonValue}}</el-button>
              <el-button
                slot="append"
                style="background-color: rgba(96,61,172,1); color: #1B253A"
                v-else disabled>{{curCount}}s后重新发送</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="10">
            <el-button id="register" v-on:click="register" style="width:100%" type="primary">注册</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="10">
            <el-button id="login" v-on:click="login" style="width:100%" type="success">去登陆</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    register, sendMail
  } from "../api/user";
  export default {
    data(){
      // 规则，用于前端验证邮箱是否合法
      const validateEmail = (rule, value, callback) => {
        let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!emailReg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        }
        else {
          callback()
        }
      };
      //验证手机号码是否合法
      const validatePhone = (rule, value, callback) => {
        let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!phoneReg.test(value)) {
          callback(new Error('手机格式不正确'))
        }
        else {
          callback()
        }
      };
      //验证身份证号是否合法
      const validateID = (rule, value, callback) => {
        //身份证号合法性验证
        //支持15位和18位身份证号
        //支持地址编码、出生日期、校验位验证
        let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};

        if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)){
          callback(new Error('身份证号格式错误'));
        } else if (!city[value.substr(0,2)]) {
          callback(new Error('身份证号地址编码错误'));
        } else {
          //18位身份证需要验证最后一位校验位
          if (value.length === 18) {
            callback();
          } else {
            callback(new Error('身份证号位数不对'));
          }
        }
      };
      return{
        registerForm:{
          email: '',
          name: '',
          password: '',
          phone: '',
          identity: '',
          type: 1,
          gold: undefined,
          inputWords: ''
        },
        rules:{
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: "blur" },
            { min: 3, max: 12, message: '密码由3-12位的字母数字下划线组成', trigger: "blur" }
          ],
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          identity: [
            { validator: validateID, trigger: 'blur'}
          ],
          inputWords: [
            { required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        },
        timeOver: true, //倒计时是否结束
        count: 180, //60秒
        curCount: 0, //当前剩余秒数
        buttonValue: '发送验证码', //按钮值
        InterValObj: '' //timer变量，控制时间

    }
    },
    methods:{
      register(){
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            register(this.registerForm).then(res=> {
              console.log(res);
              if(res.data.code === 'k106'){
                this.$message({
                  message: '注册成功，欢迎您' + this.registerForm.email,
                  type: 'success',
                  center: true
                });
                this.login()
              }
              else {
                this.$message({
                  message: '注册失败',
                  type: 'error',
                  center: true
                });
              }
            })
          } else {
            this.$message({
              message: '注册失败,请填写完整注册信息',
              type: 'error',
              center: true
            });
            return false;
          }
        });
      },
      //发送验证码
      sendMail() {
        if (!this.registerForm.email) {
          this.$message({
            message: '请先输入邮箱',
            type: 'error',
            center: true
          });
        } else {
          sendMail({email: this.registerForm.email})
            .then(res => {
              if (res.data.code === '100') {
                this.$message({
                  message: '已发送',
                  type: 'success',
                  center: true
                });
                this.timeOver = false;
                this.curCount = this.count;
                this.InterValObj = window.setInterval(this.setRemainTime, 1000); // 启动计时器timer处理函数，1秒执行一次
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                });
              }
            })
        }
      },
      //timer处理函数
      setRemainTime() {
        if (this.curCount === 0) {//超时重新获取验证码
          window.clearInterval(this.InterValObj);// 停止计时器
          this.buttonValue = '重获验证码';
          this.timeOver = true;
        } else {
          this.curCount--;
        }
      },
      login(){
        this.$router.push({name: 'login'})
      }
    }
  }
</script>

<style scoped>
  .registerMode{
    margin-left: 35%;
    margin-top: 6%;
  }
  .back{
    background: #1B253A url("../assets/images/back1.jpg") no-repeat;
    width: calc(100vw);
    height: calc(100vh);
    background-size: cover;
    overflow: hidden;
    position: relative;
  }
</style>
