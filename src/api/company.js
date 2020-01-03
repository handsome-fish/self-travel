import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function addCompany(obj) {
  return instance.post('api/admin/company/addCompany', obj)
}

export function delCompany(obj) {
  return instance.post('api/admin/company/deleteCompany', obj)
}

export function modCompany(obj) {
  return instance.post('api/admin/company/updateCompany', obj)
}

export function getCompanyBySpotId(obj) {
  return instance.post('api/admin/company/getCompanyBySpotId', obj)
}

export function getCompanyType() {
  return instance.get('api/admin/company/getCompanyType');
}

