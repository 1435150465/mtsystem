import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:5000'

// 22.获取订单列表
export const ORDER_LIST_API = (currentPage, pageSize) => axios.get('/order/list', { params: { currentPage, pageSize } })

// 23.查询订单
export const ORDER_SEARCH_API = (currentPage, pageSize,orderNo,consignee,phone,orderState,date) => axios.get('/order/search', { params: {currentPage, pageSize,orderNo,consignee,phone,orderState,date} })
   
// 25.修改订单
export const ORDER_EDIT_API = (id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState) => axios.post('/order/edit', { id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState} )
  