import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/Login";
import pageChat from './views/chat/pageChat.vue'



Vue.use(Router)

export default new Router({
    routes:[

        //默认的路由导航也
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden:true
        },
        {
            path: '/chat',
            name: '聊天页',
            component: pageChat,
            hidden: true
        },

    ]
})