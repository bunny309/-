import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入组件
import login from '../components/login.vue'
import index from '../components/index.vue'
// 这个页面主要是设置路由

import users from '../components/users.vue'
// import rights from '../components/rights.vue'
import roles from '../components/roles.vue'
import orders from '../components/orders.vue'

// 规则
let routes = [
    {
        path:'/login',
        component:login
    },
    //  首页
    {
        path:'/',
        component:index,
        children:[
            {
                path:'/users',
                component:users
            },
            // {
            //     path:'/rights',
            //     component:rights
            
            // },
            {
                path:'/roles',
                component:roles
            },
            {
                path:'/orders',
                component:orders
            }
        ]
    }
]

// 路由对象
let router = new VueRouter({
    routes
})
//  添加导航守卫 
router.beforeEach((to,from,next) => {
    // console.log(to);
    // console.log(from);
    // next();如果不添加next的话，页面就不能跳转到你想要去的页面了
    // console.log(next);
    // 除了登录页，其他页面都需要判断token是不是存在。所以做以下判断，如果当前是登录页，就直接过去；如果不是，就判断是否存在token。
    // 在实际工作中，可能使用的不是token ，可能是cookie，但是逻辑类似的。
    if(to.path == '/login'){
        next()
    }else{
        if(window.sessionStorage.getItem('token')){
            next()
        }else{
            // 注意：$message需要在哪调用？官方文档（饿了吗UI）放在在Vue实例里面。但是现在不是在Vue实例里，this是无法访问的，怎么办？我们在上面已经把Vue的构造函数导进来了，构造函数的原型是，
            Vue.prototype.$message.warning('请先登录')
            next('/login')
        }
    }
})
// 暴露
export default router;