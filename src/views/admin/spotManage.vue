<template>
  <div>
    <el-row>
      <template>
        <el-select v-model="selectedProvinceId" placeholder="请选择省份" filterable @change="getCity">
          <el-option
            v-for="item in selectedProvinceOptions"
            :key="item.pid"
            :label="item.province"
            :value="item.pid">
          </el-option>
        </el-select>
        <el-select v-model="selectedCityId" placeholder="请选择市区" filterable>
          <el-option
            v-for="item in selectedCityOptions"
            :key="item.city"
            :label="item.city"
            :value="item.city">
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleAdd()" icon="el-icon-circle-plus-outline">新增</el-button>
      </template>
    </el-row>

    <!-- 表格 -->
    <div class="Table-table">
      <el-table id="table"
                :data="tableForm.slice((currentPage - 1)*pageSize, currentPage*pageSize)"
                ref="tableForm"
                border
                style="width: 100%"
                stripe>
<!--        <el-table-column-->
<!--          prop="id"-->
<!--          label="编号"-->
<!--          width="50"-->
<!--          sortable>-->
<!--        </el-table-column>-->
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
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.cid"
          label="景区地区"
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.seat"
          label="具体位置"
          width="100">
        </el-table-column>
        <el-table-column
          prop="spotDTO.introduce"
          label="景区简介"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.phone"
          label="电话"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spotDTO.maxNum"
          label="最高接待量"
          width="100"
          sortable>
        </el-table-column>
        <el-table-column prop="userEmail" label="管理员" width="180">
          <template slot-scope="scope">
            <el-button type="primary"
                       @click="handleAddAdmin(scope.row)" v-if="scope.row.spotDTO.userEmail === null">添加管理员</el-button>
            <span v-if="scope.row.userEmail !== null">{{ scope.row.spotDTO.userEmail }}</span>
            <br>
            <el-button type="text" @click="handleEditSpotAdmin(scope.row)" v-if="scope.row.spotDTO.userEmail !== null">
              更换
            </el-button>
            <el-button type="text" @click="handleDeleteSpotAdmin(scope.row)" v-if="scope.row.spotDTO.userEmail !== null">
              移除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="opp"
          label="操作"
          width="230">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       icon="el-icon-edit">编辑</el-button>
            <el-button type="danger"
                       @click="handleDelete(scope.row)"
                       icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableForm.length"
        style="padding-bottom: 15px; padding-top: 35px; padding-left: 700px">
      </el-pagination>
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

    <!-- 新增窗口 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="景点名" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
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
        <el-form-item label="具体位置" :label-width="formLabelWidth">
          <el-input v-model="addForm.seat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="景区简介" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="addForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最高接待量" :label-width="formLabelWidth">
          <el-input v-model="addForm.maxNum"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addSpot()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增管理员窗口   -->
    <el-dialog title="添加管理员" :visible.sync="addAdminFormVisible">
      <el-form :model="addAdminForm" ref="addAdminForm">
        <el-form-item label="添加管理员" :label-width="formLabelWidth">
          <el-select v-model="addAdminForm.userEmail" placeholder="请选择用户邮箱" filterable>
            <el-option
              v-for="item in userOptions"
              :key="item.email"
              :label="item.email"
              :value="item.email">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addAdmin()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 更换景点管理员窗口   -->
    <el-dialog title="更换管理员" :visible.sync="editAdminFormVisible">
      <el-form :model="editAdminForm" ref="editAdminForm">
        <el-form-item label="更换管理员" :label-width="formLabelWidth">
          <el-select v-model="editAdminForm.userEmail" placeholder="请选择用户邮箱" filterable>
            <el-option
              v-for="item in userOptions"
              :key="item.email"
              :label="item.email"
              :value="item.email">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="editAdmin()" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    addSpot,
    delSpot,
    delSpotAdmin,
    modSpot,
    getSpot,
    getAllSpot,
    getSpotByCid,
    addSpotAdmin,
    modSpotAdmin
  } from "../../api/spot"
  import {getCity, getProvince} from "../../api/location"
  import {findAll} from "../../api/user"

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
          maxNum: undefined
        },
        addFormVisible: false,//是否显示新增窗口
        addLoading: false,
        addForm: {
          name: undefined,
          cid: undefined,
          seat: undefined,
          introduce: undefined,
          phone: undefined,
          maxNum: undefined
        },
        spotPhoto64DTOForm: {
          id: '',
          base64data: ''
        },
        addAdminForm: {
          userEmail: undefined,
          id: undefined
        },
        addAdminFormVisible: false,//是否显示新增管理员窗口
        editAdminForm: {
          userEmail: undefined,
          id: undefined,
          oldUserEmail: undefined
        },
        editAdminFormVisible: false,//是否显示更换管理员窗口
        //搜索
        searchData: '',
        userOptions: [],
        selectedProvinceOptions: [],
        selectedCityOptions: [],
        selectedSpotOptions: [],
        selectedSpotId: '',
        selectedProvinceId: '',
        selectedCityId: '',
        currentPage: 1,
        pageSize: 5,
        actionUrl: '',
        imgBank: [],
        rawBank: [],
        dialogImageUrl: '', //预览url
        dialogVisible: false, //预览弹窗
        editPhotoDialogVisible: true, //编辑图片显示
        uploadKey: Math.random() //为了清除缓存
      }
    },
    methods: {
      //获取省份信息
      getProvince() {
        getProvince()
          .then(res => {
            console.log(res);
            this.selectedProvinceOptions = res.data.data
          })
      },
      //获取城市信息
      getCity() {
        this.selectedCityId = '';
        this.selectedSpotId = '';
        getCity({pid: this.selectedProvinceId})
          .then(res => {
            console.log(res);
            this.selectedCityOptions = res.data.data
          })
      },
      //获取景区
      getSpotByCid() {
        this.selectedSpotId = '';
        getSpotByCid({cid: this.selectedCityId})
          .then(res => {
            console.log(res);
            this.selectedSpotOptions = res.data.data
          })
      },
      //获取表格数据
      getData() {
        getAllSpot().then(res => {
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
      //新增数据
      handleAdd() {
        //为了清除缓存
        this.uploadKey = Math.random();
        //先将表单清空
        this.addForm = {
          name: undefined,
          cid: this.selectedCityId,
          seat: undefined,
          introduce: undefined,
          phone: undefined,
          maxNum: undefined
        };
        this.spotPhoto64DTOForm.base64data = '';
        this.spotPhoto64DTOForm.id = '';
        this.addFormVisible = true;
        this.dialogImageUrl = '';
        this.rawBank = [];
        this.imgBank = [];

      },
      //将新增的数据添加到数据库中
      addSpot() {
        // console.log(this.addForm)
        this.spotPhoto64DTOForm.base64data = this.imgBank.toString();
        addSpot({spotDTO: this.addForm, spotPhoto64DTOS: [this.spotPhoto64DTOForm]}).then(res => {
          if (res.data.code === '100') {
            this.$message({
              message: '添加成功',
              type: 'success',
              center: true
            });
            this.getData();
            this.rawBank = [];
            this.imgBank = [];
            this.dialogImageUrl = '';
            this.spotPhoto64DTOForm.base64data = ''
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
        this.addAdminFormVisible = false;
        this.editAdminFormVisible = false;
        this.editPhotoDialogVisible = true
      },
      //删除数据
      handleDelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSpot({id: row.spotDTO.id}).then(res => {
            if (res.data.code === "100") {
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
      //添加景点管理员
      handleAddAdmin(row) {
        this.addAdminForm = {
          userEmail: undefined,
          id: row.spotDTO.id
        };
        this.addAdminFormVisible = true;
        findAll()
          .then(res => {
            this.userOptions = res.data.data
          })
      },
      //添加到数据库
      addAdmin() {
        addSpotAdmin(this.addAdminForm)
          .then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: "成功添加景点管理员",
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
          });
          this.addAdminFormVisible = false
      },
      //修改景区管理员
      handleEditSpotAdmin(row) {
        this.editAdminForm = {
          userEmail: undefined,
          id: row.spotDTO.id,
          oldUserEmail: row.spotDTO.userEmail
        };
        console.log(row.id);
        this.editAdminFormVisible = true;
        findAll()
          .then(res => {
            this.userOptions = res.data.data
          })
      },
      editAdmin() {
        modSpotAdmin(this.editAdminForm).then(res => {
          if (res.data.code === '100') {
            this.$message({
              message: '成功添加景点管理员',
              type: 'success',
              center: true
            });
            this.getData();
          }
          else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            })
          }
        });
        this.editAdminFormVisible = false
      },
      //移除景点管理员
      handleDeleteSpotAdmin(row) {
        this.$confirm('是否确定移除景点管理员' + row.spotDTO.userEmail + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSpotAdmin({id: row.spotDTO.id, userEmail: row.spotDTO.userEmail}).then(res => {
            if (res.data.code === '100') {
              this.$message({
                message: '已移除',
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
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val
      }
    },
    computed: {
      uploadDisabled() {
        return this.rawBank.length > 0
      }
    },
    created() {
      this.getData();
      this.getProvince()
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

