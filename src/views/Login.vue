<template>
    <div v-loading.fullscreen.lock="loading"
         class="login"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
        <vue-particles color="#409EFF"
                       :particleOpacity="0.9"
                       :particlesNumber="1"
                       shapeType="circle"
                       :particleSize="4"
                       linesColor="#409EFF"
                       :linesWidth="1"
                       :lineLinked="true"
                       :lineOpacity="0.7"
                       :linesDistance="150"
                       :moveSpeed="4"
                       :hoverEffect="true"
                       hoverMode="grab"
                       :clickEffect="true"
                       clickMode="push"></vue-particles>
        <el-form :rules="rules"
                 :model="loginFrom"
                 class="logContainer"
                 ref="loginFrom"
                 @keydown.enter.native="loginSubmit">
            <div class="logtitle">
                <div v-if="userface!=''">
                        <el-avatar  :size="65"   :src="userface"></el-avatar>
                    <el-divider  ><b>{{hrname}}</b></el-divider>
                </div>
                <div v-else >
                <i  class="fa fa-drupal fa-2x"
                   style="color: #505458"/>&nbsp;微聊天DemO</div>
            </div>

            <el-form-item prop="username">
                <el-input type="text"
                          v-model="loginFrom.username"
                          placeholder="请输入用户名"
                          class="inputbg"
                          auto-complete="off"   @change="hrImg">
                    <i slot="prefix"
                       class="el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password"
                          v-model="loginFrom.password"
                          class="inputbg"
                          placeholder="请输入密码"
                          auto-complete="off">
                    <i slot="prefix"
                       class="el-icon-lock"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="loginFrom.code"
                          auto-complete="off"
                          placeholder="验证码"
                          style="width: 43%"
                          @keyup.enter.native="loginSubmit">
                    <i slot="prefix"
                       class="el-icon-view"></i>
                </el-input>
                <div class="login-code">
                    <el-tooltip content="嘻，换一个试试！"
                                placement="bottom"
                                effect="light">
                        <img :src="codeUrl"
                             @click="getCode">
                    </el-tooltip>
                </div>
            </el-form-item>
           <!-- <el-checkbox v-model="loginFrom.rememberMe"
                         style="margin:0 0 25px 0;">
                记住我
            </el-checkbox>-->
            <el-button type="primary"
                       style="width:100%; position: relative;"
                       @click="loginSubmit">登录
            </el-button>
        </el-form>
    </div>
</template>

<script>
    // import {postKeyValueRequest} from '../utils/api';
    // 在main.js里以插件形似全局导入


    export default {
        data() {
            return {
                codeUrl: '',
                cookiePass: '',
                userface:'',
                hrname:'',
                loading: false,
                redirect: undefined,
                loginFrom: {
                    username: '',
                    password: '',
                    code: '',
                    rememberMe: ''
                },
                checked: true,
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 4, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: blur()},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    code: [{required: true, trigger: 'change', message: '验证码不能为空'}]
                }
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            },

        },
        created() {
            this.getCode()

        },
        methods: {
            getCode() {
                this.getRequest("/login/auth/code").then(resp => {
                    if (resp) {
                        this.codeUrl = resp.img;
                    }
                });
            },
            hrImg() {
                if (this.userface!='') {
                    this.userface = '';
                }
                let url = "?username="+this.loginFrom.username;
                this.getRequest("/login/auth/img"+url).then(resp =>{
                    if (resp){
                        this.userface = resp.userface;
                        this.hrname = resp.name;
                    }
                });

            },
            loginSubmit() {
                //提交前空值校验
                this.$refs.loginFrom.validate((valid) => {
                    if (valid) {
                        // alert('submit!');
                        this.loading = true;
                        this.postKeyValueRequest('/doLogin', this.loginFrom
                        ).then(data => {
                            this.loading = false;
                            if (data) {
                                //方法将 JavaScript 的json对象转换为字符串。
                                //将得到数存储在SessionStorage里
                                window.sessionStorage.setItem("user", JSON.stringify(data.obj));
                                this.$router.replace('/chat');
                                this.$store.dispatch('initData');
                            }
                        })
                    } else {
                        this.$notify.info({
                            title: '系 统 讯 息',
                            message: '输入框信息不完整哦!',
                            showClose: false,
                            offset: 100,
                            duration: 5000,
                            customClass: 'fontclass'
                        });
                    }
                });

            }
        },
    }
</script>

<style>
    #particles-js {
        width: 100%;
        height: calc(100% - 100px);
        position: absolute;
    }

    .login {
        display: flex;
        justify-content: center;
        align-items: center;

        background-size: cover;
    }

    .inputbg {
        background-color: transparent;
        width: 250px;
    }

    .fontclass {
        font-size: 35px;
        font-family: 站酷庆科黄油体;
    }

    .logContainer {
        /* //圆角边框*/
        border-radius: 15px;
        /*背景裁剪在背景边框内部*/
        background-clip: padding-box;
        /*//外边距*/
        margin: 250px auto;
        /*//宽度*/
        width: 250px;
        /*//内边距*/
        padding: 35px 35px 15px 35px;
        /*//背景色*/
        background: transparent;
        background-image: radial-gradient(#ffffff, transparent);
        /*// 边框样式*/
        border: 1px solid #f1e3e3;
        /*// 边框阴影*/
        box-shadow: 0 0 25px #cac6c6;
    }

    .logtitle {
        margin: 0px auto 20px auto;
        text-align: center;
        color: #505458;
        font-family: 站酷庆科黄油体;
        border-radius: 10px;
        font-size: 20px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .loginRen {
        text-align: center;
        margin: 0px 0px 35px 0px;
    }

    .fontclass {
        font-size: 35px;
        font-family: 站酷庆科黄油体;
    }

    .login-code {
        width: 33%;
        display: inline-block;
        height: 38px;
        margin-left: 10px;
    }

    .login-code img {
        cursor: pointer;
        vertical-align: middle;
    }
</style>