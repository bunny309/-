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
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submitForm('ruleForm2')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 登陆这个页面，要做什么事情？————表单验证，两次验证，用户输入时，点击提交时。最后是获取接口，返回登陆成功或失败。
// 这个页面用到什么技术？
// 1、表单验证用到而是饿了吗UI的组件
// 2、调用接口，登陆成功后，用sessionstorage存储后台返回的token(一串加密的数据)
// 3、页面跳转用的是Vue中的另一种跳转方式————编程式导航

export default {
  data() {
    
    return {
      //    labelPosition: "top",
      formData: {
        username: "",
        password: ""
        // rules:{}
      },
      // 用户输入过程中的验证
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
    // 用户点击提交时的验证————这一整个代码都是饿了吗UI提供的，除了里面的一些逻辑
    submitForm(formName) {
      // 表单的验证，饿了吗UI提供的————点击 提交的时候，将全部的输入的内容进行验证
      this.$refs[formName].validate(valid => {
        // 如果输入的内容合法
        if (valid) {
          // 就调用后台接口，将它们发送到后台验证，验证什么？和数据库数据进行对比，验证用户名密码是否正确。我们只需要，获取后台返回的成功或者失败的结果就可以
          this.$http.post("login", this.formData).then(res => {
            console.log(res);
            if (res.data.meta.status === 400) {
              // 这个this.$message.error是饿了吗UI提供的信息弹出框
              this.$message.error(res.data.meta.msg);
            } else {
              this.$message.success(res.data.meta.msg);
              // 保存tokentoken是服务器返回的一串加密的数据，是登陆之后，服务器返回的数据。我们（前端）需要将它保存起来，证明登陆了。但它不是cookie也不是session，不能自己保存，这是需要localstorage还是sessionstorage，因为localstorage不删就一直存在，所以sessionstorage才符合登陆的状态。
              // res.data.data.token是登陆成功后，后台返回的，现在需要保存到浏览器中。
              window.sessionStorage.setItem("token", res.data.data.token);
              // 去首页
              // 要使用路由的方式跳转——编程式导航
              this.$router.push("/");
            }
          });
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
