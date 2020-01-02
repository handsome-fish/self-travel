import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function newOrder(obj) {
  return instance.post('api/user/order/newOrder', obj)
}

export function newCompanyOrder(obj) {
  return instance.post('api/user/CompanyOrder/newOrder', obj)
}

export function getOrder(obj) {
  return instance.post('api/user/order/getOrder', obj)
}

export function updateOrderState(obj) {
  return instance.post('api/user/order/updateOrderState', obj)
}

export function getNormalOrder(obj) {
  return instance.post('api/user/NormalOrder/getNormalOrder', obj)
}

export function payTravelOrder(obj) {
  return instance.post('api/user/order/toNoConsume', obj)
}

export function refundTravelOrder(obj) {
  return instance.post('api/user/order/toRefund', obj)
}

export function payCompanyOrder(obj) {
  return instance.post('api/user/CompanyOrder/toNoConsume', obj)
}

export function refundCompanyOrder(obj) {
  return instance.post('api/user/CompanyOrder/toRefund', obj)
}
