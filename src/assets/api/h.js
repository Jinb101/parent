/* eslint-disable */
// import axios from 'axios'
import qs from 'qs'
import config from '../js/const'
import store from '../../store/index'
import local from '../js/local'
import session from '../js/session'

function getToken() {
  let t = session.get('token') || ''
  if (!t) {
    t = local.get('history-token') || ''
    if (t) {
      session.set('token', t)
    }
  }
  return t
}

let tmt = 12e4; // 超时 2 分钟
// 添加请求拦截器
axios.interceptors.request.use(function (configs) {
  if (configs.timeout !== 20000) {
    let x = configs.data
    if (x) { x = qs.parse(x) } else { x = {} }
    x.n_id = local.get('nid') || ''
    x.access_token = getToken()
    configs.data = qs.stringify(x)
  }
  // 在发送请求之前做些什么
  return configs;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let code = response.data.code * 1
  let c = 0;
  switch (code) {
    case 400: // 登录失效
    case 404: // 登录失效
    case 401: // 登录失效
      // console.log('h.js 跳转登录')
      c = 400
      break
    case 402: // 该账号未申请老师，请申请为老师
      // console.log('h.js 跳转申请老师')
      c = 402
      break
    case 403: // 该账号审核中
      // console.log('h.js 跳转账号审核')
      c = 403
      break
    case 405: // 该账号审核未通过
      // console.log('h.js 跳转账号未通过')
      c = 405
      break
    case 408: // 该账号已禁用
      // console.log('h.js 跳转账号已禁用')
      c = 408
      break
    case 410: // token 已过期
      // console.log('h.js 跳转账号已禁用')
      c = 410
      break
    default:
  }
  if (c > 0) {
    store.dispatch('setUserStatus', c)
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/* eslint-disable */
function _post(opt, timeout = tmt, headers = {}, flag = 0) {
  if (!opt.baseUrl) {
    opt.baseUrl = config.api.http
  }

  let a = window.sessionStorage.getItem(config.sessionName) || '{}'
  a = JSON.parse(a)
  let token = a.token || ''
  if (token) {
    headers['access-token'] = token
  }
  return new Promise(function (resolve, reject) {
    axios({
      url: opt.baseUrl + opt.url,
      method: 'post',
      headers: headers,
      data: !!flag ? opt.data : qs.stringify(opt.data),
      timeout: timeout,
      onUploadProgress: function (e) {
        var pro = parseInt((e.loaded / e.total) * 100) / 100
        if (timeout > 8000) {
          store.dispatch('setProgress', pro * 100)
          if (pro >= 1) {
            setTimeout(() => {
              store.dispatch('setProgress', 0)
            }, 2000)
          }
          // resolve({ data: { type: 'progress', time: pro }, code: 2 })
        }
      },
      withCredentials: false // 是否允许发送 cookie
    })
      .then(function (response) {
        if (response.status === 200) {
          let res = response.data
          if (config.api.isData && Object.prototype.toString.call(opt.data) !== '[object FormData]') {
            res.requestData = opt.data
          }
          if (res.code === config.successCode) {
            resolve({ data: res, code: 1 })
          } else {
            resolve({ data: res, code: 0 })
          }
        } else {
          resolve({ data: response, code: 0 })
        }
      })
      .catch(function (error) {
        reject({ err: error.message, data: error, code: -1 })
      });
  });
}
function _get(opt, timeout = tmt, headers = {}, flag = 0) {
  if (!opt.baseUrl) {
    opt.baseUrl = config.api.http
  }
  return new Promise(function (resolve, reject) {
    axios({
      url: opt.baseUrl + opt.url,
      method: 'get',
      headers: headers,
      data: !!flag ? opt.data : qs.stringify(opt.data),
      timeout: timeout,
      withCredentials: false // 是否允许发送 cookie
    })
      .then(function (response) {
        if (response.status === 200) {
          let res = response.data
          resolve({ data: res, code: 1 })
        } else {
          resolve({ data: response, code: 0 })
        }
      })
      .catch(function (error) {
        reject({ err: error.message, data: error, code: -1 })
      });
  });
}

class ajax {
  post(url, data, timeout, headers) {
    let f = true
    if (typeof cLog === 'undefined') {
      f = false
    }
    if (config.debug || !!f) {
      console.log('%c -----debug-----------------------------start', 'border-bottom:2px dashed orange;')
      console.log('%c ' + url, 'background:#222;color:#fff;padding:10px')
      console.log('%c ' + JSON.stringify(data), 'background:#333;color:#fff;padding:5px')
      console.log('%c -----debug-----------------------------end', 'border-top:2px dashed orange;')
    }
    return _post({ url, data }, timeout, headers)
  }
  www(data, timeout, headers) {
    return _post(data, timeout, headers)
  }
  web(data, timeout, headers) {
    return _get(data, timeout, headers)
  }
  upload(url, data, timeout, headers) {
    return _post({ url, data }, timeout, headers, 1)
  }
}

export default new ajax()
