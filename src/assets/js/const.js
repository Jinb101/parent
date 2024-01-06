import def from './def'
import table from './form'

let prefix = window.location.origin
let pathname = prefix + window.location.pathname
let api = {
  http: prefix + '/api/', // 请求地址
  pdf: prefix + '/pdf/web/viewer.html?file=',
  wxValidate: pathname + 'static/html/wxbind.html',
  pay: pathname + 'static/pay/',
  share: pathname,
  h5: prefix + '/500/'
}
let env = process.env.NODE_ENV === 'development'

if (env) {
  api.http = '/env/'
  api.h5 = 'http://127.0.0.5/500/'
}

if (window.LINKTOAPIWWW) {
  api.http = window.LINKTOAPIWWW
}

let html = (name) => {
  return (env ? '../../../' : './') + 'static/frame/' + name + '.html'
}

let wxshare = () => {

}

let frametoh5page = (type, data = {}, type2 = '') => {
  let os = {
    type: 'web',
    // eslint-disable-next-line
    ext: { token: demo.$local.get('token'), ...data },
    // eslint-disable-next-line
    id: demo.$local.get('nid'),
    page: type2 || type
  }
  let h5 = api.h5.indexOf('127.0.') >= 0 ? 'http://localhost:8506' : api.h5 + 'h5/h5page'
  // eslint-disable-next-line
  let url = h5 + '/?type=' + type + '&h5=' + demo.es6().encrypt(os, '', os.type)
  return url
}

// let a = frametoh5page('media', { country_study_id: 161 }, 'chantdet2')

let wxshareh5 = (type, obj = {}) => {
  // eslint-disable-next-line
  let e = demo.$session.get("user", {});
  let os = {
    type: "web",
    // eslint-disable-next-line
    nid: demo.$local.get("nid", ""),
    time: Date.now(),
    m: e.openid || "",
    cid: e.id || "",
    ...obj
  }
  // eslint-disable-next-line
  let a = demo.es6().encrypt(os, "", "poster");
  // eslint-disable-next-line
  let url = api.h5 + "h5/poster/?type=" + type + "&h5=" + a;
  if (env) {
    console.log(url);
  }
  return url;
}

let wxcode = (hash, page) => {
  // eslint-disable-next-line
  let localname = 'youeryuanweb' + demo.getUrlParam('id')
  // eslint-disable-next-line
  let id = demo.$local.get('nid', demo.getUrlParam('id'))
  let baseurl = [api.h5, 'auth/index.html?type=web&id=', id, '&url=', encodeURIComponent(api.http), '&local=', localname, '&hash=', hash || '']
  if (page) {
    baseurl = baseurl.concat(['&page=', encodeURIComponent(page)])
  }
  let url = baseurl.join('')
  window.location.href = url
}

let wxlogin = () => {
  // eslint-disable-next-line
  let d = demo.$local.all();
  // 微信重连
  let url =
    api.h5 +
    "auth/?type=web&event=login&id=" +
    d.nid +
    "&url=" +
    encodeURIComponent(api.http) +
    "&hash=wxlogin";

  if (window.location.href.indexOf("/beta") > 0) {
    url += "&page=beta/parent/";
  }
  if (env) {
    console.log(url);
    return 0
  }
  return window.location.replace(url);
}

let btnColor = 'linear-gradient(rgb(255, 83, 1), rgb(248, 180, 119))'

// export
const _const = {
  debug: api.http === '/dev/',
  api,
  path: env ? '../../../' : './',
  sex: ['男', '女'],
  wx: (appId, id) => {
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + api.wxValidate + "&response_type=code&scope=snsapi_base&state=" + id + "#wechat_redirect"
  },
  html,
  def,
  class: ['', '幼小衔接班', '婴幼衔接班', '小班', '中班', '大班'],
  table,
  env,
  prefix,
  wxshare,
  wxcode,
  btnColor,
  // eslint-disable-next-line
  config: siteConfig(),
  wxshareh5,
  frametoh5page,
  wxlogin
}
export default _const
