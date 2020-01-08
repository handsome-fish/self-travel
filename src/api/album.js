import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export function upload(obj) {
  return instance.post('api/user/album/upload', obj)
}

export function getAlbumBySpotID(obj) {
  return instance.post('api/user/album/getAlbumBySpotId', obj)
}

export function addLikeNumber(obj) {
  return instance.post('api/user/zan/addZan', obj)
}

export function getCommentByAlbumID(obj) {
  return instance.post('api/user/comment/getComments', obj)
}

export function getCommentBySpotID(obj) {
  return instance.post('api/user/album/getCommentBySpotID', obj)
}

export function delComment(obj) {
  return instance.post('api/user/album/delComment', obj)
}

export function addComment(obj) {
  return instance.post('api/user/comment/setComment', obj)
}

export function delAlbumById(obj) {
  return instance.post('api/user/album/delAlbumById', obj)
}
