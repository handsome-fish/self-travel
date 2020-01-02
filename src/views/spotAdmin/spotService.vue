<template>
  <div>
    <el-row>
      <template>
        <el-button type="primary" @click="handleAdd()" icon="el-icon-circle-plus-outline">新增</el-button>
      </template>
    </el-row>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table" :data="tableForm" ref="tableForm" border stripe>
<!--        <el-table-column-->
<!--          prop="id"-->
<!--          label="编号"-->
<!--          width="50"-->
<!--          sortable>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="name"
          label="名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="seat"
          label="位置"
          width="100">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="服务电话"
          width="100">
        </el-table-column>
        <el-table-column
          label="图片"
          width="100">
          <template slot-scope="scope">
            <img
              style="width:80px;height:80px;border:none;"
              :src="scope.row.image"
              class="image">
          </template>
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="企业简介"
          width="100">
        </el-table-column>
        <el-table-column
          prop="maxNum"
          label="酒店容量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="100">
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       icon="el-icon-edit">编辑</el-button>
            <el-button type="danger"
                       @click="handleDelete(scope.row)"
                       icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-input v-model="editForm.seat"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业图片" :label-width="formLabelWidth">
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
        <el-form-item label="企业简介" :label-width="formLabelWidth">
          <el-input v-model="editForm.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="容纳量" :label-width="formLabelWidth">
          <el-input v-model="editForm.maxNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="editForm.price" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" v-on:click="editSpotService()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增窗口 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-input v-model="addForm.seat"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.type" style="float: left">
            <el-option
              v-for="item in serviceOptions"
              :key="item.type"
              :label="item.type"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业图片" :label-width="formLabelWidth">
          <div :key="uploadKey">
            <el-upload
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
          </div>
          <el-button type="text" @click="toBase64" class="button" style="float: left;padding-top: 130px">上传至服务器</el-button>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="企业简介" :label-width="formLabelWidth">
          <el-input v-model="addForm.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="容纳量" :label-width="formLabelWidth">
          <el-input v-model="addForm.maxNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.price" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addSpotService()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    addCompany,
    delCompany,
    modCompany,
    getCompanyBySpotId,
    getCompanyType
  } from "../../api/company"
  import {getSpotByUserEmail} from "../../api/spot";
  import {USER_INFO} from "../../utils/constant";

  export default {
    data() {
      return {
        tableForm: [],
        formLabelWidth: '120px',
        editFormVisible: false,//是否显示编辑窗口
        editForm: {
          id: undefined,
          name: undefined,
          seat: undefined,
          type: undefined,
          phone: undefined,
          image: undefined,
          introduce: undefined,
          spotId: undefined,
          maxNum: undefined,
          price: undefined
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        addForm: {
          name: undefined,
          seat: undefined,
          type: undefined,
          phone: undefined,
          image: undefined,
          introduce: undefined,
          spotId: undefined,
          maxNum: undefined,
          price: undefined
        },
        userEmail: '',
        selectedSpotId:  undefined,
        actionUrl: '',
        imgBank: [],
        rawBank: [],
        dialogImageUrl: '', //预览url
        dialogVisible: false, //预览弹窗
        serviceOptions: [],
        editPhotoDialogVisible: true, //编辑图片显示
        uploadKey: Math.random() //为了清除缓存
      }
    },
    methods: {
      //获取表格数据
      getData() {
        getSpotByUserEmail({userEmail: this.userEmail}).then(res0 => {
          // console.log(res0);
          this.selectedSpotId = res0.data.data[0].spotDTO.id;
          getCompanyBySpotId({spotId: this.selectedSpotId}).then(res => {
            this.tableForm = res.data.data;
            console.log(res)
          })
        })
      },
      //获取
      setServiceOptions() {
        getCompanyType()
          .then(res => {
            res.data.data.map(res => {
              this.serviceOptions.push({type: res})
            })
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
            // let fileReader = new FileReader();
            // if (file) {
            //   fileReader.readAsDataURL(file);
            //   // console.log(file)
            // }
            // fileReader.onload = () => {
            //   console.log('result: ');
            //   console.log(fileReader.result)
            // };
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
        this.editPhotoDialogVisible = true;
        this.editForm = Object.assign({}, row);
        this.dialogImageUrl = row.image;
        this.editFormVisible = true;
        this.editPhotoDialogVisible = true;
      },
      // 改变修改图片的展示
      changeImage() {
        this.editPhotoDialogVisible = false
      },
      //保存编辑
      editSpotService() {
        let tempEditForm = {
          id: this.editForm.id,
          name: this.editForm.name,
          seat: this.editForm.seat,
          type: this.editForm.type,
          phone: this.editForm.phone,
          image: !this.editPhotoDialogVisible ? this.imgBank.toString() : this.dialogImageUrl,
          introduce: this.editForm.introduce,
          spotId: this.selectedSpotId,
          maxNum: this.editForm.maxNum,
          price: this.editForm.price
        };
        modCompany(tempEditForm).then(res => {
          console.log(res);
          if (res.data.code === "100") {
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            });
            this.getData();
            this.rawBank = [];
            this.imgBank = [];
            this.dialogImageUrl = '';
            this.editPhotoDialogVisible = true
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
      //新增数据
      handleAdd() {
        //为了清除缓存
        this.uploadKey = Math.random();
        //先将表单清空
        this.addForm = {
          name: undefined,
          seat: undefined,
          type: undefined,
          phone: undefined,
          image: undefined,
          introduce: undefined,
          spotId: this.selectedSpotId,
          maxNum: undefined,
          price: undefined
        };
        this.addFormVisible = true;
        this.dialogImageUrl = '';
        this.rawBank = [];
        this.imgBank = [];
      },
      //将新增的数据添加到数据库中
      addSpotService() {
        // console.log(this.addForm)
        this.addForm.image = this.imgBank.toString();
        addCompany(this.addForm).then(res => {
          if (res.data.code === "100") {
            this.$message({
              message: '添加成功',
              type: 'success',
              center: true
            });
            this.getData();
            this.rawBank = [];
            this.imgBank = [];
            this.dialogImageUrl = ''
          }
          else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            })
          }
        });
        this.addFormVisible = false
      },
      cancel() {
        this.addFormVisible = false;
        this.editFormVisible = false;
        this.editPhotoDialogVisible = true
      },
      //删除数据
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCompany({id: row.id}).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '已删除',
                type: 'success',
                center: true
              });
              this.getData()
            }
            else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
        })
      },
    },
    computed: {
      uploadDisabled() {
        return this.rawBank.length > 0
      }
    },
    created() {
      this.userEmail = sessionStorage.getItem(USER_INFO);
      this.setServiceOptions();
      this.getData()
    }
  }
</script>
<style>
  .image {
       width: 100%;
       display: block;
     }
  .upload {
    float: left;
  }
  .disabled .el-upload--picture-card {
    display: none;
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

