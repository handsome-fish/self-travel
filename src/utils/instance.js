import axios from 'axios';
import {fileUpload, get, post} from "./fetch";

const instance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
});

export default {
  get,
  post
}
