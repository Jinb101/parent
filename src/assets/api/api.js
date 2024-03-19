import js from '../js/const'
import link from './link'
import model from '../js/model'
import route from '../../router/index'
import store from '../../store/index'
import citys from '../../../static/js/e.json'
import { Toast, Dialog } from 'vant'

/* eslint-disable */
let loadupload = null

// 上传篇
let upload = (data, fn, fs) => {
  let url = 'com/common/uploadImage'
  let size = Math.ceil(data.imgs.size / 1024 / 1024)
  if (size >= 500) {
    error ? error({ msg: '文件过大' }) : null
    return 0
  }
  if (!loadupload || !loadupload.clear) {
    loadupload = Toast.loading({ duration: 0, message: '上传中', forbidClick: true })
  }

  let user = demo.$session.get('user', {})
  let tms = 1
  let sr = setInterval(() => {
    tms++
  }, 1e3)
  demo.ajax(js.api.http + url).upload(data, e => {

    demo.ajax(js.api.h5 + 'http/?type=upload').post({
      size,
      name: data.imgs.name || '上传',
      account: user.phone || user.account || user.openid || '无账号',
      type: data.type,
      num: e.progress || 0,
      nid: user.n_id,
      token: demo.$local.get('token', ''),
      key: md5(data.imgs.name || ''),
      port: 'web',
      url: e.code === 200 ? e.data.data : '',
      tms
    }, () => { })

    if (e.code === 2) {

      let num = (e.progress * 100)
      let l = num.toFixed(2)

      let ms = ''
      if (size > 20 && tms > 1 && num < 100 && num > 0) {
        let mb = (size / ((e.progress * size) / tms)) - tms
        if (mb < 60) {
          ms = '预计' + Math.ceil(mb) + '秒完成'
        } else {
          ms = '预计' + Math.ceil(mb / 60) + '分完成'
        }
      }
      let err = '上传中' + +l + '%' + (ms ? ms : '')

      if (num < 0 && data.type === 'video') {
        console.log('视频上传失败，上传超时')
        err = '上传超时'
        loadupload && loadupload.clear && loadupload.clear()
        loadupload = null
        Dialog.alert({
          message: err,
        }).then(() => { });
        error ? error({ msg: err }) : null
      }
      if (loadupload) {
        loadupload.message = err
      }

      store.dispatch('setProgress', l)
      if (e.progress >= 1) {
        setTimeout(() => { store.dispatch('setProgress', 0) }, 300)
      }
      return 0
    } else {
      loadupload && loadupload.clear && loadupload.clear()
      loadupload = null
      if (sr) {
        clearInterval(sr)
        sr = null
      }
    }
    fn(e)
  }, '', headers(fs))
}

let token = () => {
  let tk = demo.$local.get('token', '')
  if (tk) {
    demo.$cookie.set('token', tk)
  } else {
    tk = demo.$cookie.get('token').val || ''
  }
  return tk
}

let headers = (f) => {
  if (!f) return {}
  return {
    access_token: token()
  }
}

let get = (url, data, fn, fs) => {
  demo.ajax(js.api.http + url).get(data, e => {
    fn(e)
  }, '', headers(fs))
}

let post = (url, data, fn, fs) => {
  demo.ajax(js.api.http + url).post(data, e => {
    fn(e)
  }, 'json', headers(fs))
}

let exit = () => {
  demo.$local.clear('token')
  demo.$session.reset()
}

let babymore = (id) => {
  return new Promise((resolve, reject) => {
    http('bindacc', {}, r => {
      let a = r.filter(s => {
        return +s.id === +id
      })
      let token = ''
      if (a.length && a[0]) {
        token = a[0].access_token
      }
      resolve(token)
    })
  })
}

let temp = []

let nettype = () => {
  var ua = navigator.userAgent;
  var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  var networkType;
  switch (networkStr) {
    case 'wifi': networkType = 'wifi';
      break;
    case '4g': networkType = '4g';
      break;
    case '3g': networkType = '3g';
      break;
    case '3gnet': networkType = '3g';
      break;
    case '2g': networkType = '2g';
      break;
    default: networkType = 'other';
  }
  return networkType;
}


