<template>
  <div>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" height="500" border>
        <el-table-column
          label="图片"
          width="100">
          <template slot-scope="scope">
            <img
              style="width:80px;height:80px;border:none;"
              :src="scope.row.spotPhoto64DTOS[0].base64data"
              class="image"
              :alt="scope.row.spotDTO.name">
          </template>
        </el-table-column>
        <el-table-column
          prop="spotDTO.name"
          label="景区名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.cid"
          label="景区地区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="spotDTO.seat"
          label="具体位置"
          width="180">
        </el-table-column>
        <el-table-column
          prop="spotDTO.introduce"
          label="景区简介"
          width="180">
        </el-table-column>
        <el-table-column
          prop="spotDTO.phone"
          label="电话"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.maxNum"
          label="最高接待量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       icon="el-icon-edit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="景区名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <img width="100%" :src="dialogImageUrl" alt="" style="float: left" v-if="editPhotoDialogVisible">
          <el-button
            type="text"
            @click="changeImage"
            class="button"
            v-if="editPhotoDialogVisible"
            style="float:left;">
            更换图片
          </el-button>
          <el-upload
            v-if="!editPhotoDialogVisible"
            :action="actionUrl"
            list-type="picture-card"
            :class="{disabled:uploadDisabled}"
            :http-request="httpRequest"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            accept="image/jpg,image/png,image/jpeg"
            class="upload"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus">
            </i>
          </el-upload>
          <el-button
            type="text"
            @click="toBase64"
            class="button"
            v-if="!editPhotoDialogVisible"
            style="float: left;padding-top: 130px">
            上传至服务器
          </el-button>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="具体位置" :label-width="formLabelWidth">
          <el-input v-model="editForm.seat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="景区简介" :label-width="formLabelWidth">
          <el-input v-model="editForm.introduce" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最高接待量" :label-width="formLabelWidth">
          <el-input v-model="editForm.maxNum"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="editSpot()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    addSpot,
    delSpot,
    modSpot,
    getSpot,
    getAllSpot,
    getSpotByCid,
    addSpotAdmin,
    getSpotByUserEmail
  } from "../../api/spot"
  import {getCity, getProvince} from "../../api/location"
  import {findAll} from "../../api/user"
  import {USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        editFormVisible: false,//是否显示编辑窗口
        editForm: {
          name: undefined,
          cid: undefined,
          seat: undefined,
          introduce: undefined,
          phone: undefined,
          maxNum: undefined,
          image: undefined
        },
        addLoading: false,
        userEmail: '',
        spotPhoto64DTOForm: {
          id: '',
          base64data: ''
        },
        actionUrl: '',
        imgBank: [],
        rawBank: [],
        dialogImageUrl: '', //预览url
        dialogVisible: false, //预览弹窗
        editPhotoDialogVisible: true, //编辑图片显示
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotByUserEmail({userEmail: this.userEmail}).then(res => {
          this.tableForm = res.data.data;
          console.log(res)
        })
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
          this.$message.error('上传头像图片大小不能超过2MB!');
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
      //base64编码
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
      //编辑数据
      handleEdit(row) {
        this.editFormVisible = true;
        this.editPhotoDialogVisible = true;
        this.dialogImageUrl = '';
        this.editForm = Object.assign({}, row.spotDTO);
        this.dialogImageUrl = row.spotPhoto64DTOS[0].base64data;
        this.spotPhoto64DTOForm.id = row.spotPhoto64DTOS[0].id;
      },
      // 改变修改图片的展示
      changeImage() {
        this.editPhotoDialogVisible = false
      },
      //保存编辑
      editSpot() {
        this.spotPhoto64DTOForm.base64data = !this.editPhotoDialogVisible ? this.imgBank.toString() : this.dialogImageUrl;
        modSpot({spotDTO: this.editForm, spotPhoto64DTOS: [this.spotPhoto64DTOForm]}).then(res => {
          if (res.data.code === '100') {
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            });
            this.getData();
            this.rawBank = [];
            this.imgBank = [];
            this.dialogImageUrl = '';
            this.editPhotoDialogVisible = true;
            this.spotPhoto64DTOForm.base64data = '';
            this.spotPhoto64DTOForm.id = '';
          }
          else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            })
          }
        });
        this.editFormVisible = false;
      },
      cancel() {
        this.editFormVisible = false;
        this.editPhotoDialogVisible = true
      }
    },
    computed: {
      uploadDisabled() {
        return this.rawBank.length > 0
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.getData()
    }
  }
</script>
<style>
  .image {
    width: 100%;
    display: block;
  }
  .table-grid-content {
    border-radius: 4px;
    height: 50px;
    background: #ebeef5;
    padding: 10px;
  }
  .table-input {
    outline-style: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 200px;
    font-size: 14px;
    height: 30px;
  }
  .Table-table {
    padding: 5px;
  }
  .el-table td {
    padding: 0px;
  }
  .el-table th {
    padding: 0px;
  }
</style>

