<template>
    <div id="uesrtext">
    <textarea
            v-model="content"
            autofocus="autofocus">
              </textarea>

        <div style="background-color:#fff;float: right;">
            <el-button type="success"
                       size="mini"
                       style="margin:0 20px 10px 10px"
                       @click="send"
                       plain>发送(S)
            </el-button>
        </div>
    </div>

</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'uesrtext',
        data() {
            return {
                content: '',
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {
            ...mapState([
                'sessions',
                'currentSession'
            ])
        },
        methods: {
            addMessage(e) {
                if (e.ctrlKey && this.content) {
                    this.send();
                }
            },
            send() {

                if (this.content != '') {
                    let msgObj = new Object();
                    msgObj.to = this.currentSession.username;
                    msgObj.content = this.content;
                    this.content = '';
                    console.log("当前发送消息的对象为：" + msgObj);
                    // 发送消息
                    this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj));
                    this.$store.commit('addMessage', msgObj);
                    this.content = '';
                }
            }
        },
        watch: {
            content: () => {
                document.getElementById(this.sessions[this.user.username + '#' + this.currentSession.username].size() - 1).scrollIntoView();
            }

        }
    }
</script>

<style lang="scss" scoped>
    #uesrtext {
        // position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100px;
        border-top: solid 1px #ddd;
    }

    textarea {
        padding: 10px;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
    }
</style>
