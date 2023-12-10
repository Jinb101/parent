// console.log(demo.$vx())
demo.access('$vx', demo.fn('demo_vx'))

new VConsole()

let api = window.location.origin + '/api/'
let urls = {
  open: 'com/common/get_openid',
  code: 'com/common/get_share',
  pay: 'parents/My/payParentsOrder'
}
let vp = demo.$session.get('wx-pay-config', {})
let params = demo.getUrl()

demo.cssLazy().text(
  '#index,body{width:100vw;height:100vh}header{height:50px;padding:5px;box-sizing:border-box;line-height:40px;text-align:center;color:#fff;background-color:#04be02;letter-spacing:1px;font-size:18px}.box{height:calc(100% - 130px);width:85%;margin:0 auto;box-sizing:border-box;font-size:15px}h1{line-height:1.2;padding:10% 10px 15px;text-align:center;font-weight:700;letter-spacing:1px}.b{margin:10px 0}.b p{color:#999;margin-bottom:5px}.btn{text-align:center;margin-top:15px}.btn .m_btn{min-width:80px}.btn .m_btn + .m_btn{margin-left:20px}'
)

let a1 = demo._div('h1', '', '你正在支付一笔由[幼儿园]发起的[宝贝在线播放]订单')
let a2 = demo._div('div', 'b', '正在查询订单状态，请稍后。。。')
let a3 = demo._div('div', 'btn')
demo.js('#index .box').appendChild(a1)
demo.js('#index .box').appendChild(a2)
demo.js('#index .box').appendChild(a3)

let dom = demo.js('#index .box .b')

// demo.cssLazy().text(
//   '.a3{background:#222;color:#fff;padding:10px;font-size:16px;display:block;width:90%;margin-left:5px;white-space:pre-wrap;line-height:1.2}.a3 + .a3{margin-top:20px}'
// )

// let _div = function (cls, data, view = 'div') {
//   let div = demo._div(view, cls)
//   div.innerHTML = view === 'pre' ? demo.showJson(data) : JSON.stringify(data)
//   demo.js('#index .box').appendChild(div)
//   return div
// }

// _div('a3', params, 'pre')

let template = function (e) {
  let arr = ['<p class="num">订单号： <b>' + e.order_no + '</b></p>',
    '<p class="status">订单状态： <b id="status">待支付</b></p>',
  '<p class="price">订单价格： ￥<b>' + (e.money / 100).toFixed(2) + '</b></p>'
  ]
  btns(2)
  return arr.join('')
}

let error = function (msg) {
  dom.addClass('col_danger')
  dom.html(msg)
  demo.toast(msg)
}

let btns = function (f) {
  let dom = demo.js('#index .btn')
  let arr = [
    '<button class="m_btn bgc_purple small" id="ret">返回</button>'
  ]
  if (f === 2) {
    arr.push('<button class="m_btn bgc_green small" id="reset">重新支付</button>')
  }
  dom.html(arr.join(''))

  setTimeout(function () {
    demo.js('#ret').click(function () {
      let rData = params.state.split('_0_')
      window.location.replace(decodeURIComponent(rData[4]))
    })
    demo.js('#reset').click(function () {
      let rData = params.state.split('_0_')
      params = {
        t: rData[1],
        n: rData[2],
        id: rData[3],
        u: rData[4]
      }
      init(demo.$session.get('wx-pay-config', {}))
    })
  }, 500)
}

btns(0);

let init = function (e) {
  if (!params.state) {
    // 注册appid
    demo.$vx().plug({
      type: 'default',
      key: e
    }, res => {
      // _div('a3', res, 'pre')
      // 验证通过 授权
      if (res.code) {
        let bb = e.strAppId ? { component_appid: 'wx55b8471985fa8e81' } : {}
        demo.$vx().auth({
          data: 't_0_' + params.t + '_0_' + params.n + '_0_' + params.id + '_0_' + params.u,
          type: 1,
          ...bb
        })
      }
    })
  } else {
    let rData = params.state.split('_0_')
    // _div('a3', rData, 'pre')
    // 获取 openid
    demo.ajax(api + urls.open).post({
      js_code: params.code,
      n_id: '0'
    }, res => {
      // _div('a3', res, 'pre')
      // 获取订单信息
      if (res.code === 200) {
        if (res.data.errmsg) {
          return demo.toast(res.data.errmsg)
        }
        let id = res.data.openid
        demo.ajax(api + urls.pay).post({
          access_token: rData[1] || '',
          order_sn: rData[2] || '',
          openid: id,
          n_id: rData[3] || ''
        }, q => {
          // 调取支付
          if (q.code === 200) {
            let os = q.data.jsApi_request
            dom.html(template(q.data))
            let status = demo.js('#status')
            demo.$vx().pay(os, w => {
              if (w.code) {
                status.html('支付成功')
                btns(0);
                // 支付成功
                // _div('a3', w, 'pre')
              } else {
                status.html(w.err)
              }
            })
          } else {
            error(q.msg)
          }
        })
      } else {
        error(res.msg)
      }
    })
  }
}

if (vp.url) {
  init(vp)
} else {
  demo.ajax(api + urls.code).post({
    n_id: '0'
  }, e => {
    if (e.code === 200) {
      demo.$session.set('wx-pay-config', e.data)
      init(e.data)
    } else {
      error(e.msg)
    }
  })
}
