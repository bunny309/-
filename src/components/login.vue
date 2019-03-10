<template>
  <div class="login">
    <el-form
      :model="formData"
      status-icon
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
      :rules="rules"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model.trim="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="formData.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formData.age"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submitForm('ruleForm2')" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   labelPosition: "top",
      formData: {
        username: "",
        password: ""
        // rules:{}
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("login",this.formData).then(res => {
            console.log(res);
            if(res.data.meta.status ===400){
              this.$message.error(res.data.meta.msg);
            }else{
              this.$message.success(res.data.meta.msg);
              // 保存token
              window.sessionStorage.setItem('token',res.data.data.token);
              // 去首页
              // 要使用路由的方式跳转——编程式导航 
              this.$router.push('/');

            }
          })
          // alert("验证成功!");
        } else {
          this.$message.error("请输入正确的用户名和密码");
          // alert("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
body > div:first-of-type {
  height: 100%;
}
.login {
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.el-form {
  width: 580px;
  height: 440px;
  box-sizing: border-box;
  padding: 40px;
  border-radius: 10px;
  background-color: #fff;
}
.login-btn {
  width: 100%;
}
</style>
