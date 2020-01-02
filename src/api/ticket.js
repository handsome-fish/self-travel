import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function addTicket(obj) {
  return instance.post('api/admin/ticket/addTicket',obj)
}

export function delTicket(obj) {
  return instance.post('api/admin/ticket/delTicket',obj)
}

export function getTicket(obj) {
  return instance.post('api/admin/ticket/getTicket', obj)
}

export function modTicket(obj) {
  return instance.post('api/admin/ticket/modTicket', obj)
}

