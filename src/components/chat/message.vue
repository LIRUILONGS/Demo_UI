<template>

    <div id="message">
        <el-divider content-position="left"><font
                style="font-weight:bold;font-size:20px;margin-bottom: 20px">{{currentSession.name}}</font></el-divider>
        <GeminiScrollbar
                class="my-scroll-bar" style="overflow-x: hidden;"  >
        <div style=";overflow-x: hidden;" v-scroll-bottom="sessions"  >
            <ul v-if="currentSession" style="overflow-x: hidden;" >

                    <li v-for="(entry,index) in sessions[user.username+'#'+currentSession.username]" :id="index"
                        :key="index">
                        <p class="time">
                            <span>{{entry.date | times}}</span>
                        </p>
                        <div class="main"
                             :class="{self:entry.self}">
                            <img class="avatar"
                                 :src="entry.self ? user.userface : currentSession.userface"
                                 alt="">
                            <p class="text"  v-scroll-bottom="sessions" >{{entry.content}}</p>
                        </div>
                    </li>

            </ul>

        </div>  </GeminiScrollbar>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'message',
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {...mapState(['sessions', 'currentSession']),},
        filters: {
            times(date) {
                if (date) {
                    date = new Date(date);
                }
                return ` ${date.getMonth() + 1} 月 ${date.getDate()} 日 ${date.getHours()}:${date.getMinutes()}`;
            }
        },
        mounted: {
            itme(){

                    document.getElementById(this.sessions[this.user.username + '#' + this.currentSession.username].size() - 1).scrollIntoView();

            }
        },

        directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
            // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
            'scroll-bottom'(el) {
                el.scrollIntoView(false);
             ///   el.scrollIntoView();
         //    el.scrollTop = el.scrollHeight;

         window.console.log(el)
            }
        }

    }
</script>

<style lang="scss" scoped>
    .my-scroll-bar {
        margin-top: 10px;
        height: 450px;
        overflow-x: hidden;
    }

    /* override gemini-scrollbar default styles */

    /* vertical scrollbar track */
    .gm-scrollbar.-vertical {
        background-color: #f0f0f0
    }

    /* horizontal scrollbar track */
    .gm-scrollbar.-horizontal {
        background-color: transparent;
    }

    /* scrollbar thumb */
    .gm-scrollbar .thumb {
        background-color: rebeccapurple;
    }

    .gm-scrollbar .thumb:hover {
        background-color: fuchsia;
    }


    #message {
        padding: 10px 0px;
        max-height: 500px;
        background: transparent;
        list-style: none;
        overflow-x: hidden;

        ul {
            list-style-type: none;
            padding-left: 0px;
            overflow-x: hidden;

            li {
                margin-bottom: 5px;
            }
        }

        .time {
            text-align: center;
            margin: 7px 0;

            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                background-color: #dcdcdc;
                border-radius: 2px;
            }
        }

        .main {
            .avatar {
                float: left;
                margin: 0 10px 0 10px;
                border-radius: 3px;
                width: 30px;
                height: 30px;
            }

            .text {
                display: inline-block;
                padding: 0 10px;
                max-width: 80%;
                background-color: #fafafa;
                border-radius: 4px;
                line-height: 30px;
            }
        }

        .self {
            text-align: right;

            .avatar {
                float: right;
                margin: 0 20px 0 10px;
                border-radius: 3px;
                width: 30px;
                height: 30px;
            }

            .text {
                display: inline-block;
                padding: 0 10px;
                max-width: 80%;
                background-color: #b2e281;
                border-radius: 4px;
                line-height: 30px;
            }
        }
    }
</style>
