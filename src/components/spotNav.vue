<template>
  <div>
    <el-container class="back">
      <el-header class="admin-header">
        <el-menu
          :default-active="this.$router.app._route.name"
          class="el-menu-demo"
          router
          mode="horizontal"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name" class="admin-menu">
            <template slot="title">
              <span> {{ item.navItem }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        navList:[
          {name:'spotNavSpotInfo', navItem:'景区信息'},
          {name:'spotNavTicketInfo', navItem: '门票信息'},
          {name:'spotNavSpotService', navItem: '景区服务'},
          {name:'spotNavQuestion', navItem: '问题'},
          {name:'spotNavComment', navItem: '评论'}
        ] }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(this.$route.path)
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    created() {
      this.email = this.$route.query.email
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
  .admin-menu{
    background-color: #fff;
    width: 100px;
  }
</style>