let http = async (name, data, fn, methods = 'post', isLogin = false, successCode = [200]) => {
  let m = ['get', 'post'].indexOf(methods) >= 0
  let method = methods
  if (!m) {
    method = 'post'
  }

  let tmd5 = md5(name + '-' + JSON.stringify(data))
  if (temp.indexOf(tmd5) >= 0) return 0
  temp.push(tmd5)

  if (!link.api[name]) {
    isLogin = true
  }
  let url = (isLogin ? link.loginApi[name] : link.api[name]) || ''
  if (!url) return 0

  let load = null
  let loads = false
  setTimeout(() => {
    if (loads) return 0
    load = Toast.loading({
      duration: 0
    })
  }, 1000)
  setTimeout(() => {
    if (load) {
      load.clear()
      load = null
    }
  }, 8000);
  // console.log(url);

  // let ntk = window.demotoken || ''
  // let babyuserid = demo.getUrlParam('babyuserid')
  // console.log(name);
  // if (babyuserid > 0 && name !== 'bindacc' && ntk === '') {
  //   ntk = await babymore(babyuserid)
  //   window.demotoken = ntk
  //   console.log(ntk, 'token 变更请求', name);
  // }

  // if (ntk) {
  //   demo.$local.set('token', ntk)
  // }

  let v = window.demo.$local.all()
  let d = Object.assign({}, data, {
    n_id: v.nid,
  })

  if (!d.n_id) {
    let atype = demo.getUrlParam('atype', '')
    d.type = atype ? atype : 1
    d.n_id = 0
  }

  if (d.page && typeof d.limit === 'undefined') {
    d.limit = 20
  }

  if (name === 'a1130' && d.phone) {
    delete d.n_id
  }

  if (isLogin) {
    d.access_token = v.token
  }

  if (method === 'post') {
    post(url, d, e => {
      if (url == 'parents/user/login' && window.location.href.indexOf("&tulis") > -1) {
        let newUrl = window.location.href.replace(/&tulis=1/, '');
        history.replaceState(null, '', newUrl);
        console.log('登录', newUrl);
      }
      loads = true
      if (load) {
        load.clear()
        load = null
      }
      temp = temp.filter(r => { return r !== tmd5 })
      if (e.code !== 200) {
        let ms = e.err || e.msg || e
        if (JSON.stringify(ms).length > 100) {
          let er = {
            '接口': url,
            '发送数据': d,
            '返回信息': ms,
            '请求时间': demo.timeout()
          }
          if ((er['返回信息'] + '').indexOf('登陆') < 1) {
            sdkerror.setMsg({ type: 'parent_error', ...er })
          }
        }
      }
      if (e.code === 0) {
        console.log(e)
        let err = e.msg || '当前网络较慢,请更换网络'
        if (e.err) {
          err = JSON.stringify(e.err)
        }
        if (err.indexOf('DOCTYPE html') >= 0) {
          err = e.data.statusText
        }
        return model.info(err, 2)
      }
      if (e.code === 401) {
        let token = demo.$local.get("token");
        if (window.location.href.indexOf("&tulis") > -1 && token) {
          return
        }
        if (window.location.hash === '#/login' ) {
          return 0
        }
          model.model(
            "请先登录",
            "温馨提示",
            (r) => {
              if (r) {
                demo.$local.set('login_path', window.location.hash)
                // model.info(e.msg || '未登录')
                let id = demo.getUrl(window.location.search).id
                if (id > 0) {
                  exit(true)
                  setTimeout(() => {
                    window.location.replace(window.location.origin + window.location.pathname + '?id=' + id + '#/login')
                  }, 400)
                }
              }
             else if(r == 0) {
                route.push("/index")
              }
            }
          );
          return 0

        // 微信重连
        // let url = js.api.h5 + 'auth/?type=web&event=login&id=' + d.n_id + '&url=' + encodeURIComponent(js.api.http) + '&hash=wxlogin'
        // loading
        // let num = window.sessionStorage.getItem('tryloginnum') || 0
        // if (!js.env && demo.vx().version(5) && +num === 0) {
        //   window.sessionStorage.setItem('tryloginnum', 1)
        //   return window.location.replace(url)
        // }
      }
      if (e.code === 402) {
        // login_bind
        route.push('/login_bind')
      }
      if ([403, 405, 408].indexOf(e.code) >= 0) {
        route.push('/login_status/' + e.code)
        return 0
      }
      if (e.code === 409) {
        let currentUrl = window.location.href;
        let token = demo.$local.get("token");
        if (currentUrl.indexOf("&tulis") > -1) {
          route.push('/index')
          return
        }else if (!token && currentUrl.indexOf("&tulis") === -1){
          let baseUrl = currentUrl.split('#')[0];
          let hash = currentUrl.split('#')[1];
          let newUrl = baseUrl.includes("?") ? baseUrl + "&tulis=1" : baseUrl + "?tulis=1";
          newUrl = newUrl + (hash ? '#' + hash : '');
          history.replaceState(null, '', newUrl);
          route.push('/index')
          return
        }
        demo.$local.set('login_path', window.location.hash)
        demo.$local.set('not_wx_admin','1')
        route.push('/login')
        exit(true)
        return model.info('用户未注册或未绑定微信')
      }
      if (e.code === 414) {
        route.push('/user_baby')
        return model.info('请完善宝宝年龄')
      }
      if (e.code === 413) {
        route.push('/bind_baby/0')
        return model.info('请绑定宝宝')
      }
      if (e.code === 411 && e.msg.indexOf('注册') >= 0) {
        route.push('/login_reg')
      }
      // if (e.code === 411) {
      //   model.info(e.msg)
      //   route.push('/login')
      // }
      if (successCode.indexOf(e.code) < 0) {
        return model.info(e.msg || e.err)
      }
      fn(e.data, e.code, e)
    }, isLogin)
  } else {
    get(url, d, e => {
      temp = temp.filter(r => { return r !== tmd5 })
      fn(e)
    }, isLogin)
  }
}

