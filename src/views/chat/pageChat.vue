<template>
    <div id="app">
        <transition name="el-zoom-in-center">
            <div v-show="show3">
                <div class="sidebar">
                    <!--            <card></card>-->
                    <list></list>
                    <div
                            :class="['meun-switch animated flex-row ys-float-btn',uploadflag ? 'active rubberBand off' : 'leave jello']"
                            @mouseleave="uploadleave"
                            @mouseenter="uploadenter"
                            v-if="uploadShow"
                            @click.stop="logout"
                    >
                        <img :src="require('@/assets/logo.png')"/>
                    </div>
                </div>
                <div class="main">
                    <message></message>
                    <usertext></usertext>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>

    import list from '../../components/chat/list.vue'
    import message from '../../components/chat/message.vue'
    import usertext from '../../components/chat/usertext.vue'
    import screenfull from 'screenfull'

    export default {
        name: 'pageChat',
        data() {
            return {
                //默认不全屏
                isFullscreen: false,
                show3: false,
                uploadShow: false,
                uploadflag: true,
            }
        },
        created() {
            this.left = document.documentElement.clientWidth - 50;
            this.top = document.documentElement.clientHeight*0.8;
        },
        mounted: function () {
            this.uploadanimated();
            this.$store.dispatch('connect');
            this.inintview();
        },
        methods: {
            /*注销*/
            logout () {
                    this.$confirm('此操作注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest('/logout');
                        window.sessionStorage.removeItem("user");
                        // 清除缓存
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            inintview() {
                setTimeout(() => {
                    this.show3 = true;
                }, 1000)
            },
            uploadenter() {
                this.uploadflag = true;
            },
            uploadleave() {
                this.uploadflag = false;

            },
            uploadanimated() {
                setTimeout(() => {
                    this.uploadShow = true;
                    setTimeout(() => {
                        this.uploadleave();
                    }, 1000);
                }, 1000);
            },
            click() {
                // 如果不允许进入全屏，发出不允许提示 浏览器不能全屏
                if (!screenfull.enabled) {
                    this.$message({
                        message: '浏览器不能全屏',
                        type: 'warning'
                    })
                    return false
                }
                screenfull.toggle()
                this.$message({
                    message: '全屏啦',
                    type: 'success'
                })
            }

        },
        components: {
            list,
            message,
            usertext
        }
    }
</script>

<style lang="scss" scoped>
    .off{
        -webkit-animation:1s seconddiv;
        background: transparent;
    }

    @keyframes seconddiv{
        0% {transform: scale(1.4,1.4);}
        10% {transform: scale(1,1);}
        25% {transform: scale(1.2,1.2);}
        50% {transform: scale(1,1);}
        70% {transform: scale(1.2,1.2);}
        100% {transform: scale(1,1);}
    }
    .meun-switch {
        position: fixed;
        top: 90px;
        left: 0px;
        z-index: 2001;
        cursor: pointer;
        width: 150px;
        height: 150px;
        padding: 5px;
        transition: all 0.25s;

        &.leave {
            left: -65px;
        }

        &.active {
            left: 0;
        }

        &:hover {
            transform: scale(1.02);
        }

        img {
            width: 120px;
            height: 120px;
        }
    }

    #particles-js {
        width: 100%;
        height: calc(100% - 100px);
        position: absolute;
        overflow: hidden;
    }

    #app {
        /*背景裁剪在背景边框内部*/
        background-clip: padding-box;
        /*// 边框样式*/
        border: 1px solid #eaeaea;
        /*// 边框阴影*/
        box-shadow: 0 0 25px #cac6c6;
        margin: 20px auto;
        width: 1100px;
        height: 100%;
        overflow: hidden;
        border-radius: 10px;
        overflow-x: hidden;

        .sidebar,
        .main {
            height: 100%;
        }

        .sidebar {
            float: left;
            color: #f4f4f4;
            background-color: transparent;
            width: 300px;
            height: 100%
        }

        .main {
            position: relative;
            overflow: hidden;
            background-color: transparent;
        }
    }
</style>