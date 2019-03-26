<template>
  <el-container class="index-container">
    <el-header class="index-header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col class="header-center" :span="16">
          <div class="grid-content bg-purple-light">电商后台管理系统</div>
        </el-col>
        <el-col :span="4" class="header-right">
          <div class="grid-content bg-purple">
            <el-button type="success" @click="logout">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-row class="tac">
        <el-aside class="index-aside" width="200px">
          <!-- 饿了吗UI导航 -->
          <el-menu default-active="2" class="el-menu-vertical-demo" router>
            <el-submenu :index="index+''" v-for="(item,index) in menuList">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item v-for="it in item.children" :index="'/'+it.path">
                <span class="el-icon-menu">{{it.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
      </el-row>
      <el-main class="index-main">
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 这个页面实现什么功能？————
// 在登录页进行了一系列的验证，包括，发送请求，后台判断用户名和密码是否正确
// 这个页面还需要进行什么验证？这个页面实现的是————如果用户没有登录（直接访问网址），或者登陆不成功，就不能进入到首页
// 这个功能有两种实现方式：
    // 第一种,使用钩子函数beforeCreate()
    // 第二种,在路由设置那里,用导航守卫

export default {
  // 为什么使用beforeCreate(),
  // 页面的跳转，跳转到首页，首页这个组件从无到有。这个过程会触发什么，生命周期函数，或者生命周期钩子函数。因为登陆成不成功还要靠后台判断，当登陆不成功的时候，就不需要“加载”这个组件，直接打回登录页，所以，使用beforecreate（），这个函数的特点是，还没获取组件里的数据data等属性（所以页面也没显示）。
  // beforeCreate() {
  //   //  只需要使用缓存 所以这个钩子即可
  //   if (window.sessionStorage.getItem("token")) {
  //     // 实际项目会结合后台对token的存在与否进行判断，如果登陆成功，就返回token，否则就没有得返回
  //     // 不用管
  //   } else {
  //     // 没有
  //     // 提示用户
  //     this.$message.warning("哥们请先登录哦");
  //     setTimeout(() => {
  //       // 回到登录页 编程式导航
  //       this.$router.push("/login");
  //     }, 500);
  //   }
  // },
  data(){
     return {
      menuList: []
    };
  },
  // 这个是饿了吗UI的一个组件
  methods: {
    logout() {
      this.$confirm("你确定要退出吗，o(╥﹏╥)o", "提示", {
        confirmButtonText: "残忍退出",
        cancelButtonText: "好心留下",
        type: "warning"
      })
        .then(() => {
          // 确定
          // 删除token
          window.sessionStorage.removeItem("token");
          // 返回登录页
          this.$router.push("/login");
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "你真好 (* ￣3)(ε￣ *)"
          });
        });
    }
  },
   // 生命周期钩子
  async created() {
    let res = await this.$http.get("menus");
    // console.log(res);
    this.menuList = res.data.data;
  }
};
</script>

 <style>

.index-container {
  height: 100%;
}
.index-header {
  height: 60px;
  background-color: #b3c0d1;
  line-height: 60px;
}
.header-center {
  text-align: center;
  font-size: 30px;
  color: white;
  font-weight: 700;
}
.header-right {
  text-align: right;
}
.index-aside {
}

.el-main.index-main {
   background-color: #e9eef3;
   /* 去掉顶部默认padding */
  padding-top: 0;

}

.el-menu-vertical-demo template span {
  font-size: 14px;
}
</style>
