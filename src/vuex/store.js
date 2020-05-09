import Vue from 'vue'
import Vuex from 'vuex'
import {Notification} from 'element-ui';
import {getRequest} from "../utils/api";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        hrs: [],
        cuuentHr: [],
        currentSession: '',
        currentHr: JSON.parse(window.sessionStorage.getItem("user")),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    // 方法提交，即定义需要提交的方法
    mutations: {
        //当前用户
        INIT_CURRENTHR(state, hr) {
            state.currentHr = hr;
        },
        //新建聊天对象。
        changeCurrentSession(state, currentSession) {
            console.log("新的发送对象为：" + JSON.stringify(currentSession));
            //添加到state
            Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false);
            // 更新聊天对象
            state.currentSession = currentSession;
        },
        // 构建前端的消息实体
        addMessage(state, msg) {
            let mss = state.sessions[state.currentHr.username + '#' + msg.to];
            // 使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上：
            if (!mss) {
              //  state.sessions[state.currentHr.username + '#' + msg.to] = [];
                Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, []);
            }
            state.sessions[state.currentHr.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        //浏览器本地的历史聊天记录可以在这里完成
        INIT_DATA(state) {
            //浏览器本地的历史聊天记录可以在这里完成
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        //初始化当前用户
        INIT_HR(state, data) {
            state.hrs = data;

        }
    },
    //做异步操作，同时提交mutatons。
    actions: {
        //建立Socket连接，服务端消息订阅。
        connect(context) {
            console.log("开始建立Socket连接");
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            console.log("建立stomp对象")
            //建立连接，执行成功和失败的回调
            context.state.stomp.connect({},
                () => {
                    // 调用 STOMP 中的 subscribe 方法订阅服务端发送回来的消息，并将服务端发送来的消息展示出来
                    context.state.stomp.subscribe('/user/queue/chat', msg => {
                        // msg.body 固定写法
                        let receiveMsg = JSON.parse(msg.body);
                        if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                            Notification.info({
                                title: '【' + receiveMsg.fromNickname + '】发来一条消息',
                                message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                                position: 'bottom-right'
                            })
                            // 接受前端的消息实体。
                            Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true);
                        }
                        // 是否新发标识
                        receiveMsg.notSelf = true;
                        //发送人
                        receiveMsg.to = receiveMsg.from;
                       //提交
                        context.commit('addMessage', receiveMsg);
                    })
                }, () => {
                    Notification.info({
                        title: "系统讯息",
                        message: "服务器连接失败",

                    })
                })
        },
        initData(context) {
            //加载历史聊天记录
            context.commit('INIT_DATA')
            getRequest("/chat/hrs").then(resp => {
                if (resp) {
                    //获取所以的用户
                    context.commit('INIT_HR', resp);
                }
            })
        }
    }
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;