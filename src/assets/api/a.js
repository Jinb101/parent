import ajax from './h'
import md5 from 'js-md5'
import local from '../js/local'
import session from '../js/session'

const nid = local.get('nid') || null

// [s,c,i,m,l,w,z,j,b,d,v,y,o,f,t] 已废弃

/* eslint-disable */
const http = {
  post: (url, data) => {
    return ajax.post(url, data)
  },
  www: (data) => {
    return ajax.www(data)
  },
  // 文件上传
  upload: (d = {
    url: '',
    data
  }) => {
    let data = d.data
    // data = Object.assign({ request_type: 'set', request: 'upload', file_name: 'file' }, data)
    let fd = new FormData()
    if (Object.prototype.toString.call(data) === '[object Object]') {
      for (let k in data) {
        fd.append(k, data[k])
      }
    } else {
      fd = data
    }
    data = null
    return ajax.upload(d.url, fd, 20000, {
      "Content-Type": 'multipart/form-data'
    })
  },
  /**----------------------------------------------------- 公共 3 / 5----------------------------------------------------- */
  // 查看所有部门
  group: (d) => {
    let data = {

      is_need_dean: d ? 1 : 0,
      n_id: nid
    }
    return ajax.post('com/nursery_common/GetGroup', data)
  },
  // 获取岗位
  job: (id) => {
    return ajax.post('nursery/Human/getJob', {

      g_id: id
    })
  },
  // 获取班级
  class: () => {
    return ajax.post('com/nursery_common/getclass', {

      n_id: nid
    })
  },
  // 获取菜单
  menu: () => {
    return ajax.post('nursery/work/getmenu', {})
  },
  // 是否上架
  ground: () => {
    return ajax.post('com/nursery_common/is_grounding', {
      n_id: nid
    })
  },
  /**----------------------------------------------------- 登录 l 5 / 5----------------------------------------------------- */
  // 注册
  lReg: (d) => {
    let data = {
      repassword: md5(d.pwd),
      password: md5(d.pwd),
      phone: d.tel,
      n_id: nid || local.get('nid')
    }
    return ajax.post('nursery/user/register', data)
  },
  // 登录
  lLogin: (d) => {
    let data = {
      phone: d.tel,
      password: md5(d.pwd),
      n_id: nid || local.get('nid')
    }
    return ajax.post('nursery/user/login', data)
  },
  // 重置密码
  lReset: (d) => {
    let data = {
      phone: d.tel,
      code: d.sms,
      repassword: md5(d.pwd),
      password: md5(d.pwd),
      n_id: nid || local.get('nid')
    }
    return ajax.post('nursery/user/forgetpassword', data)
  },
  // 获取验证码
  lSms: (d) => {
    let data = {
      type: ['register', 'forget_password'][d.type] || 'register', // 注册 忘记密码
      phone: d.tel,
      n_id: nid || local.get('nid')
    }
    return ajax.post('nursery/user/sendsms', data)
  },
  // 验证验证码
  lCheckSms: (d) => {
    return ajax.post('nursery/user/checkcode', {
      phone: d.tel,
      code: d.sms,
      n_id: nid || local.get('nid')
    })
  },
  /**----------------------------------------------------- 我的 m 5 / 5----------------------------------------------------- */
  // 用户信息
  mUser: () => {
    return ajax.post('com/nursery_common/getuser', {})
  },
  // 修改昵称
  mNick: (name) => {
    return ajax.post('com/nursery_common/editNickname', {
      nickname: name,
    })
  },
  // 修改头像 -- 转化为 upload
  // mHead: (pic) => {
  //   return ajax.post('com/nursery_common/editAvatar', {
  //     avatar: pic,
  //     	//   })
  // },
  // 申请老师
  mGet: (d) => {
    let data = {

      name: d.name,
      contact: d.tel,
      j_id: d.id
    }
    return ajax.post('nursery/user/joinTheGarden', data)
  },
  // 更换手机号
  mPhone: (tel) => {
    return ajax.post('nursery/user/replacementPhone', {

      phone: tel
    })
  },
  /**----------------------------------------------------- 首页 i 3 / 3----------------------------------------------------- */
  // 首页
  index: () => {
    return ajax.post('nursery/index/index', {
      n_id: nid,
    })
  },
  // 园所咨询/教师风采
  iInfo: (d) => {
    let data = {

      type: d.type ? 1 : 2, // 1:教师风采 2:园所资讯
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/index/information', data)
  },
  // 园所咨询/教师风采详情
  iInfoDetail: (id) => {
    return ajax.post('nursery/index/informationDetails', {
      teachers_id: id
    })
  },
  /**----------------------------------------------------- 班级圈 c  7 / 11----------------------------------------------------- */
  // 查看班级
  cClass: () => {
    return ajax.post('nursery/Class_show/myClass', {})
  },
  // 首页
  cIndex: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      class_id: d.id
    }
    return ajax.post('nursery/class_show/index', data)
  },
  // 查看资料
  cInfo: (d) => {
    let data = {

      from_client: d.type ? 1 : 2,
      u_id: d.id
    }
    return ajax.post('nursery/class_show/userdata', data)
  },
  // 详情
  cDetail: (id) => {
    return ajax.post('nursery/class_show/detail', {

      s_id: id
    })
  },
  // 发布
  cSend: (d) => {
    let data = {

      content: d.content,
      imgs: (d.img || ''),
      title: d.title,
      class_id: d.id
    }
    return ajax.post('nursery/class_show/publishclassshow', data)
  },
  // 点赞
  cGood: (id) => {
    return ajax.post('nursery/class_show/like', {

      s_id: id
    })
  },
  // 评论
  cComment: (d) => {
    let data = {

      comment: d.comment,
      s_id: d.id,
      parent_id: d.pid || '',
      r_id: d.uid || '',
      reply_client: d.client || ''
    }
    return ajax.post('nursery/class_show/comment', data)
  },
  // 删除
  cDel: (id) => {
    return ajax.post('nursery/class_show/del_class_show', {

      s_id: id
    })
  },
  // 删除我的评论
  cDelComment: (id) => {
    return ajax.post('nursery/class_show/delMyComment', {

      comment_id: id
    })
  },
  // 获取更多评论
  cMore: (d) => {
    return ajax.post('nursery/class_show/moreComments', {

      s_id: d.cid,
      id: d.id
    })
  },
  // 屏蔽班级圈
  cShield: (id) => {
    return ajax.post('nursery/Class_show/shieldingClassCircle', {

      show_id: id
    })
  },
  /**----------------------------------------------------- 工作计划 w 2 / 2----------------------------------------------------- */
  // 获取
  wGet: (type) => { // [周计划 月计划 学期计划]
    return ajax.post('nursery/work/getWeekPlan', {

      type: [1, 2, 3][type] || 1
    })
  },
  // 上传
  wSet: (d) => {
    let data = {

      type: [1, 2, 3][d.type] || 1,
      plan_img: d.img || ''
    }
    return ajax.post('nursery/work/addWeekPlan', data)
  },
  /**----------------------------------------------------- 组织管理 z 4 / 4----------------------------------------------------- */
  // 组织架构/园所风采
  zIndex: (type) => { // 1组织架构 0园所风采
    return ajax.post('nursery/Human/organization', {

      n_id: nid,
      type: type ? 1 : 2
    })
  },
  // 岗位说明
  zData: (id) => {
    return ajax.post('nursery/Human/jobExplain', {

      j_id: id
    })
  },
  // 员工手册
  zPeople: () => {
    return ajax.post('nursery/Human/manualList', {})
  },
  // 编制管理
  zAdmin: (id) => {
    return ajax.post('nursery/Human/staffManagement', {

      n_id: nid,
      g_id: id
    })
  },
  /**----------------------------------------------------- 招生工作 j 9 / 10 ----------------------------------------------------- */
  // 生源信息
  jIndex: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      name: d.name || ''
    }
    return ajax.post('nursery/enroll/source', data)
  },
  // 新增生源
  jAdd: (d) => {
    let data = {

      gender: !d.sex ? 1 : 2,
      birthday: d.time,
      parent_name: d.nick,
      contact: d.tel,
      address: d.address,
      name: d.name
    }
    return ajax.post('nursery/enroll/source_add', data)
  },
  // 编辑生源
  jEdit: (d) => {
    let data = {

      gender: !d.sex ? 1 : 2,
      birthday: d.time,
      parent_name: d.nick,
      contact: d.tel,
      address: d.address,
      name: d.name,
      c_id: d.num
    }
    return ajax.post('nursery/enroll/source_edit', data)
  },
  // 删除生源
  jDel: (id) => {
    return ajax.post('nursery/enroll/source_del', {

      c_id: id
    })
  },
  // 缴费
  jSend: () => { },
  // 二维码
  jCode: () => {
    return ajax.post('nursery/enroll/qr_code', {})
  },
  // 备注列表
  jList: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      c_id: d.id
    }
    return ajax.post('nursery/enroll/get_remarks', data)
  },
  // 添加备注
  jAddRemark: (d) => {
    let data = {

      content: d.content,
      picture: d.img || '',
      c_id: d.id
    }
    return ajax.post('nursery/enroll/add_remarks', data)
  },
  // 删除备注
  jDelRemark: (id) => {
    return ajax.post('nursery/enroll/deleted_remarks', {

      remarks_id: id
    })
  },
  // 生源详情
  jDetail: (id) => {
    return ajax.post('nursery/enroll/source_detail', {

      child_id: id
    })
  },
  /**----------------------------------------------------- 班级考勤 b 3 / 3 ----------------------------------------------------- */
  // 记录
  bIndex: (d) => {
    let data = {

      datetime: d.time || '',
      status: [1, 5, 3, 6][d.type] || 1, // 1已打卡 5迟到 3缺卡 6离校
      class_id: d.id
    }
    return ajax.post('nursery/Education/childAttendance', data)
  },
  // 已到
  bSet: (d) => {
    let data = {

      time: d.time || '',
      c_id: d.id
    }
    return ajax.post('nursery/Education/setArrived', data)
  },
  // 离校
  bLeave: (id) => {
    return ajax.post('nursery/Education/leaving', {

      attendance_id: id
    })
  },
  /**----------------------------------------------------- 调研表 d 5 / 5 ----------------------------------------------------- */
  // 调查
  dIndex: (type) => { // 0家长调研表 1员工调研表 2岗位胜任力调研表
    return ajax.post('nursery/work/feedBack', {

      n_id: nid,
      type: [1, 2, 3][type] || 1
    })
  },
  // 答题
  dGet: (d) => {
    let data = {

      f_id: d.id,
      r_id: d.rid
    }
    return ajax.post('nursery/work/onlineanswer', data)
  },
  // 提交
  dSend: (d) => {
    let data = {

      f_id: d.id,
      r_id: d.rid,
      answer: d.question,
      t_id: d.tid
    }
    return ajax.post('nursery/work/submit', data)
  },
  // 记录
  dList: (type) => { // 0家长调研表 1员工调研表 2岗位胜任力调研表
    return ajax.post('nursery/work/survey_records', {

      type: [1, 2, 3][type] || 1
    })
  },
  // 详情
  dDetail: (d) => {
    let data = {

      f_id: d.id,
      r_id: d.rid
    }
    return ajax.post('nursery/work/survey_detail', data)
  },
  /**----------------------------------------------------- 可爱视频 v 5 / 5 ----------------------------------------------------- */
  // 可爱视频
  vIndex: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      n_id: nid
    }
    return ajax.post('nursery/lovable/lovable', data)
  },
  // 添加
  vAdd: (d) => {
    let data = {

      n_id: nid,
      title: d.title,
      type: d.type ? 2 : 1, // 0图片 1视频
      cover: d.img,
      video: d.video
    }
    return ajax.post('nursery/lovable/addLovable', data)
  },
  // 详情
  vDetail: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      lovable_id: d.id
    }
    return ajax.post('nursery/lovable/lovableDetails', data)
  },
  // 增加浏览量
  vCount: (id) => {
    return ajax.post('nursery/lovable/pageview', {

      lovable_id: id
    })
  },
  // 删除
  vDel: (id) => {
    return ajax.post('nursery/lovable/lovable_delete', {

      lovable_id: id
    })
  },
  /**----------------------------------------------------- 绑定核验 y 3 / 3 ----------------------------------------------------- */
  // 绑定核验
  yIndex: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      n_id: nid,
      examine_status: d.type ? 1 : 2, // 1待审核 0已审核
      name: d.name || ''
    }
    return ajax.post('nursery/binding/audit_list', data)
  },
  // 详情
  yDetail: (id) => {
    return ajax.post('nursery/binding/auditDetails', {

      id: id
    })
  },
  // 审核
  ySend: (d) => {
    let data = {

      status: d.type ? 1 : 2, // 1通过 0驳回
      reject: d.msg || '',
      id: d.id
    }
    return ajax.post('nursery/binding/examine', data)
  },
  /**----------------------------------------------------- 宝贝在线 o 0 / 3 ----------------------------------------------------- */
  // 在线
  oIndex: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/index/BabyOnline', data)
  },
  // 详情
  oDetail: (d) => {
    let data = {

      page: d.page || 1,
      limit: d.limit || 10,
      baby_id: d.id
    }
    return ajax.post('nursery/index/OnlineDetail', data)
  },
  // 是否开启
  oIs: (id) => {
    return ajax.post('nursery/Work/babyIsOff', {

      baby_id: id
    })
  },
  /**----------------------------------------------------- 宝贝食谱 f 0 / 4 ----------------------------------------------------- */
  // 宝贝食谱
  fIndex: () => {
    return ajax.post('nursery/recipes/latestRecipe', {

      n_id: nid
    })
  },
  // 历史食谱
  fHistory: () => {
    return ajax.post('nursery/recipes/historicalCookbook', {

      n_id: nid
    })
  },
  // 添加食谱
  fAdd: (d) => {
    let data = {

      n_id: nid,
      start_time: d.start,
      end_time: d.end,
      type: d.type ? 1 : 2, // 1文本 0图片
      recipes: d.list || [],
      describe: d.desc || ''
    }
    return ajax.post('nursery/recipes/addRecipe', data)
  },
  // 获取星期 废弃
  fWeek: (d) => { }
  /**----------------------------------------------------- 教学计划 t 0 / 3 ----------------------------------------------------- */


}

// export default http
