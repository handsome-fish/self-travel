import axios from 'axios';

const instance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function register(obj) {
  return instance.post('api/user/register',obj)
}

export function login(obj) {
  return instance.post('api/user/login',obj)
}

export function findAll() {
  return instance.get('api/admin/user/findAll')
}

export function deleteUser(obj) {
  return instance.post('api/admin/user/deleteUser', obj)
}

export function updateUser(obj) {
  return instance.post('api/admin/user/updateUser', obj)
}

export function findOne(obj) {
  return instance.post('api/admin/user/findOne', obj)
}

export function recharge(obj) {
  return instance.post('api/user/account/recharge', obj)
}

export function updatePassword(obj) {
  return instance.post('api/user/account/updatePassword', obj)
}

export function addQuestion(obj) {
  return instance.post('api/user/question/addQuestion', obj)
}

export function getAllQuestions(obj) {
  return instance.post('api/user/question/getQuestionBySpotId', obj)
}

export function addAnswer(obj) {
  return instance.post('api/user/question/addAnswer', obj)
}

export function getAnswers(obj) {
  return instance.post('api/user/question/getAnswers', obj)
}

export function sendMail(obj) {
  return instance.post('api/user/mail/sendMail', obj)
}

export function checkMail(obj) {
  return instance.post('api/user/mail/checkWords', obj)
}

export function getRecommendation(obj) {
  return instance.post('api/user/recommend/getRecommend', obj)
}

export function getDetail(obj) {
  return instance.post('api/user/recommend/getDetail', obj)
}
