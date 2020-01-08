import axios from 'axios';

const instance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function getProvince(obj) {
  return instance.post('api/user/location/getProvince',obj)
}

export function getCity(obj) {
  return instance.post('api/user/location/getCity',obj)
}
