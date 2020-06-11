// 商品管理模块：

// http://172.16.4.251:5000
// 192.168.31.219:5000
// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:5000'

// 12.商品的添加分类
//cateName 分类名称  state 是否启用
export const ADD_SHOPCLASS_API = (cateName, state ) =>  axios.post('/goods/addcate', { cateName, state })

// 13.获取商品分类
// currentPage当前页码   currentPage每页条数
export const GET_SHOPCLASS_API = (currentPage,pageSize) =>  axios.get('/goods/catelist', {params: { currentPage,pageSize}})


// 14.删除商品分类
// id   要删除的商品id
export const DEL_SHOPCLASS_API = id =>  axios.get('/goods/delcate', {params: { id}})

// 15.修改分类
// id  要修改的id  cateName  修改的分类名称   state 修改的状态栏
export const EDIT_CATE_API = (id, cateName,state ) =>  axios.post('/goods/editcate', { id, cateName,state })

// 16.商品所有分类的名称
export const GET_ALLSHOP_API = () =>  axios.get('/goods/categories')





// 17.商品图片上传接口
export const UPLOAD_DOODS_PHOTO_API = () =>  axios.post('/goods/goods_img_upload')


// 18.添加商品
// id  要修改的id  cateName  修改的分类名称   state 修改的状态栏
export const GOODS_ADD_API = (name, category,price,imgUrl,goodsDesc ) =>  axios.post('goods/add', { name, category,price,imgUrl,goodsDesc  })



// 19.获取商品列表
export const GET_SHOP_LIST_API = (currentPage,pageSize) =>  axios.get('/goods/list', {params: { currentPage,pageSize}})

// 20.删除商品
export const GOODS_DEL_API = id =>  axios.get('/goods/del', {params: { id}})

// 21.修改商品
export const CHANGE_GOODS_API = (name, category,price,imgUrl,goodsDesc,id ) =>  axios.post('/goods/edit', { name, category,price,imgUrl,goodsDesc ,id })

// 26.获取店铺详情
export const SHOP_INFO_API = () =>  axios.get('/shop/info')

// 28.店铺内容修改
export const SHOP_EDIT_API = (id, name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics ) =>  axios.post('/shop/edit', {id, name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics})


// 29.首页报表接口
export const GET_ORDER_TOTAL_API = () =>  axios.get('/order/totaldata')

// 30.订单报表接口
export const GET_TABLE_ORDER_API = date => axios.get('/order/ordertotal',{params:{date}})


