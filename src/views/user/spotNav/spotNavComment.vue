<template>
  <div class="overflow">
    <el-collapse v-model="activeNames" accordion class="back">
      <el-collapse-item name="1">
        <template slot="title">
          发表说说
          <i class="el-icon-circle-plus">
          </i>
        </template>
        <el-form :model="addAlbumForm" ref="addAlbumForm" :rules="rules">
          <el-form-item label="相册名称" prop="name">
            <el-input v-model="addAlbumForm.name" placeholder="请输入相册名称">
            </el-input>
          </el-form-item>
          <el-form-item label="相册描述" prop="introduce">
            <el-input v-model="addAlbumForm.introduce"
                      placeholder="请输入相册描述"
                      type="textarea"
                      :autosize='{ minRows: 3, maxRows: 6}'>
            </el-input>
          </el-form-item>
          <el-form-item label="添加图片" prop="image">
            <div :key="uploadKey">
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
            </div>
            <el-button type="primary" @click="toBase64" class="button">上传至服务器</el-button>
            <el-button type="primary" @click="upload" class="button">发表说说</el-button>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="查看说说" name="2">
        <div class="item" v-for="(album, index) in albumTable">
          <el-row :gutter="20">
            <el-col :span="4" class="font-size text-align-right">
              <i class="el-icon-user">
              </i>{{album.detail.name}}
            </el-col>
            <el-col :span="4" class="text-align font-size">
              <time class="time">{{album.record.time}}</time>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="4" class="text-align font-size">
              <p>{{album.record.introduce}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-row
              v-for="(item, index) in album.record.base64Datas"
              :key="index"
              v-if="index % 2 === 0"
              style="margin-bottom: 30px;margin-top: 15px">
              <el-col :span="8" v-for="(item, i) in sublist(album.record.base64Datas, index)" v-if="item" :key="i" :offset="i > 0 ? 2 : 4">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <img :src="item" alt="" width="100%" height="250px">
                </el-card>
              </el-col>
            </el-row>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="2" :offset="4" class="text-align">
              <el-button icon="el-icon-s-flag" type="round" @click="like(album.record.id)">
                ({{album.record.number}})
              </el-button>
            </el-col>
            <el-col :span="2" :offset="3" class="text-align-right">
              <el-button icon="el-icon-chat-dot-round" type="round" @click="handleAddComment">
              </el-button>
            </el-col>
            <el-col :span="2" class="text-align">
              <el-button icon="el-icon-more" type="round" @click="getCommentByAlbumID(album.record.id)">
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="commentInputVisible" :id="album.record.id" style="margin-top: 20px">
            <CommentInput v-bind:album="album" v-bind:user-email="userEmail" @comment="addComment">
            </CommentInput>
          </el-row>
          <el-row :gutter="20" v-if="albumCommentVisible" class="bg-purple-light" style="margin-top: 20px">
            <AlbumComment v-bind:album="album" v-bind:album-id="album.record.id">
            </AlbumComment>
          </el-row>
          <el-row style="margin-top: 20px">
            <div class="tableTitle"></div>
          </el-row>
        </div>

        <!--加载   -->
        <div v-if="loading" style="margin-top: 250px">
          <div v-loading="loading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
          </div>
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
    getCommentByAlbumID,
    addComment
  } from "../../../api/album";

  import {SPOT_ID, USER_INFO} from "../../../utils/constant";
  import albumComment from "../../../components/albumComment";
  import commentInput from "../../../components/commentInput";

  export default {
    data () {
      return {
        loading: true,
        activeNames: '2',
        addAlbumForm: {
          introduce: '',
          name: '',
          time: '',
          userEmail: '',
          spotId: '',
          base64Datas: ''
        },
        rules: {
          introduce: [
            {required: true, message: '请输入说说内容', trigger: "blur"}
          ]
        },
        albumTable: [],
        dialogImageUrl: '', //预览url
        dialogVisible: false,
        albumCommentVisible: false, //显示评论区
        commentTable: [],
        commentInputVisible: false, //显示评论输入框
        userEmail: '',
        spotId: '',
        actionUrl: '',
        imgBank: [],
        rawBank: [],
        uploadKey: Math.random() //为了清除缓存
      }
    },
    methods: {
      //获取相册
      getAlbum() {
        getAlbumBySpotID({spotId: this.spotId})
          .then(res => {
            console.log(res);
            this.loading = false;
            this.albumTable = res.data.data
          })
      },
      sublist(base64Datas, index) {
        let sublist = [];
        sublist[0] = base64Datas[index];
        sublist[1] = base64Datas[index+1];
        return sublist
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
        this.$refs['addAlbumForm'].validate((valid) => {
          if (valid) {
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
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                    center: true
                  })
                }
                this.clearAlbumForm();
                this.imgBank = [];
                this.rawBank = [];
                this.getAlbum();
                //为了清除缓存
                this.uploadKey = Math.random();
              })
          } else {
            this.$message({
              message: '发表失败,请填写完整信息',
              type: 'error',
              center: true
            });
            return false;
          }
        })
      },
      //发表说说后清空相册表单
      clearAlbumForm() {
        this.addAlbumForm.data = '';
        this.addAlbumForm.name = '';
        this.addAlbumForm.introduce = '';
        this.addAlbumForm.time = '';
        this.addAlbumForm.base64Datas = ''
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
        addLikeNumber({objId: id, subjectEmail: this.userEmail, time: this.getTimeStrByDate(new Date())})
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '成功点赞',
                type: 'success',
                center: true
              });
            } else if (res.data.code === '200') {
              this.$message({
                message: res.data.message,
                type: 'success',
                center: true
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
            this.getAlbum()
          })
      },
      //显示评论输入框
      handleAddComment() {
        this.commentInputVisible = !this.commentInputVisible;
      },
      //增加评论
      addComment(commentForm) {
        console.log(commentForm);
        addComment(commentForm)
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '评论成功',
                type: 'success',
                center: true
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          });
        this.commentInputVisible = false;
        this.albumCommentVisible = true
      },
      //获取评论
      getCommentByAlbumID(id) {
        this.albumCommentVisible = !this.albumCommentVisible;
      }
    },
    components: {
      AlbumComment: albumComment,
      CommentInput: commentInput
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
    margin-bottom: 30px;
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
  .time {
    font-size: 13px;
    color: #999;
  }
</style>
