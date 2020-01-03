import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function addSpot(obj) {
  return instance.post('api/admin/spot/addSpot',obj)
}

export function delSpot(obj) {
  return instance.post('api/admin/spot/delSpot',obj)
}

export function delSpotAdmin(obj) {
  return instance.post('api/admin/spot/delSpotAdmin', obj)
}

export function getSpot(obj) {
  return instance.post('api/admin/spot/getSpot', obj)
}

export function modSpot(obj) {
  return instance.post('api/admin/spot/modSpot', obj)
}

export function getAllSpot() {
  return instance.post('api/admin/spot/getAllSpot')
}

export function getSpotByCid(obj) {
  return instance.post('api/user/Spot/getSpotByCid', obj)
}

export function getSpotInfo(obj) {
  return instance.post('api/user/Spot/getSpotInfo', obj)
}

export function addSpotAdmin(obj) {
  return instance.post('api/admin/spot/addSpotAdmin', obj)
}

export function modSpotAdmin(obj) {
  return instance.post('api/admin/spot/modSpotAdmin', obj)
}

export function getSpotByUserEmail(obj) {
  return instance.post('api/admin/spot/getSpotByUserEmail', obj)
}

export function getSpotByTicketId(obj) {
  return instance.post('api/user/spot/getSpotByTicketId', obj)
}

export function getSpotImgByTicketId(obj) {
  return instance.post('api/user/spot/getSpotImgByTicketId', obj)
}

export function getSpotNameByTicketId(obj) {
  return instance.post('api/user/spot/getSpotNameByTicketId', obj)
}

export function getThreeHotSpot() {
  return instance.get('api/user/Spot/getThreeHotSpot')
}
