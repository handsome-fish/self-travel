<template>
  <div>
    <el-container class="back">
      <el-header class="admin-header">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item>
            <el-button @click="handleLogout">注销</el-button>
          </el-menu-item>
          <el-menu-item>
            <span>欢迎您 {{this.email}}</span>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="100px" class="admin-aside">
          <el-menu
            default-active="spot"
            class="el-menu-vertical-demo"
            router
            mode="vertical"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name" class="admin-aside">
              <template slot="title">
                <span> {{ item.navItem }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>
            <p style="font-size: small">
              ©Copyright 2019 公司版权所有 | Designed by 7 & 303
            </p>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import {
    USER_INFO
  } from "../utils/constant";

  export default {
    data() {
      return {
        email: '',
        navList:[
          {name:'spot', navItem:'景点信息'},
          {name:'orderManage', navItem: '订单管理'},
          {name:'memberInfo', navItem: '个人信息'}
        ] }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(this.$route.path)
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleLogout() {
        this.$confirm('是否退出登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.removeItem(USER_INFO);
          this.$router.push({name: 'login'})
        })
      }
    },
    created() {
      this.email = sessionStorage.getItem(USER_INFO);
    }
  }
</script>

<style scoped>
  .back{
    width: calc(100vw);
    height: calc(100vh);
    background-size: cover;
    overflow: scroll;
    position: relative;
  }
  .admin-header{
    padding: 0px;
  }
  .menu-right{
    margin-left:200px;
  }
  .admin-aside{
    background-color: #545c64;
    width: 100px;
  }
</style>
