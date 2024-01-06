import Vue from 'vue'
import Router from 'vue-router'
// import session from '../assets/js/session'
// import local from '../assets/js/local'

Vue.use(Router)
let prefix_title = ''
let after_title = ''

function routerObj(path, com, name, title, to = '', child) {
  let opt = {
    path: path,
    name: name,
    meta: {
      title: prefix_title + title + after_title,
      to: to,
      name: name,
      path: path
    }
  }
  if (process.env.NODE_ENV === 'development') {
    opt.component = resolve => require(['../views/' + com], resolve)
  } else {
    opt.component = () => import(/* webpackChunkName: "lib" */ '../views/' + com)
  }
  if (child !== undefined && child.length > 0) {
    opt.children = child
  }
  return opt
}
// information
const router = new Router({
  routes: [{
    path: '/',
    redirect: {
      name: "start"
    }
  },
  // 路由地址，对应文件，路由名字，路由标题，返回路由地址 (带有 route_back 则后退)，子路由数组
  // routerObj('/login', 'login/index.vue', 'login', '登录'),
  // routerObj('/login_reg', 'login/reg.vue', 'loginReg', '注册'),
  // routerObj('/login_reset', 'login/forget.vue', 'loginReset', '重置密码'),

  routerObj('/start', 'start/index.vue', 'start', '初始化'),

  routerObj('/login', 'newlogin/index.vue', 'login', '登录'),
  routerObj('/login1', 'newlogin/lib/1.vue', 'login1', '登录'),
  routerObj('/login_reg', 'newlogin/reg.vue', 'loginReg', '注册'),
  routerObj('/login_reset', 'newlogin/reset.vue', 'loginReset', '重置密码'),

  routerObj('/index', 'index/index.vue', 'index', '主页'),
  routerObj('/banner_detail/:id', 'index/banners.vue', 'indexBanners', '详情'),
  routerObj('/cute', 'index/cute/index.vue', 'cute', '精彩瞬间'),
  routerObj('/cute_detail/:id', 'index/cute/detail.vue', 'cuteDetail', '精彩瞬间详情'),
  routerObj('/info', 'index/info/index.vue', 'info', '园所资讯'),
  routerObj('/info_detail/:id', 'index/info/detail.vue', 'infoDetail', '园所资讯详情'),
  routerObj('/info_detail_detail/:id', 'index/info/detail.vue', 'infoDetail2', '园所资讯详情'), // 园所触发 bug 使用
  routerObj('/garden', 'index/garden/index.vue', 'garden', '园所风采'),
  routerObj('/garden/:id', 'index/garden/index.vue', 'garden2', '园所风采'),
  routerObj('/garden_detail', 'index/garden/detail.vue', 'gardenDetail', '园所简介'),
  routerObj('/garden_honor', 'index/garden/honor.vue', 'gardenHonor', '园所荣誉'),
  routerObj('/garden_vr', 'index/garden/vr.vue', 'gardenVr', 'VR 校园'),
  routerObj('/teach', 'index/teach/index.vue', 'teach', '教师风采'),
  routerObj('/teach_detail/:id', 'index/teach/detail.vue', 'teachDetail', '教师风采详情'),
  routerObj('/teach_plan', 'index/teach_plan/index.vue', 'teach_plan', '班级课表'),
  routerObj('/foods', 'index/food/index.vue', 'foods', '宝宝食谱'),
  routerObj('/foods_history', 'index/food/history.vue', 'foodsHistory', '历史食谱'),
  routerObj('/food', 'index/food/new_index.vue', 'food', '宝宝食谱'),
  routerObj('/food_history', 'index/food/new_history.vue', 'foodHistory', '历史食谱'),
  routerObj('/recommend', 'index/recommend/index.vue', 'recommend', '推荐有礼'),
  routerObj('/visit', 'index/visit/index.vue', 'visit', '预约参观'),
  routerObj('/notice', 'index/notice/index.vue', 'notice', '通知'),
  routerObj('/notice_detail/:id', 'index/notice/detail.vue', 'noticeDetail', '通知详情'),
  routerObj('/baby_video', 'index/video/index.vue', 'videoBaby', '宝贝在线'),
  routerObj('/baby_video_detail/:id', 'index/video/detail.vue', 'videoBabyDetail', '宝贝在线详情'),
  routerObj('/survey', 'index/survey/index.vue', 'survey', '调研表'),
  routerObj('/survey_add/:id&:rid', 'index/survey/add.vue', 'surveyAdd', '答题'),
  routerObj('/survey_detail/:id&:rid', 'index/survey/detail.vue', 'surveyDetail', '答题详情'),
  routerObj('/attendance', 'index/attendance/index.vue', 'attendance', '宝宝考勤'),
  routerObj('/attendance_punch', 'index/attendance/punch.vue', 'attendancePunch', '宝宝打卡记录'),
  routerObj('/attendance_leaves', 'index/attendance/leaves.vue', 'attendanceLeaves', '宝宝请假记录'),
  routerObj('/attendance_leave', 'index/attendance/leave.vue', 'attendanceLeave', '宝宝请假'),
  routerObj('/growth', 'index/growth/index.vue', 'growth', '成长管理'),
  routerObj('/growth_task', 'index/growth/task.vue', 'growthTask', '成长任务'),
  routerObj('/growth_task_det/:id', 'index/growth/task_det.vue', 'growthTaskDet', '作业详情'),
  routerObj('/growth_integral', 'index/growth/integral.vue', 'growIntegral', '宝宝积分'),
  routerObj('/growth_shop', 'index/growth/shop.vue', 'growShop', '积分奖励'),
  routerObj('/record', 'index/record/index.vue', 'record', '家园联系册'),

  // 家园联系册 模板
  routerObj('/record1', 'index/recordtemp/1/index.vue', 'record1', '家园联系册'),
  routerObj('/record1/:id', 'index/recordtemp/1/index.vue', 'record12', '家园联系册'),
  // routerObj('/record1det/:id', 'index/recordtemp/1/detail.vue', 'record3', '家园联系册'),

  routerObj('/recommend_shop', 'index/recommend/shop.vue', 'recommendShop', '积分兑换'),
  routerObj('/recommend_shop_detail/:id', 'index/recommend/shop_det.vue', 'recommendShopDet', '商品详情'),
  routerObj('/recommend_shop_details/:id', 'index/recommend/shop_detail.vue', 'recommendShopDets', '兑换详情'),
  routerObj('/recommend_detail', 'index/recommend/detail.vue', 'recommendDetail', '兑换记录'),
  routerObj('/album', 'index/album/index.vue', 'album', '智能相册'),
  routerObj('/poster', 'index/poster/index.vue', 'poster', '招生海报'),

  routerObj('/education', 'education/index.vue', 'education', '家庭是孩子的第一学校'),
  routerObj('/education/:id', 'education/index.vue', 'education10', '家庭是孩子的第一学校'),
  routerObj('/educations/:id', 'education/detail.vue', 'education1', '家庭是孩子的第一学校'),
  routerObj('/address', 'address/index.vue', 'address', '收货地址'),
  routerObj('/educationorder', 'education/order.vue', 'educationorder', '家庭教育订单'),
  routerObj('/educationorder/:id', 'education/order.vue', 'educationorders', '家庭教育订单'),

  routerObj('/class', 'class/index.vue', 'class', '班级圈'),
  routerObj('/class/:id&:did', 'class/index.vue', 'classs2', '班级圈'),
  routerObj('/class/:id', 'class/index.vue', 'classs', '班级圈'),
  routerObj('/class_add', 'class/add.vue', 'classadd', '发布班级圈'),
  routerObj('/class_add/:type', 'class/add.vue', 'classadd1', '发布班级圈'),

  routerObj('/listen', 'listen/index.vue', 'listen', '听故事'),
  routerObj('/listen_detail/:id&:type', 'listen/detail.vue', 'listenDetail', '故事详情'),
  routerObj('/listen_watch/:id', 'listen/det2.vue', 'listenDetail2', '家长课堂'),

  routerObj('/user', 'user/index.vue', 'user', '我的'),
  routerObj('/user_info', 'user/info/index.vue', 'userInfo', '我的资料'),
  routerObj('/user_info_avatar', 'user/info/avatar.vue', 'userInfoAvatar', '家长人脸识别底图'),
  routerObj('/user_password', 'user/password.vue', 'userPassword', '更改密码'),
  routerObj('/user_phone', 'user/phone.vue', 'userPhone', '更改手机号'),
  routerObj('/user_baby_info', 'user/info/baby.vue', 'userBabyInfo', '宝宝信息'),
  routerObj('/user_invite', 'user/invite/index.vue', 'userInvite', '邀请其他监护人'),
  routerObj('/user_baby', 'user/baby/index.vue', 'userBaby', '完善宝贝信息'),

  routerObj('/pay', 'user/pay/index.vue', 'pay', '缴费'),
  routerObj('/pay/:h5', 'user/pay/index.vue', 'pays', '缴费'),
  routerObj('/pay_new', 'user/pay/new_baby.vue', 'payNew', '新生缴费'),
  routerObj('/pay_renew', 'user/pay/renew.vue', 'payRenew', '宝宝在线续费'),

  routerObj('/drugs', 'user/drugs/index.vue', 'drugs', '喂药管理'),
  routerObj('/drugs_add', 'user/drugs/add.vue', 'drugsAdd', '添加喂药'),
  routerObj('/drugs_detail/:id', 'user/drugs/detail.vue', 'drugsDetail', '喂药详情'),

  routerObj('/bind_baby/:id', 'user/bind/index.vue', 'bindBaby', '绑定宝宝'),

  routerObj('/wx_bind', 'wx/bind.vue', 'wxBind', '绑定微信'),
  routerObj('/wx_bind_code', 'wx/set_code.vue', 'wxBinds', '绑定微信'),
  routerObj('/wxlogin', 'wx/login.vue', 'wxLogin', '微信登录'),

  routerObj('/system', 'system/index.vue', 'system', '设置'),
  // routerObj('/help', 'help/index.vue', 'help', '帮助'),
  // routerObj('/helps/:id', 'help/detail.vue', 'helps', '帮助详情'),
  routerObj('/help', 'help/help.vue', 'help', '用户手册'),
  routerObj('/help/:id&:type', 'help/help.vue', 'help2', '用户手册'),
  routerObj('/help/:id', 'help/help.vue', 'help3', '用户手册'),

  routerObj('/vote', 'user/vote/index.vue', 'vote', '投票'),
  routerObj('/vote/:id&:cid', 'user/vote/det.vue', 'vote1', '投票'),
  routerObj('/vote/:id', 'user/vote/det.vue', 'vote2', '投票'),

  routerObj('/remote_debug', 'system/debug.vue', 'debug', '远程调试'),

  routerObj('/lib_agree', 'lib/agreement.vue', 'agreement', '用户协议'),

  routerObj('/evaluate', 'evaluate/index.vue', 'evaluate', '宝贝测评'),
  routerObj('/chant', 'chant/index.vue', 'chant', '学国学'),
  routerObj('/chant/:classid&:typeid&:tabid&:detailid', 'chant/index.vue', 'chant1', '学国学'),
  routerObj('/chant/:classid&:typeid&:tabid', 'chant/index.vue', 'chant2', '学国学'),
  routerObj('/chant_detail', 'chant/index2.vue', 'chant3', '学国学'),
  routerObj('/chant_detail/:id', 'chant/index2.vue', 'chant4', '学国学'),

  routerObj('/link_food/:id', 'link/food.vue', 'linkfood', '跳转食材小店'),
  routerObj('/push', 'push/index.vue', 'push', '推送'),
  routerObj('/push/:id', 'push/index.vue', 'push', '推送'),

  routerObj('/babypay', 'linkto/babypay.vue', 'babypay', '宝宝在线续费'),
  routerObj('/babypay/:id', 'linkto/babypay.vue', 'babypay2', '宝宝在线续费'),
  routerObj('/*', '404/index.vue', 'error', '404')
  ]
})

const val = ['/login', '/login_reg', '/login_reset', '/ly', '/teacher', '/wxlogin']
// 路由拦截，如果没有登录 则返回登录页面
router.beforeEach((to, from, next) => {
  console.log(router);
  let path = '/' + to.path.split('/')[1]
  // eslint-disable-next-line
  if (!demo.vx().version(5)) {
    if (to.params.h5) {
      const h5 = to.params.h5
      let cc = h5.split('_____')
      // eslint-disable-next-line
      let m = demo.es6().md5(cc[1], cc[0], 1)
      try {
        m = JSON.parse(m)
      } catch (e) {
        m = {}
      }
      if (m.url) {
        window.location.replace(m.url + '?h5=' + encodeURIComponent(h5))
        return 0
      }
    }
  }
  next()
  // if (val.indexOf(path) >= 0) {
  //   next()
  // } else {
  //   let token = window.demo.$local.get('token','')
  //   if (token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
})

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = process.env.NODE_ENV === 'development' ? '../../../' : './' + 'static/html/fixIosTitle.html?r=' + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout(_ => {
        document.body.removeChild(hackIframe)
      }, 300)
    }
  }
})

export default router
