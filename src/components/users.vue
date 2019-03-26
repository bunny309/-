<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="用户管理^_^" third="用户列表(*^__^*)"></mybreadxie>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="my-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <!-- 栅格布局搜索栏 -->
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input v-model="sendData.query" @keyup.native.enter="search" placeholder="请输入内容">
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-button type="success" plain @click="addFormVisible = true">添加用户</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="statusChange(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <!-- 编辑 scope.row得到的是一个对象，表示这一行的数据-->
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            icon="el-icon-edit"
            plain
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
            plain
          ></el-button>
          <!-- 分配角色 -->
          <el-button
            type="warning"
            size="small"
            @click="handleRole(scope.row)"
            icon="el-icon-delete"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <!-- 分页 -->
    <!--  @size-change="sizeChange" 每页显示多少条
    @current-change="currentChange" 当前第几页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="sendData.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="sendData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form :model="addform" class="add-Form" ref="addform" :rules="rules" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 编辑用户 -->
    <el-dialog title="修改用户" :visible.sync="editFormVisible">
      <el-form :model="editform" class="add-Form" ref="editform" :rules="rules" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editform.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editform')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 角色框 -->
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱验证规则

    var email = (rule, value, callback) => {
      // if (!value) {
      //   // return callback(new Error("不能为空"));
      // }
      // console.log(rule)
      // console.log(value)
      let rs = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      setTimeout(() => {
        if (rs.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱"));
        }
      }, 1000);
    };
    // 验证手机号
    var mobile = (rule, value, callback) => {
      // if (!value) {
      //   // return callback(new Error("不能为空"));
      // }
      // console.log(rule)
      // console.log(value)
      let rs = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      setTimeout(() => {
        if (rs.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的电话"));
        }
      }, 1000);
    };
    return {
      // 提交的数据
      sendData: {
        query: "",
        pagesize: 4,
        pagenum: 1
      },
      // 总条数
      total: 0,
      // table数据
      tableData: [],
      // 删除
      deleteVisible: false,
      // 标记新增框是否显示
      addFormVisible: false,
      // 标记编辑框是否显示
      editFormVisible: false,
      // 标记角色框是否显示
      // 新增的表单数据
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        type: []
      },
      formLabelWidth: "120px",
      // 新增的表单数据验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        email: [{ validator: email, trigger: "blur" }],
        mobile: [{ validator: mobile, trigger: "blur" }]
      },
      // 编辑的表单数据
      editform: {
        username: "",
        email: "",
        mobile: ""
      }
      // 角色的表单数据
      // 角色列表
    };
  },
  // 方法
  methods: {
    // 编辑 1、弹出窗口 2、获取数据库数据，放到表单里
    // 提交在哪？在对话框的“确定按钮里”
    // 弹框
    // 接口调用
    // console.log(res);
    // 设置给编辑的表单数据
    // 查询数据 1、调用接口（需要验证）2、将查到的数据赋值给，，
    // headers: {
    //   Authorization: window.sessionStorage.getItem("token")
    // },
    // 数据赋值
    // 设置总条数
    // 删除数据
    // handleClose(done) {

    //   }
    handleDelete(item) {
      console.log(item);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          let res =await this.$http.delete(`users/${item.id}`);
          
          //  console.log(this);
          if(res.data.meta.status == 200){
            this.search();
          }
          //  console.log(res)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      
    },
    // async handleDelete() {

    //   console.log(item);

    //
    //
    // },

    //
    async handleEdit(item) {
      // console.log(item)
      this.editFormVisible = true;
      let res = await this.$http.get(`users/${item.id}`);
      // console.log(res);
      this.editform = res.data.data;
      console.log(this.editform);
    },
    // 表单验证 分三种情况：添加用户、编辑用户、角色表单提交————好像，涉及表单提交的都调用这个方法，要写很多个if-else？？
    submitForm(formName) {
      // console.log(formName)
      this.addFormVisible = false;
      this.editFormVisible = false;
      // this.editFormVisible=false;
      // submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res;
          // console.log(res);
          if (formName == "addform") {
            console.log(formName);
            res = await this.$http.post("users", this.addform);
            console.log(res);
            // this.search();
          } else if (formName == "editform") {
            res = await this.$http.put(
              `users/${this.editform.id}`,
              this.editform
            );
            // res = await this,$http.put(`users${}`)this.editform
            console.log(this.editform);
            console.log(res);
          }
          if (res.data.meta.status == 201 || res.data.meta.status == 200) {
            this.$message(res.data.meta.msg);
            this.search();
          }
        } else {
          console.log("提交出错!!");
          return false;
        }
      });
    },
    // 状态改变
    async statusChange(item) {
       console.log(item);
      // let res = await this.$http.put(`users/${item.id}/state/${item.mg_state}`);
      let res = await this.$http.put(`users/${item.id}/state/${item.mg_state}`);
      // console.log(res);
    },

    // console.log(item);
    // 调用接口  使用@change事件，只需调用接口数据，监控状态改变即可，好像不需要做什么逻辑操作。
    // console.log(res);

    async search() {
      let res = await this.$http.get("users", {
        params: this.sendData
      });
      // console.log(res);
      // 表格
      this.tableData = res.data.data.users;
      // 总页数
      this.total = res.data.data.total;
    },
    handleSizeChange(val) {
      this.sendData.pagesize = val;
      this.search();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.sendData.pagenum = val;
      this.search();

      // console.log(`当前页: ${val}`);
    }
  },
  // 选择角色async await

  // 弹框

  // 保存数据

  // 获取角色信息

  // console.log(res);

  // 页容量改变

  //返回的数据是每页多少条数据
  //把这个数据赋给data里面的pagesize
  // 重新获取数据

  // 页码改变

  // 数据获取
  created() {
    this.search();
    // 这是“点”出来的写法：this.$http.get('users',{params:this.sendData}).then(res => {
    //   console.log(res)
    // })
  }
};
</script>

<style>
.el-breadcrumb.my-breadcrumb {
  height: 45px;
  line-height: 45px;
  background-color: #d3dce6;
  padding-left: 10px;
}
.add-Form {
  height: auto;
  padding: 0;
}
</style>
