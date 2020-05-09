import axios from 'axios'
import router from '../router'
import {Notification} from 'element-ui';
/*
//封装网络请求方法
 */
/**
 * 统一处理网络请求的响应拦截处理方式，
 */
axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.status == 500) {
        Notification.error({  title: '系统讯息',message: success.data.msg})
        return;
    }
    if (success.data.msg) {
        Notification.success({title: '系统讯息',message: success.data.msg})
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Notification.error({title: '系统讯息',message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        Notification.error({title: '系统讯息',message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        Notification.error({title: '系统讯息',message: '尚未登录，请登录'})
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            Notification.error({title: '系统讯息',message: error.response.data.msg})
        } else {
            Notification.error({title: '系统讯息',message: '未知错误!'})
        }
    }
    return;
})
//post请求的封装K-v形式
let base = '';
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }

            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
}
//传递json的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'POST',
        url: `${base}${url}`,
        data: params,
    })
}
// put请求封装
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
    })
}
// get请求封装
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params,
    })
}
// delete请求封装
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params,
    })
}

export const ininConnts = (store) => {
        store.dispatch('connect');
}