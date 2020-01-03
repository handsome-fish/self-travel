<template>
  <div class="back">
    <!-- 表单 -->
    <el-form :model="userForm" ref="userForm">
      <el-form-item prop="email" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="email" v-model="userForm.email" disabled>
            <template slot="prepend">邮箱</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="level" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="level" v-model="userForm.level" disabled>
            <template slot="prepend">等级</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="name" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="name" v-model="userForm.name" placeholder="请输入昵称">
            <template slot="prepend">昵称</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="phone" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="phone" v-model="userForm.phone" placeholder="请输入手机号码">
            <template slot="prepend">手机号码</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="gold" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="gold" v-model="userForm.gold" disabled>
            <template slot="prepend">余额</template>
            <el-button slot="append" id="charge" v-on:click="handleCharge" style="background-color: #35ffd3; color: #1B253A">去充值</el-button>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="identity" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input id="identity" v-model="userForm.identity" placeholder="请输入身份证号码">
            <template slot="prepend">身份证号码</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-col :span="8">
          <el-button id="editInfo" v-on:click="editInfo" style="width:100%" type="primary">修改信息</el-button>
        </el-col>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-col :span="8">
          <el-button id="editPassword" v-on:click="handleEditPassword" style="width:100%" type="danger">修改密码</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="passwordFormVisible">
      <el-form :model="passwordForm" ref="passwordForm">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.password" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.new" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.validate" type="password" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="validate()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 充值 -->
    <el-dialog title="充值" :visible.sync="chargeFormVisible">
      <el-form :model="chargeForm" ref="chargeForm">
        <el-form-item label="充值">
          <el-input v-model="chargeForm.gold" placeholder="请输入充值金额"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="charge()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findOne,
    updateUser,
    recharge,
    updatePassword
  } from "../../api/user"
  import {USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        formLabelWidth: '480px',
        userForm: {
          email: undefined,
          name: undefined,
          phone: undefined,
          identity: undefined,
          level: undefined,
          gold: undefined
        },
        passwordFormVisible: false,
        passwordForm: {
          password: undefined,
          new: undefined,
          validate: undefined
        },
        chargeFormVisible: false,
        chargeForm: {
          gold: undefined
        },
        updateForm: {
          oldValue: undefined,
          userEmail: undefined,
          newValue: undefined
        },
        userEmail: "",
        password: undefined
      }
    },
    methods: {
      //获取表单数据
      getData() {
        findOne({userEmail: this.userEmail}).then(res => {
          this.userForm.email = this.userEmail;
          this.userForm.name = res.data.data.name;
          this.userForm.level = res.data.data.level;
          this.userForm.phone = res.data.data.phone;
          this.userForm.gold = res.data.data.gold;
          this.userForm.identity = res.data.data.identity;
          this.password = res.data.data.password;
          console.log(res);
        })
      },
      //修改个人信息
      editInfo() {
        this.$confirm('修改个人信息, 是否继续?', '提示', {
          confirmButtonText: '确定修改',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateUser(this.userForm)
            .then(res => {
              if (res.data.code === "100") {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  center: true
                });
                this.getData()
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                });
              }
              console.log(res)
            })
        })
      },
      //修改密码
      handleEditPassword() {
        this.passwordFormVisible = true;
        this.passwordForm = {
          password: undefined,
          new: undefined,
          validate: undefined
        }
      },
      //验证密码问题
      validate() {
        if (this.password !== this.passwordForm.password) {
          this.$alert('原密码不正确!');
          this.passwordForm.password = undefined
        } else if (this.passwordForm.new === this.password) {
          this.$alert('新密码与原密码相同!');
          this.passwordForm.new = undefined;
          this.passwordForm.validate = undefined
        } else if (this.passwordForm.new !== this.passwordForm.validate) {
          this.$alert('新密码两次输入不同!');
          this.passwordForm.new = undefined;
          this.passwordForm.validate = undefined
        } else {
          this.editPassword()
        }
      },
      //验证成功，修改密码
      editPassword() {
        let newPasswordForm = {
          userEmail: this.userEmail,
          newValue: this.passwordForm.new
        };
        updatePassword(newPasswordForm)
          .then(res => {
            if (res.data.code === "100") {
              this.$message({
                message: '修改密码成功',
                type: 'success',
                center: true
              });
              this.passwordFormVisible = false;
              this.getData()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              });
            }
          })
      },
      handleCharge() {
        this.chargeFormVisible = true
      },
      charge() {
        console.log("userForm: " + this.userForm.data);
        this.updateForm.oldValue = this.userForm.gold;
        this.updateForm.userEmail = this.userEmail;
        this.updateForm.newValue = this.chargeForm.gold;
        recharge(this.updateForm)
          .then(res => {
            if (res.data.code === "100") {
              this.$message({
                message: '充值成功',
                type: 'success',
                center: true
              });
              this.chargeFormVisible = false;
              this.getData()
            } else {
              this.$message({
                message: '充值失败',
                type: 'error',
                center: true
              });
            }
          })
      },
      cancel() {
        this.passwordFormVisible = false
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      if (!this.userEmail) {
        this.$router.push({name: 'login'});
      }
      this.getData()
    }
  }
</script>

<style scoped>
  .back{
    background: #1B253A url("../../assets/images/back1.jpg") no-repeat;
    width: calc(100vw);
    height: calc(100vh);
    background-size: cover;
    overflow: scroll;
    position: relative;
  }
</style>