let city = (ids = [], type) => {
  if (!ids.length) {
    if (!type) return citys
    let v = citys.map(s => {
      s.text = s.n
      s.children = s.children.map(r => {
        r.text = r.n
        r.children = r.children.map(q => {
          q.text = q.n
          return q
        })
        return r
      })
      return s
    })
    return v
  }
  if (ids.length === 3) {
    let id = []
    if (type === 'zh') {
      // 汉字
      let b = citys.filter(r => {
        return r.n === ids[0]
      })[0] || {}
      if (!b.i) return id
      id[0] = b.n
      let c = b.children.filter(r => {
        return r.n === ids[1]
      })[0] || {}
      if (!c.i) return id
      id[1] = c.n
      let d = c.children.filter(r => {
        return r.n === ids[2]
      })[0] || {}
      if (!d.i) return id
      id[2] = d.n
    } else if (type === 'id') {
      // id
      let e = citys.filter(r => {
        return r.i === +ids[0]
      })[0] || {}
      if (!e.i) return id
      id[0] = e.n
      let f = e.children.filter(r => {
        return r.i === +ids[1]
      })[0] || {}
      if (!f.i) return id
      id[1] = f.n
      let g = f.children.filter(r => {
        return r.i === +ids[2]
      })[0] || {}
      if (!g.i) return id
      id[2] = g.n
    } else {
      // 索引
      let a = citys[+ids[0]]
      id[0] = a.i
      id[1] = a.children[+ids[1]].i
      id[2] = a.children[+ids[1]].children[+ids[2]].i
    }
    return id
  }
}

let classes = (id) => {
  let a = [{ name: '幼小衔接班', id: 1 }, { name: '托班', id: 2 }, { name: '小班', id: 3 }, { name: '中班', id: 4 }, { name: '大班', id: 5 }]
  if (id) {
    if (id === true) {
      a = [{ name: '全部', id: '' }].concat(a)
    } else {
      a = a.filter(r => {
        return r.id === +id
      })[0] || {}
    }
  }
  return a
}

let relation = () => {
  let a = ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他']
  return a.map((s, v) => {
    return { name: s, id: v + 1 }
  })
}

let isWwrkDot = (level, data, flag) => {
  let arr = {
    '272': 'administration',
    '7': 'binding_audit',
    '12': 'staff_count',
    '271': 'my_assessment_count|me_assessment_count',
    '6': 'satisfaction',
    '426': 'overstaffing',
    '415': 'repair_count',
    '10': 'receive|purchase'
  }
  let l = level.map(r => {
    return r.level
  }).filter(s => {
    return arr[s]
  })
  if (l.length) {
    let a = l.map(s => {
      let o = arr[s].split('|')
      let len = o.map(r => {
        return data[r]
      })
      return len.concat(0).reduce((a, b) => { return a + b }, 0)
    })
    if (flag) return a.map((r, v) => {
      return { num: r, level: l[v] }
    }).filter(s => {
      return s.num > 0
    })
    let max = a.concat(0).reduce((a, b) => { return a + b }, 0)
    return max > 0 ? demo.rand(5) : 0
  }
  return []
}

export default {
  get, post, token, upload, exit, link, http, city, classes, isWwrkDot, relation, nettype
}
