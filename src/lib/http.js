import axios from 'axios'

// 设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 实现install方法
// 暴露
export default {
    install(Vue){
        Vue.prototype.$http = axios
    }
}