import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login.vue'
import { TOKEN_API } from '@/api/acc_manage'
Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
            meta: { role: ['super', 'normal'] },
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('../pages/Index.vue'),
            meta: { role: ['super', 'normal'] },
            children: [
                {
                    path: '/index/home',
                    component: () => import('../pages/index/Home.vue'),
                    meta: { role: ['super', 'normal'] },

                },
                {
                    path: '/index/order',
                    component: () => import('../pages/index/Order.vue'),
                    meta: { role: ['super', 'normal'] },

                },
                {
                    // 商品列表
                    path: '/index/shop_list',
                    component: () => import('../pages/index/order_manage/Shop_list.vue'),
                    meta: { role: ['super', 'normal'] },

                },
                {
                    // 商品添加
                    path: '/index/shop_add',
                    component: () => import('../pages/index/order_manage/Shop_add.vue'),
                    meta: { role: ['super', 'normal'] },

                },
                {
                    // 商品分类
                    path: '/index/shop_class',
                    component: () => import('../pages/index/order_manage/Shop_class.vue'),
                    meta: { role: ['super', 'normal'] },

                },
                {
                    // 店铺管理
                    path: '/index/stroe_manage',
                    component: () => import('../pages/index/Stroe_manage.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 账号列表
                    path: '/index/acc_list',
                    component: () => import('../pages/index/acc_manage/Acc_list.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 添加账号 
                    path: '/index/add_acc',
                    component: () => import('../pages/index/acc_manage/Add_acc.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 修改密码
                    path: '/index/change_pwd',
                    component: () => import('../pages/index/acc_manage/Change_pwd.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 商品统计
                    path: '/index/count_sale',
                    component: () => import('../pages/index/counts/Count_sale.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 订单统计
                    path: '/index/count_order',
                    component: () => import('../pages/index/counts/Count_order.vue'),
                    meta: { role: ['super'] },

                },
                {
                    // 个人资料
                    path: '/index/mysef',
                    component: () => import('../pages/index/Mysef.vue'),
                    meta: { role: ['super', 'normal'] },

                }
            ]
        },
    ]
})

// 路由拦截
router.beforeEach((to, from, next) => {
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
    // next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
    // 发送axious，验证用户的身份是否登录

    // 只要用户不去登录页面，就判断token是否有效
    if (to.path != '/') {
        TOKEN_API(localStorage.token).then(res => {
            if (res.data.code == 0) {
                // s说明token有效
                // 权限拦截
                if (to.meta.role.includes(localStorage.role)) {
                    next()
                } else {
                    next(from.path)
                }
            } else {
                // 说明登录已经失效
                next('/')
            }
        })
    } else {
        next()
    }

})

export default router
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}