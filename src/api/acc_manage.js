// 账号管理模块
// 192.168.31.219

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:5000'
// 1.登录接口
//account用户名   password密码
export const LOGIN_API = (account, password) =>  axios.post('/users/checkLogin', { account, password })

// 2.添加账号
//account用户名   password密码   userGroup用户组
export const ADD_ACCOUNT_API = (account, password,userGroup) =>  axios.post('/users/add', { account, password,userGroup })

// 3.获取账号列表
// currentPage当前页码   currentPage每页条数
export const GETACC_API = (currentPage,pageSize) =>  axios.get('/users/list', {params: { currentPage, pageSize }})


// 4.账号删除
// currentPage当前页码   currentPage每页条数
export const DELACC_API = (id) =>  axios.get('/users/del', {params: { id}})

// 5.账号批量删除
export const DELACC_SOME_API = (ids) =>  axios.get('/users/batchdel', {params: { ids}})

// 6.修改账号
export const CHANGE_ACC = (id,account,userGroup) =>  axios.post('/users/edit', {id,account,userGroup} )

// 7.检查旧密码是否正确
export const CHECK_OLDPWD = (id,oldPwd) =>  axios.get('/users/checkoldpwd', {params: { id,oldPwd}})

// 8.修改密码
export const CAHNGE_PWD_API = (id,newPwd) =>  axios.post('/users/editpwd', {id,newPwd} )

// 9.获取账号个人中心
export const PERSONAL_API = (id) =>  axios.get('/users/accountinfo', {params: { id}})


// 11.验证token是否过期
export const TOKEN_API = token =>  axios.get('/users/checktoken', {params: { token}})

 
