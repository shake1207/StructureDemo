import store from '@/store';
import axios from 'axios';
import router from '../router/index';
import { tip, to404ErrorPage } from './utils';

/**
 * 請求失敗的統一處理
 * @param { Number } status 請求失敗的狀態碼
 *
 */

const errorHandle = (status, msg) => {
  switch (status) {
    case 400:
      // 登入失敗
      tip(msg);
      break;
    case 401:
      // 未登入或認證過期
      if (router.currentRoute === 'Login') {
        console.log('Login Page');
        break;
      }
      store.dispatch('Authenticate/setAuth', {
        token: '',
        isLogin: false
      });
      tip(msg);
      break;
    case 403:
      // 權限不足 拒絕訪問
      tip(msg);
      break;
    case 404:
      // 請求失敗 ‵請求地址出錯:${msg.config.url}'
      to404ErrorPage();
      break;
    case 408:
      // 請求超時
      tip(msg);
      break;
    case 500:
      // 服務器內部錯誤
      tip(msg);
      break;
    case 501:
      // 服務未實現
      tip(msg);
      break;
    case 502:
      // 網關錯誤
      tip(msg);
      break;
    case 503:
      // 服務不可用
      tip(msg);
      break;
    case 504:
      // 網關超時
      tip(msg);
      break;
    case 505:
      // HTTP版本不受支持
      tip(msg);
      break;
    default:
      // 未定義錯誤
      console.log('response 沒有定義的錯誤碼' + msg);
  }
};

// axios 實例
var instance = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_API}`
});
// request 攔截器
instance.interceptors.request.use(
  config => {
    const token = store.state.Authenticate.token;
    token && (config.headers.Authoriaztion = `${token}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 攔截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response } = error;

    if (response) {
      // 成功發出請求且收到resp,但有error
      errorHandle(response.status, response.data.error);
      return Promise.reject(error);
    }
    // 成功發出請求但沒收到resp
    if (!window.navigator.onLine) {
      // 網路問題
      tip('您的網路目前有問題，請確認連線');
      return;
    }
    return Promise.reject(error);
  }
);

export default function(method, url, data = null) {
  method = method.toLowerCase();

  switch (method) {
    case 'post':
      return instance.post(url, data);
    case 'get':
      return instance.get(url, { params: data });
    case 'delete':
      return instance.delete(url, { params: data });
    case 'put':
      return instance.put(url, data);
    default:
      console.error(`未定義的method：${method}`);
      return false;
  }
}
