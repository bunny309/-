// 这个页面主要是处理了一些关于axios调用接口获取数据的，，，

import axios from 'axios'

// 设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置axios拦截器（回调函数）
axios.interceptors.request.use(
    function(config){
        if(config.url.indexOf('/login')==-1){
            config.headers.Authorization = window.sessionStorage.getItem('token')
        }
        return config;
    },
)
// 实现install方法
// 暴露
export default {
    install(Vue){
        Vue.prototype.$http = axios
    }
}