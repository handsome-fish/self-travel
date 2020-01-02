<template>
  <div>
    <el-row
      :gutter="40"
      v-for="(item, index) in list"
      :key="index"
      v-if="index % 3 === 0"
      style="margin-bottom: 30px">
      <el-col :span="6" v-for="(item, i) in sublist(index)" v-if="item" :key="i">
        <span>name: {{item.name}}</span>
      </el-col>
    </el-row>

    <el-upload
      class="avatar-uploader"
      :http-request="httpRequest"
      :action="actionUrl"
      name='bankimg'
      :show-file-list="false">
      <img v-if="ruleForm.bankimg" :src="ruleForm.bankimg" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
    export default {
        data() {
          return {
            list: [
              {
                name: '1',
                password: '1'
              },
              {
                name: '2',
                password: '1'
              },
              {
                name: '3',
                password: '1'
              },
              {
                name: '4',
                password: '1'
              },
              {
                name: '5',
                password: '1'
              }
            ],
            actionUrl: '',
            ruleForm: {
              bankimg: ''
            },
            fileReader: new FileReader()
          }
        },
      methods: {
        sublist(index) {
          let sublist = [];
          sublist[0] = this.list[index];
          sublist[1] = this.list[index+1];
          sublist[2] = this.list[index+2];
          return sublist
        },
        httpRequest (options) {
          let file = options.file
          let filename = options.filename
          if (file) {
            this.fileReader.readAsDataURL(file)
            console.log(file)
          }
          this.fileReader.onload = () => {
            this.ruleForm.bankimg = this.fileReader.result
            let base64Str = this.fileReader.result.split(',')[1]
            console.log(this.fileReader.result.split(',')[0])
            console.log(base64Str)
            this.$axios.post("/payways/upload",{file:base64Str})
              .then(res => {
                if(filename === 'bankimg'){
                  this.ruleForm.bankimg= res.data.biz_response.data
                }
                console.log(res)
              })
              .catch(err => {
                console.log(err)
              })

          }
        },
      }
    }
</script>

<style scoped>

</style>
