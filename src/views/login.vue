<template>
  <div class="back">
    <div class="demo-image"><el-image alt="logo" :src="logo" style="width: 400px; height: 150px"></el-image></div>
    <div class="loginMode">
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm login-page" >
<!--        <el-col class="title">系统登录</el-col>-->
        <el-form-item prop="email">
          <el-col :span="8">
            <el-input id="email" v-model="userForm.email" placeholder="请输入邮箱">
              <template slot="prepend">邮箱</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-col :span="8">
            <el-input id="password" v-model="userForm.password" type="password" show-password placeholder="请输入密码">
              <template slot="prepend">密码</template>
            </el-input>
          </el-col>
        </el-form-item>
<!--        <el-form-item  prop="validate">-->
<!--          <el-input v-model="userForm.validate" class="validate-code" placeholder="请输入验证码" >-->
<!--          </el-input>-->
<!--          <div class="code" @click="refreshCode">-->
<!--            <SIdentify :identifyCode="identifyCode">-->
<!--            </SIdentify>-->
<!--          </div>-->
<!--        </el-form-item>-->
        <el-form-item style="margin-top: -15px;" >
          <el-col :span="8">
            <el-checkbox v-model="checked" style="color: #a0a0a0; margin-top: -10px; float: left">记住密码</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <el-button id="login" v-on:click="login" style="width:100%" type="primary">登录</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <el-button id="register" v-on:click="register" style="width:100%" type="success">去注册</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    login
  } from "../api/user";
  import SIdentify from "../components/identify"
  import logo from "../assets/images/logo.jpg"
  import {
    USER_INFO
  } from "../utils/constant"
  export default {
    data(){
      // 规则，用于前端验证用户名是否合法
      const validateEmail = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入邮箱'))
        }
        else if(value.length > 32){
          callback(new Error('邮箱格式不正确'))
        }
        else {
          callback()
        }
      };
      return{
        logo,
        identifyCodes: "1234567890",
        identifyCode: "",
        checked: false,
        userForm:{
          email: '',
          password: '',
          validate: ''
        },
        rules:{
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: "blur" },
            { min: 3, max: 12, message: '密码由3-12位的字母数字下划线组成', trigger: "blur" }
          ],
          validate: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      SIdentify: SIdentify
    },
    mounted() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
      this.getCookie()
    },
    methods:{
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
            ];
        }
        console.log(this.identifyCode);
      },
      //设置cookie
      setCookie(param1, param2, exDays) {
        let exDate = new Date(); //获取时间
        exDate.setTime(exDate.getTime() + 24 * 60 * 60 * 1000 * exDays); //保存的天数
        //字符串拼接cookie
        window.document.cookie =
          "email" + "=" + param1 + ";path=/;expires=" + exDate.toGMTString();
        window.document.cookie =
          "password" + "=" + param2 + ";path=/;expires=" + exDate.toGMTString();
      },
      //清空cookie
      clearCookie() {
        this.setCookie("", "", -1)
      },
      //读取cookie
      getCookie() {
        if (document.cookie.length > 0) {
          let arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
          console.log(arr);
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split("="); //再次切割
            //判断查找相对应的值
            if (arr2[0] === "email") {
              this.userForm.email = arr2[1]; //保存到保存数据的地方
            } else if (arr2[0] === "password") {
              this.userForm.password = arr2[1];
            }
          }
          this.checked = true
        }
      },
      login(){
        // 前端设置规则验证，只有前端规则验证通过才会向后端发送请求
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            // if (this.userForm.validate === this.identifyCode) {
            if (1 === 1) {
              login(this.userForm).then(res=> {
                console.log(res);
                //记住密码存cookie
                if (this.checked === true) {
                  this.setCookie(this.userForm.email, this.userForm.password, 7)
                } else {
                  this.clearCookie()
                }
                if(res.data.code === '100'){
                  this.$message({
                    message: '登录成功，欢迎您' + this.userForm.email,
                    type: 'success',
                    center: true
                  });
                  //将用户信息存入session中
                  sessionStorage.setItem(USER_INFO, this.userForm.email);
                  if (res.data.data === '1') {
                    this.$router.push({name: 'spot'})
                  } else if (res.data.data === '2') {
                    this.$router.push({name: 'spotManage'})
                  } else {
                    this.$router.push({name: 'spotManageAdmin'})
                  }
                  // this.$router.push({name: 'admin'})
                }
                else if(res.data.code === 'k111'){
                  this.$message({
                    message: '该用户不存在',
                    type: 'error',
                    center: true
                  });
                }
                else {
                  this.$message({
                    message: '密码错误',
                    type: 'error',
                    center: true
                  });
                }
              })
            } else {
              this.$message({
                message: '验证码错误',
                type: 'error',
                center: true
              });
            }
          } else {
            this.$message({
              message: '登录失败,请填写完整登录信息',
              type: 'error',
              center: true
            });
            return false;
          }
        });
      },
      register(){
        this.$router.push({name: 'register'})
      }
    }
  }
</script>

<style scoped>
  .loginMode{
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
  .code {
    width: 112px;
    height: 35px;
    border: 1px solid #ccc;
    float: right;
    border-radius: 2px;
  }
  .validate-code {
    width: 136px;
    float: left;
  }
</style>
