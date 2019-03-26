// 本来关于路由、axios的导入和使用，都可以在这个页面写，但是为了代码看起来更简洁，就分开写。

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 导入饿了吗UI这个下载的组件
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(elementUI)

// 导入别的文件都是用import？
// 导入自己写的文件，在这些文件里面，需要暴露才能在这里导入。当然这两个都是要下载才能使用的
// 1.导入 router
import router from './lib/router'
// 2.导入 http
import http from './lib/http'
Vue.use(http)


import mybreadxie from './components/mybreadcrumb.vue'
Vue.component('mybreadxie', mybreadxie)



new Vue({
  render: h => h(App),
  router//为什么这里可以直接写router？因为上面导入了呀
}).$mount('#app')
