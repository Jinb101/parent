import tos from '../../router'
import { Toast, Dialog } from 'vant'

const model = {
  info(err, code = 0) {
    if (typeof err === 'object') {
      err = JSON.parse(err)
    }
    if (err === undefined) {
      err = '网络错误'
    }
    if (!code) {
      Toast({ message: err, duration: 5e3, type: 'fail' })
    } else if (code > 1) {
      Toast({ message: err, duration: 5e3 })
    } else {
      Toast({ message: err, duration: 5e3, type: 'success' })
    }
    setTimeout(() => {
      if (err.toLowerCase().indexOf('token') >= 0) {
        // 跳转登录
        tos.push('/login')
      }
    }, 300)
  },
  loading(err = '加载中...') {
    Toast.loading({
      duration: 0,
      message: err,
      forbidClick: true
    })
  },
  success(err) {
    Toast({ message: err, duration: 5e3, type: 'success' })
  },
  error(err) {
    Toast({ message: err, duration: 5e3, type: 'fail' })
  },
  clear() {
    Toast.clear()
  },
  model(err, t = '', fn) {
    Dialog.confirm({
      title: t, message: err
    }).then(e => { fn(1) }).catch(e => { fn(0) })
  }
}

export default model
