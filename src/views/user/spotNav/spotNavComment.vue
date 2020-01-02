<template>
  <div class="overflow">
    <el-collapse v-model="activeNames" accordion class="back">
      <el-collapse-item name="1">
        <template slot="title">
          发表说说
          <i class="el-icon-circle-plus">
          </i>
        </template>
        <el-form :model="addAlbumForm" ref="addAlbumForm">
          <el-form-item label="相册名称">
            <el-input v-model="addAlbumForm.name" placeholder="请输入相册名称">
            </el-input>
          </el-form-item>
          <el-form-item label="相册描述">
            <el-input v-model="addAlbumForm.introduce"
                      placeholder="请输入相册描述"
                      type="textarea"
                      :autosize='{ minRows: 3, maxRows: 6}'>
            </el-input>
          </el-form-item>
          <el-form-item label="添加图片">
            <el-upload
              :action="actionUrl"
              list-type="picture-card"
              :http-request="httpRequest"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              accept="image/jpg,image/png,image/jpeg"
              class="upload"
              :before-upload="beforeAvatarUpload">
<!--              <img v-if="imgForm.img" :src="imgForm.img" class="avatar">-->
              <i class="el-icon-plus">
              </i>
            </el-upload>
            <el-button type="primary" @click="toBase64" class="button">上传至服务器</el-button>
            <el-button type="primary" @click="upload" class="button">发表说说</el-button>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="查看说说" name="2">
        <div class="item" v-for="album in albumTable">
          <el-row :gutter="20">
            <el-col :span="2" class="font-size text-align-right">
              <i class="el-icon-user">
              </i>{{album.userName}}
            </el-col>
            <el-col :span="4" class="text-align font-size">
              {{album.time}}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="2" class="text-align font-size">
              <p>{{album.introduce}}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="2" :span="8">
              <img :src="album.base64Datas[0]" :alt="album.name" width="100%">
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="2" :offset="2" class="text-align">
              <el-button icon="el-icon-s-flag" type="round" @click="like(album.id)">
                ({{album.number}})
              </el-button>
            </el-col>
            <el-col :span="2" class="text-align">
              <el-button icon="el-icon-chat-dot-round" type="round" @click="getCommentByAlbumID(album.id)">
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="commentTableVisible" class="bg-purple-light">
            <el-col :offset="2" class="text-align">
              <div class="item" v-for="comment in commentTable">
                <el-row :gutter="20">
                  <el-col :span="2" class="font-size-small text-align-right">
                    <i class="el-icon-user">
                    </i>{{getNameByUserEmail(comment.userEmail)}}
                  </el-col>
                  <el-col :span="4" class="font-size-small">
                    {{comment.time}}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" :offset="2" class="text-align font-size-small">
                    <p>{{comment.content}}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import {
    upload,
    getAlbumBySpotID,
    addLikeNumber,
    getCommentByAlbumID
  } from "../../../api/album";

  import {
    findOne
  } from "../../../api/user";
  import {SPOT_ID, USER_INFO} from "../../../utils/constant";

  export default {
    data () {
      return {
        activeNames: '2',
        addAlbumForm: {
          introduce: '',
          name: '',
          time: '',
          userEmail: '',
          spotId: '',
          base64Datas: ''
        },
        albumTable: [],
        dialogImageUrl: '', //预览url
        dialogVisible: false,
        commentTableVisible: false,
        commentTable: [],
        userEmail: '',
        spotId: '',
        actionUrl: '',
        imgBank: [],
        rawBank: [],
        userInfo: {
          name: ''
        }
      }
    },
    methods: {
      //获取相册
      getAlbum() {
        getAlbumBySpotID({spotId: this.spotId})
          .then(res => {
            console.log(res);
            this.albumTable = res.data.data
          })
      },
      //获取用户昵称
      getNameByUserEmail(userEmail) {
        let name = '';
        findOne({userEmail: userEmail})
          .then(res => {
          console.log(res.data.data.name);
          name = res.data.data.name
        });
        return name
      },
      //移除图片
      handleRemove(file, fileList) {
        console.log('file to remove ');
        console.log(file);
        file = file.raw;
        console.log('raw file: ');
        console.log(file);
        let i = 0;
        for (; i < this.rawBank.length; i++) {
          if (this.rawBank[i] === file) {
            let fileReader = new FileReader();
            if (file) {
              fileReader.readAsDataURL(file);
              // console.log(file)
            }
            fileReader.onload = () => {
              console.log('result: ');
              console.log(fileReader.result)
            };
            break
          }
        }
        let index = this.rawBank.indexOf(this.rawBank[i]);
        console.log('index: ');
        console.log(index);
        if (index > -1) {
          this.rawBank.splice(index, 1);
        }
        console.log('rawBank after remove: ');
        console.log(file);
      },
      //预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //限制图片格式
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
          || file.type === 'image/jpg'
          || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片格式不正确!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //存储图片
      httpRequest (options) {
        let file = options.file;
        console.log('add file: ');
        console.log(file);
        this.rawBank.push(file);
        console.log('rawBank after add: ');
        console.log(this.rawBank);
      },
      toBase64() {
        let i = 0;
        for (; i < this.rawBank.length; i++) {
          let fileReader = new FileReader();
          if (this.rawBank[i]) {
            fileReader.readAsDataURL(this.rawBank[i]);
            // console.log(file)
          }
          fileReader.onload = () => {
            this.imgBank.push(fileReader.result);
            console.log('imgBank: ');
            console.log(this.imgBank);
            let base64Str = fileReader.result.split(',')[1];
            // console.log(fileReader.result.split(',')[0]);
            // console.log(base64Str);
            // console.log(fileReader.result)
            // console.log(options)
          }
        }
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      },
      //发表说说
      upload() {
        this.addAlbumForm.userEmail = this.userEmail;
        this.addAlbumForm.spotId = this.spotId;
        this.addAlbumForm.time = this.getTimeStrByDate(new Date());
        this.addAlbumForm.base64Datas = this.imgBank;
        upload(this.addAlbumForm)
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '发表说说成功',
                type: 'success',
                center: true
              });
              this.clearAlbumForm();
              this.imgBank = [];
              this.rawBank = [];
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
      },
      //发表说说后清空相册表单
      clearAlbumForm() {
        this.addAlbumForm.data = '';
        this.addAlbumForm.name = '';
        this.addAlbumForm.introduce = '';
        this.addAlbumForm.time = '';
      },
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
      //点赞
      like(id) {
        addLikeNumber({id: id})
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '成功点赞',
                type: 'success',
                center: true
              });
              this.getAlbum()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
      },
      //获取评论
      getCommentByAlbumID(id) {
        this.commentTableVisible = false;
        getCommentByAlbumID({objId: id})
          .then(res => {
            if (res.data.code === '100') {
              this.commentTable = res.data.data;
              this.commentTableVisible = true
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.spotId = sessionStorage.getItem(SPOT_ID);
      this.getAlbum()
    }
  }
</script>

<style scoped>
  .back {
    margin-right: 150px;
  }
  .item {
    margin-bottom: 10px;
  }
  .upload {
    float: left;
  }
  .button {
    float: left;
    margin-top: 105px;
    margin-left: 10px;
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
  .overflow {
    overflow: scroll;
  }
  .font-size-small {
    font-size: 10px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
</style>
