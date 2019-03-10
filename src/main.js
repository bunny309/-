import Vue from 'vue'
import App from './App.vue'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(elementUI)

Vue.config.productionTip = false

// 导入 router
import router from './lib/router'
// 导入抽取的axios插件
import http from './lib/http'
Vue.use(http)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
