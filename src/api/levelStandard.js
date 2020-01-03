import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function getLevelDetail(obj) {
  return instance.post('api/admin/level/getLevelDetail',obj)
}

export function updateLevel(obj) {
  return instance.post('api/admin/level/updateLevel',obj)
}

export function addLevel(obj) {
  return instance.post('api/admin/level/addLevel',obj)
}

export function getAllLevel(obj) {
  return instance.post('api/admin/level/getAllLevel',obj)
}

export function getRebateByUserEmail(obj) {
  return instance.post('api/admin/level/getRebate', obj)
}
