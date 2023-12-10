import ajax from './h'
// import md5 from 'js-md5'
import local from '../js/local'
import session from '../js/session'
import model from '../js/model'

// [s,c,i,m,l,w,z,j,b,d,v,y,o,f,t]

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
    data.n_id = local.get('nid') || ''
    data.access_token = session.get('token') || ''
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
  group: () => {
    return ajax.post('com/nursery_common/GetGroup', {})
  },
  // 获取岗位
  job: (id) => {
    return ajax.post('nursery/Human/getJob', {
      g_id: id
    })
  },
  // 获取班级
  class: (d) => {
    return ajax.post('com/nursery_common/getclass', { grade: d || '' })
  },
  // 获取菜单
  menu: () => {
    return ajax.post('nursery/work/getmenu', {})
  },
  // 是否上架
  ground: () => {
    return ajax.post('com/nursery_common/is_grounding', {})
  },
  // 获取logo
  logo: () => {
    return ajax.post('com/common/nursery_info', {})
  },
  // 获取微信配置
  getAppId: () => {
    return ajax.post('com/common/get_share', {})
  },
  // 获取微信openid
  getOpenId: (code) => {
    return ajax.post('com/common/get_openid', { js_code: code })
  },
  // 设置openid
  setOpenId: (code) => {
    return ajax.post('com/nursery_common/setOpenid', { code })
  },
  /**----------------------------------------------------- 登录 l 5 / 5----------------------------------------------------- */
  // 注册
  lReg: (d) => {
    let data = {
      repassword: md5(d.pwd),
      password: md5(d.pwd),
      phone: d.tel,
      openid: d.id
    }
    return ajax.post('nursery/user/register', data)
  },
  // 登录
  lLogin: (d) => {
    let data = {
      phone: d.tel,
      password: md5(d.pwd),
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
    }
    return ajax.post('nursery/user/forgetpassword', data)
  },
  // 获取验证码
  lSms: (d) => {
    let data = {
      type: ['register', 'forget_password'][d.type] || 'register', // 注册 忘记密码
      phone: d.tel,
    }
    return ajax.post('nursery/user/sendsms', data)
  },
  // 验证验证码
  lCheckSms: (d) => {
    return ajax.post('nursery/user/checkcode', {
      phone: d.tel,
      code: d.sms,
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
  // 个人风采
  mStyle: (d) => {
    let data = {
      title: d.t,
      image: d.p,
      content: d.c,
      declaration: d.d
    }
    return ajax.post('nursery/user/personalStyle', data)
  },
  // 获取我的风采
  mGetStyle: () => {
    return ajax.post('nursery/user/getPersonalStyle', {})
  },
  /**----------------------------------------------------- 首页 i 3 / 3----------------------------------------------------- */
  // 首页
  index: () => {
    return ajax.post('nursery/index/index', {})
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
      class_id: d.id,
      type: [1, 2][d.type] || 1
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
    if (type * 1 === 3) {
      return ajax.post('nursery/Logistics/getClassPlan', {})
    }
    return ajax.post('nursery/work/getWeekPlan', {
      type: [1, 2, 3][type] || 1
    })
  },
  // 上传
  wSet: (d) => {
    if (d.type * 1 === 3) {
      return ajax.post('nursery/Logistics/addClassPlan', { imgs: d.img || '' })
    }
    let data = {
      type: [1, 2, 3][d.type] || 1,
      plan_img: d.img || ''
    }
    return ajax.post('nursery/work/addWeekPlan', data)
  },
  /**----------------------------------------------------- 组织管理 z 4 / 4----------------------------------------------------- */
  // 组织架构/园所风采
  zIndex: (type) => { // 1组织架构 0园所风采 3员工手册
    return ajax.post('nursery/Human/organization', {
      type: type === 3 ? 3 : type ? 1 : 2
    })
  },
  // 组织架构[新] 1园所荣誉2组织架构 3人力资源二维码 4来访登记二维码5积分管理制度 6VR校园
  zIndex2: (d) => {
    return ajax.post('nursery/Human/framework', { type: d.type || 2 })
  },
  // 岗位说明
  zData: (id) => {
    return ajax.post('nursery/Human/jobExplain', {
      j_id: id
    })
  },
  // 编辑岗位
  zDataEdit: (d) => {
    let duty = d.duty || []
    if (!duty.length) {
      duty = ['岗位职责']
    }
    return ajax.post('nursery/Human/editJobExplain', {
      j_id: d.id,
      duty: duty
    })
  },
  // 员工手册
  zPeople: () => {
    return ajax.post('nursery/Human/manualList', {})
  },
  // 编制管理
  zAdmin: (d) => {
    return ajax.post('nursery/Human/staffManagement', {
      g_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20
    })
  },
  /**----------------------------------------------------- 招生工作 j 9 / 10 ----------------------------------------------------- */
  // 生源信息
  jIndex: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
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
  dIndex: (d) => { // 0家长调研表 1员工调研表 2岗位胜任力调研表
    return ajax.post('nursery/work/feedBack', {
      type: [1, 2, 3][d.type] || 1,
      page: d.page || 1,
      limit: d.limit || 10
    })
  },
  // 查看调研表参与人
  dPeople: (d) => {
    return ajax.post('nursery/work/respondent', { r_id: d.rid, f_id: d.fid, page: d.page || 1, limit: d.limit || 10 })
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
  dList: (d) => { // 0家长调研表 1员工调研表 2岗位胜任力调研表
    return ajax.post('nursery/work/survey_records', {
      type: [1, 2, 3][d.type] || 1,
      page: d.page || 1,
      limit: d.limit || 10
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
  // 调研记录
  dDetail2: (d) => {
    return ajax.post('nursery/education/surveyDetail', {
      f_id: d.id,
      r_id: d.rid
    })
  },
  // 答题人
  dAnswer: (d) => {
    return ajax.post('nursery/work/look_survey_pople', {
      f_id: d.fid,
      t_id: d.id,
      type: d.type ? 2 : 1,
      answer: d.sss || ''
    })
  },
  // 小红点
  dDot: () => {
    return ajax.post('parents/Home_interactive/feedBackRedPoint', {})
  },
  /**----------------------------------------------------- 可爱视频 v 5 / 5 ----------------------------------------------------- */
  // 可爱视频
  vIndex: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
    }
    return ajax.post('nursery/lovable/lovable', data)
  },
  // 添加
  vAdd: (d) => {
    let data = {
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
  /**----------------------------------------------------- 宝贝在线 o 3 / 3 ----------------------------------------------------- */
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
  /**----------------------------------------------------- 宝贝食谱 f 3 / 4 ----------------------------------------------------- */
  // 宝贝食谱
  fIndex: () => {
    return ajax.post('nursery/recipes/latestRecipe', {})
  },
  // 历史食谱
  fHistory: (d) => {
    return ajax.post('nursery/recipes/historicalCookbook', { page: d.page || 1, limit: d.limit || 10 })
  },
  // 添加食谱
  fAdd: (d) => {
    let data = {
      start_time: d.start,
      end_time: d.end,
      type: d.type ? 1 : 2, // 1文本 0图片
      recipes: d.list || [],
      describe: d.desc || ''
    }
    return ajax.post('nursery/recipes/addRecipe', data)
  },
  // 食谱图片
  fImage: (d) => {
    let data = {
      recipes_id: d.id,
      key: d.k,
      key1: d.v,
      img_url: (d.pic || []).join(',')
    }
    return ajax.post('nursery/recipes/upload_recipe_picture', data)
  },
  /**----------------------------------------------------- 教学计划 t 0 / 3 ----------------------------------------------------- */
  /**----------------------------------------------------- 通知----------------------------------------------------- */
  // 通知
  noticeGet: (d) => {
    let type = d.type || 0
    let data = {
      page: d.page || 1,
      limit: d.limit || 10
    }
    if (type * 1) {
      // 我发的通知
      return ajax.post('nursery/index/sentnotice', data)
    }
    return ajax.post('nursery/index/notice', data)
  },
  // 发通知
  noticeAdd: (d) => {
    let data = {
      title: d.title || '',
      content: d.message || '',
      imgs: d.image || [],
      parent_id: d.jz.join(',') || '',
      staff_id: d.ys.join(',') || ''
    }
    return ajax.post('nursery/index/sendnotice', data)
  },
  // 通知详情
  noticeDetail: (d) => {
    let type = d.type || 0
    if (type * 1) {
      // 我发的通知
      return ajax.post('nursery/index/sentnoticedetail', { notice_id: d.id })
    }
    return ajax.post('nursery/index/noticedetail', { notice_id: d.id })
  },
  // 未读
  noticeUnRead: () => {
    return ajax.post('nursery/index/unreadnotice', {})
  },
  /**----------------------------------------------------- 审批 ----------------------------------------------------- */
  // 未审批
  approvalUnread: () => {
    return ajax.post('com/nursery_common/approvalcount', {})
  },
  // 发起采购审批
  approvalSend: (d) => {
    let data = {
      supplies: d.json || '[]', // 采购物品 json
      principal_type: 1, // 审批人为园所端
      principal_id: d.id || '', // 审批人id，多个逗号拼接
      center_inform_ids: '', // 集团管理中心知会人id
      nursery_inform_ids: d.zid || '', // 园所知会人id
      supplier_id: d.gid || '', // 供应商id
      content: d.message || '', // 采购说明
      amount: d.price || 0, // 合计金额
      imgs: d.image || [], // 图片
      recording: d.ly || '', // 录音
      account_name: d.account || '', // 开户名称
      bank_no: d.num || '', // 银行帐号
      bank_name: d.name || '' // 开户姓名
    }
    return ajax.post('nursery/index/sendapprovalgoods', data)
  },
  // 发起领用审批
  approvalSendCollect: (d) => {
    let data = {
      supplies: d.json || '[]', // 采购物品 json
      principal_type: 1, // 审批人为园所端
      principal_id: d.id || '', // 审批人id，多个逗号拼接
      center_inform_ids: '', // 集团管理中心知会人id
      nursery_inform_ids: d.zid || '', // 园所知会人id
      content: d.message || '', // 采购说明
      imgs: d.image || [], // 图片
      recording: d.ly || '', // 录音
    }
    return ajax.post('nursery/index/sendapprovaluse', data)
  },
  // 发起费用审批
  approvalSendCost: (d) => {
    let data = {
      amount: d.price || '',
      principal_type: 1,
      principal_id: d.id || '',
      center_inform_ids: '',
      nursery_inform_ids: d.zid || '',
      content: d.message || '',
      imgs: d.image || [], // 图片
      recording: d.ly || '', // 录音
      account_name: d.account || '', // 开户名称
      bank_no: d.num || '', // 银行帐号
      bank_name: d.name || '' // 开户姓名
    }
    return ajax.post('nursery/index/sendapprovalcost', data)
  },
  // 发起报销审批
  approvalSendReimbursement: (d) => {
    let data = {
      principal_type: 1,
      principal_id: d.id || '',
      center_inform_ids: '',
      nursery_inform_ids: d.zid || '',
      content: d.message || '',
      imgs: d.image || [], // 图片
      recording: d.ly || '', // 录音
      account_name: d.account || '', // 开户名称
      bank_no: d.num || '', // 银行帐号
      bank_name: d.name || '', // 开户姓名
      receipt_data: d.json || '[]'
    }
    return ajax.post('nursery/index/sendapprovalreceipt', data)
  },
  // 发起出勤审批
  approvalSendAttendance: (d) => {
    let data = {
      principal_type: 1,
      principal_id: d.id || '',
      center_inform_ids: '',
      nursery_inform_ids: d.zid || '',
      content: d.message || '',
      imgs: d.image || [], // 图片
      recording: d.ly || '', // 录音
      begin_date: d.st || Date.now(),
      end_date: d.et || Date.now(),
      attendance_type: d.type || ''
    }
    return ajax.post('nursery/index/sendapprovalattendance', data)
  },
  // 获取我发起的 审批 - 待我审批 - 知会
  approvalGet: (d) => {
    let name = d.name || 1
    let url = 'myapproval' // approvalinformme approvaltome
    let data = {
      type: d.type || 1,
      page: d.page || 1,
      limit: d.limit || 10,
      status: d.status || '',
      begin_date: d.st || '',
      end_date: d.et || ''
    }
    switch (name * 1) {
      case 2:
        url = 'approvaltome'
        break
      case 3:
        url = 'approvalinformme'
        break
      default:
    }
    return ajax.post('nursery/index/' + url, data)
  },
  // 获取审批详情
  approvalDetail: (d) => {
    let name = d.name || 1
    let url = 'myapprovaldetail' // approvaltomedetail approvalinformmedetail
    let data = {
      a_id: d.id,
      type: d.type // 1采购审批，2领用审批，3报销审批，4费用审批，5出勤审批
    }
    switch (name * 1) {
      case 2:
        url = 'approvaltomedetail'
        break
      case 3:
        url = 'approvalinformmedetail'
        break
      default:
    }
    return ajax.post('nursery/index/' + url, data)
  },
  // 更改审批状态
  approvalChange: (d) => {
    // -1拒绝，2通过，3撤销
    return ajax.post('nursery/index/changeapprovalstatus', { id: d.id, status: d.status || -1 })
  },
  // 获取审批人 历史
  approvalHistory: (type) => {
    // 审批类型 1采购审批，2领用审批，3报销审批，4费用审批，5出勤审批
    return ajax.post('nursery/index/getApprovalPerson', { approval_type: type })
  },
  // 红点  1采购审批，2领用审批，3报销审批，4费用审批，5出勤审批
  approvalDot: (type) => {
    return ajax.post('com/nursery_common/little_red_dot', { approval_type: type })
  },
  /**----------------------------------------------------- 后勤管理 ----------------------------------------------------- */
  // 采购
  logPurchase: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      type: d.type || 1 // 1待入库 2已入库 3已撤销
    }
    return ajax.post('nursery/Logistics/purchase', data)
  },
  // 采购详情
  logPurchaseDetail: (d) => {
    return ajax.post('nursery/Logistics/purchaseDetail', { approval_id: d.id, purchase_id: d.pid })
  },
  // 采购入库-撤销
  logPurchaseStatus: (d) => {
    let url = 'nursery/Logistics/confirm_revote'
    if (d.type) {
      // 入库
      url = 'nursery/Logistics/confirmEntry'
    }
    return ajax.post(url, { purchase_id: d.id })
  },
  // 获取检查项管理
  logInspectGet: () => {
    return ajax.post('nursery/Logistics/inspect', {})
  },
  // 检查项 添加-编辑-删除
  logInspectEvent: (d) => {
    let type = d.type || 1
    let url = 'addInspect' // 添加
    let data = { name: d.name || '' }
    switch (type * 1) {
      case 2:
        url = 'editInspect' // 编辑
        data = { id: d.id, name: d.name || '' }
        break
      case 3:
        url = 'delInspect' // 删除
        data = { id: d.id }
        break
      default:
    }
    return ajax.post('nursery/Logistics/' + url, data)
  },
  // 获取晨检列表 - 异常列表
  logInspectList: (d) => {
    let data = {
      group_id: d.gid || '',
      class_id: d.cid || '',
      name: d.name || '',
      inspection_date: d.time || '',
      page: d.page || 1,
      limit: d.limit || 10
    }
    let url = 'morningCheckList'
    if (d.type) {
      // 异常列表
      url = 'exceptionList'
    }
    return ajax.post('nursery/Logistics/' + url, data)
  },
  // 获取年级
  logGetGrade: () => {
    return new Promise((resolve, reject) => {
      let a = [{ name: '幼小衔接班', id: 1 }, { name: '托育班', id: 2 }, { name: '小班', id: 3 }, { name: '中班', id: 4 }, { name: '大班', id: 5 }]
      if (a.length) {
        resolve({ data: a, code: 1 })
      } else {
        reject({ data: { msg: '获取年级失败' } })
      }
    })
  },
  // 一键正常
  logInspectOnce: (d) => {
    return ajax.post('nursery/Logistics/oneButtonIsNormal', { onekey_date: d.time, child_id: d.id })
  },
  // 晨检记录
  logInspectDetail: (d) => {
    return ajax.post('nursery/Logistics/recordOfInspection', { inspection_date: d.time, child_id: d.id })
  },
  // 单独检查
  logInspectEventOnce: (d) => {
    let data = {
      c_id: d.id,
      i_id: d.xid || '',
      status: d.sid || '',
      inspection_time: d.time
    }
    return ajax.post('nursery/Logistics/checkTheCheckItem', data)
  },
  // 晨检记录-日期
  logInspectDay: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      child_id: d.id,
      inspection_begin: d.st || '',
      inspection_end: d.et || ''
    }
    return ajax.post('nursery/Logistics/studentTimeList', data)
  },
  // 物资
  logDataIndex: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/Logistics/supplies', data)
  },
  // 物资详情
  logDataIndexDetail: (id) => {
    return ajax.post('nursery/Logistics/suppliesDetails', { id: id })
  },
  // 删除物资
  logDataDel: (id) => {
    return ajax.post('nursery/Logistics/delSupplies', { id: id })
  },
  // 获取物资分类
  logDataIfy: () => {
    return ajax.post('nursery/Logistics/unitAndCate', {})
  },
  // 添加物资
  logDataAdd: (d) => {
    let data = {
      name: d.name,
      num: d.num,
      price: d.price,
      categories_id: d.cid,
      units_id: d.uid,
      img: d.pic
    }
    return ajax.post('nursery/Logistics/addSupplies', data)
  },
  // 编辑物资
  logDataUpd: (d) => {
    let data = {
      name: d.name,
      num: d.num,
      price: d.price,
      categories_id: d.cid,
      units_id: d.uid,
      id: d.id
    }
    return ajax.post('nursery/Logistics/editSupplies', data)
  },
  // 物资图片更新
  logDataLogo: (d) => {
    return ajax.post('nursery/logistics/upload_pictures', { id: d.id, img: d.img })
  },
  // 领用
  logCollect: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      name: d.value || '',
      type: d.type || 1 // 1待出库 2待还库 3已还库 4无需还库
    }
    return ajax.post('nursery/Logistics/receive', data)
  },
  // 领用详情
  logCollectDetail: (d) => {
    return ajax.post('nursery/Logistics/receiveDetail', { approval_id: d.id, receive_id: d.rid })
  },
  // 确认领用 - 还库 - 不还库
  logCollectSubmit: (d) => {
    let url = 'confirmReceive'
    switch (d.type) {
      case 1: // 还库
        url = 'confirmBack'
        break
      case 0: // 不还库
        url = 'noBack'
        break
      default:
    }
    return ajax.post('nursery/Logistics/' + url, { receive_id: d.id })
  },
  // 领用 待出库 小红点
  logCollectDot: () => {
    return ajax.post('com/nursery_common/redSpotToBeDelivered', {})
  },
  /**----------------------------------------------------- 保教 ----------------------------------------------------- */
  // 班级管理
  eduClass: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      name: d.value || '',
      type: d.type || '' // 1幼小衔接班 2婴幼衔接班 3小班 4中班 5大班
    }
    return ajax.post('nursery/Education/classManagement', data)
  },
  // 添加-编辑 班级
  eduClassEvent: (d) => {
    let url = 'create_class'
    let data = {
      nickname: d.name,
      type: d.cid,
      capacity: d.num,
      leader_id: d.tid,
      staff_id: d.sid
    }
    if (d.type) {
      url = 'edit_class'
      data.class_id = d.id
    }
    return ajax.post('nursery/Education/' + url, data)
  },
  // 已分班 未分班
  eduClassLesson: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      name: d.value || ''
    }
    let url = 'dontDivision'
    if (d.type) {
      url = 'inClass' // 已分班
    }
    return ajax.post('nursery/Education/' + url, data)
  },
  // 班级详情
  eduClassDetail: (id) => {
    return ajax.post('nursery/Education/classDetail', { class_id: id })
  },
  // 查看缴费
  eduPay: (id) => {
    return ajax.post('nursery/Education/lookPay', { id: id })
  },
  // 班级学生
  eduClassStudent: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      class_id: d.id
    }
    return ajax.post('nursery/Education/classStudents', data)
  },
  // 学生详情
  eduClassStudentDetail: (id) => {
    return ajax.post('nursery/Education/studentDetails', { id: id })
  },
  // 退学 - 毕业
  eduClassStudentEvent: (d) => {
    let url = 'dropOut'
    if (d.type) {
      url = 'graduate' // 毕业
    }
    return ajax.post('nursery/Education/' + url, { c_id: d.id })
  },
  // 欠费
  eduArrears: (id) => {
    return ajax.post('nursery/Education/arrearsRecord', { child_id: id })
  },
  // 出勤
  eduAttendance: (d) => {
    return ajax.post('nursery/Education/attendanceRecord', { c_id: d.id, date: d.time })
  },
  // 出勤2
  eduAttendanceDetail: (d) => {
    return ajax.post('nursery/Education/attendanceDetail', { c_id: d.id, year_month: d.time })
  },
  // 收款
  eduGiveMoney: (d) => {
    let data = {
      c_id: d.id,
      money: d.price,
      expire_time: d.time,
      i_id: d.iid
    }
    return ajax.post('nursery/Education/receiptMoney', data)
  },
  // 催款
  eduReminders: (d) => {
    let data = {
      child_id: d.id,
      item_name: d.name
    }
    return ajax.post('nursery/Education/reminders', data)
  },
  // 转班
  eduClassShift: (d) => {
    let data = {
      group_id: d.gid,
      class_id: d.cid,
      c_id: d.id
    }
    return ajax.post('nursery/Education/shiftShift', data)
  },
  // 分班
  eduClassDiv: (d) => {
    let data = {
      group_id: d.gid,
      class_id: d.cid,
      c_id: d.id,
      base_map: d.pic
    }
    return ajax.post('nursery/Education/division', data)
  },
  // 编辑学生信息
  eduStudentEdit: (d) => {
    return ajax.post('nursery/Education/editStudentInfo', d)
  },
  /**----------------------------------------------------- 园长管理 入驻与审批----------------------------------------------------- */
  // 获取入驻审批
  direIndex: (d) => {
    let data = {
      examine: d.type || 1, // 1通过 2待审核 3未通过
      contact: d.tel || '',
      name: d.name || '',
      start_time: d.st || '',
      end_time: d.et || '',
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/teacher/index', data)
  },
  // 老师审核
  direExamine: (d) => {
    let data = {
      teacher_id: d.id,
      status: [3, 1][d.type] || 1, // 1通过 3未通过
      remarks: d.brief || ''
    }
    return ajax.post('nursery/teacher/examine', data)
  },
  // 删除老师
  direDel: (id) => {
    return ajax.post('nursery/teacher/teacherDel', { teacher_id: id })
  },
  /**----------------------------------------------------- 绩效考核 ----------------------------------------------------- */
  // 绩效考核 详情
  raIndex: (d) => {
    let data = {
      staff_id: d.id,
      year_month: (d.time || '').replace(/\//g, '-')
    }
    return ajax.post('nursery/Human/Assessment', data)
  },
  // 绩效打分
  raPay: (d) => {
    let data = {
      // year_month: (d.time || '').replace(/\//g, '-'),
      score_json: d.json || '[]',
      staff_id: d.id,
      month_id: d.mid
    }
    return ajax.post('nursery/Human/selfAssessment', data)
  },
  // 工资
  raWage: (d) => {
    return ajax.post('nursery/Human/myWage', { year_month: d.replace(/\//g, '-') })
  },
  // 待考核
  raList: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/Human/myAssessmentStaffList', data)
  },
  // 绩效考核红点
  raDot: () => {
    return ajax.post('nursery/Human/TrackPoint', {})
  },
  /**----------------------------------------------------- 食材---------------------------------------------------- */
  // 获取食材列表
  foodIndex: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10,
      keywords: d.val || '',
      date: d.time || '',
      status: d.type || '1'
    }
    return ajax.post('nursery/v2_food/getFoodList', data)
  },
  // 订单详情
  foodDetail: (id) => {
    return ajax.post('nursery/v2_food/getFoodOrderInfo', { id })
  },
  // 确认订单
  foodOrder: (d) => {
    let data = {
      id: d.id,
      total_amount: d.price,
      food_json: JSON.stringify(d.val || []),
    }
    return ajax.post('nursery/v2_food/confirmFoodOrder', data)
  },
  // 获取供应商
  foodSupplier: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/v2_food/getMerchantList', data)
  },
  // 分类列表
  foodList: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 15,
      merchant_id: d.id
    }
    return ajax.post('nursery/v2_food/getFoodClassList', data)
  },
  // 分类下食材
  foodLists: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 15,
      id: d.id
    }
    return ajax.post('nursery/v2_food/getFoodByClass', data)
  },
  // 上次下单地址
  foodAddress: () => {
    return ajax.post('nursery/v2_food/getLastAddressData', {})
  },
  // 提交订单
  foodSubmit: (d) => {
    let data = {
      food_json: JSON.stringify(d.val || []),
      merchant_id: d.id,
      delivery_specific_date: d.time,
      delivery_starting_period: d.hour1,
      delivery_end_time: d.hour2,
      contacts: d.name,
      contact_number: d.tel,
      delivery_address: d.addr,
      order_date: d.timeout,
      total_amount: d.price
    }
    return ajax.post('nursery/v2_food/submitFoodOrder', data)
  },
  /**----------------------------------------------------- 基础获取 ----------------------------------------------------- */
  // 获取所有员工
  getStaffs: () => {
    return ajax.post('com/nursery_common/getallstaff', { is_human: 1 })
  },
  // 获取所有家长
  getParents: () => {
    return ajax.post('com/nursery_common/getallparents', {})
  },
  // 获取园所部门
  getGroup: (d) => {
    let data = {
      is_human: d.kh || 0, // 是否为绩效考核 1是 0否
      is_need_dean: d.bm || 0 // 是否需要园长部门 1是 0否
    }
    return ajax.post('com/nursery_common/getgroup', data)
  },
  // 获取班级
  getClass: (d) => {
    return ajax.post('com/nursery_common/getclass', { grade: d || '' })
  },
  // 获取家长
  getParent: (id) => {
    return ajax.post('com/nursery_common/getparent', { class_id: id })
  },
  // 获取员工
  getStaff: (d) => {
    let data = { g_id: d.id, is_human: d.type || 1 } // 是否为绩效考核 1是 2否
    return ajax.post('com/nursery_common/getstaff', data)
  },
  // 获取所有员工与家长人数
  getNum: () => {
    return ajax.post('com/nursery_common/GetQuantity', {})
  },
  // 获取物品分类
  getDataType: () => {
    return ajax.post('com/nursery_common/getsuppliescategory', { is_group: 0 })
  },
  // 获取物资
  getDataTypeData: (id) => {
    return ajax.post('com/nursery_common/getsupplies', { is_group: 0, c_id: id })
  },
  // 获取供应商
  getSupplier: () => {
    return ajax.post('com/nursery_common/getsupplier', { is_group: 0 })
  },
  // 获取宝贝编辑城市
  getBabyCity: () => {
    return ajax.web({ url: 'static/js/e.json', baseUrl: './' })
  },
  // 获取国籍
  getCountry: () => {
    return ajax.post('nursery/Education/getCountry', {})
  },
  /**----------------------------------------------------- 2020 1123 新增 ----------------------------------------------------- */
  // 通讯录-家长
  mailParent: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      name: d.search || '',
      class_id: d.id
    }
    return ajax.post('nursery/Maillist/parentAddressBook', data)
  },
  // 通讯录-老师
  mailTeacher: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      name: d.search || '',
      g_id: d.id,
      job_id: d.jid
    }
    return ajax.post('nursery/Maillist/teacherAddressBook', data)
  },
  // 通讯录-政务-添加
  mailAdd: (d) => {
    let data = {
      unit_name: d.text, // 单位名称
      contacts: d.name, // 联系人
      post: d.job, // 职位
      telephone: d.tel, // 电话
      remarks: d.brief //备注
    }
    return ajax.post('nursery/Maillist/addGovernmentAddressBook', data)
  },
  // 通讯录-政务-删除
  mailDel: (id) => {
    return ajax.post('nursery/Maillist/deleteGovernmentAddressBook', { id })
  },
  // 通讯录-政务-修改
  mailUpd: (d) => {
    let data = {
      id: d.id,
      unit_name: d.text, // 单位名称
      contacts: d.name, // 联系人
      post: d.job, // 职位
      telephone: d.tel, // 电话
      remarks: d.brief //备注
    }
    return ajax.post('nursery/Maillist/editGovernmentAddressBook', data)
  },
  // 通讯录-政务-查询
  mailSel: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      name: d.search || '',
    }
    return ajax.post('nursery/Maillist/governmentAddressBook', data)
  },
  // 一日三旬表
  threeGet: (d) => {
    let data = {
      date: d.time,
      class_id: d.c,
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/three_tours/index', data)
  },
  // 一日三旬表 - 班级实到缺勤人数
  threeClass: (d) => {
    return ajax.post('nursery/three_tours/getNumber', { class_id: d })
  },
  // 一日三旬表 - 添加
  threeAdd: (d) => {
    let data = {
      class_id: d.id,
      come_true: d.answer,
      absence_from_duty: d.lack,
      date: d.time,
      outdoors: d.o,
      routine_hygiene: d.dr,
      eat_on_time: d.de,
      dining_hygiene: d.dh,
      sleep_status: d.ss,
      convention: d.sr,
      child_health: d.cc,
      sanitation: d.cr,
      inspector: d.img,
    }
    return ajax.post('nursery/three_tours/add_doctor', data)
  },
  // 一日三旬表 - 详情
  threeDetail: (d) => {
    return ajax.post('nursery/three_tours/details', { id: d })
  },
  // 喂药管理 - 喂药列表
  medList: (d) => {
    let o = [0, 2, 1, 2, 1]
    let data = {
      date: d.time || '',
      class_id: (d.id < 0 ? 0 : d.id) || '',
      page: d.page || 1,
      limit: d.limit || 20,
      morning_status: o[d.am], // [1,2] 已喂，未喂
      afternoon_status: o[d.pm]
    }
    return ajax.post('nursery/medication/index', data)
  },
  // 喂药管理 - 喂药详情
  medDetail: (d) => {
    return ajax.post('nursery/medication/details', { id: d })
  },
  // 喂药管理 - 喂药操作
  medSend: (d) => {
    let data = {
      id: d.id,
      field: ['morning_status', 'afternoon_status'][d.type]
    }
    return ajax.post('nursery/medication/operation', data)
  },
  // 喂药管理 - 老师签字
  medTeacher: (d) => {
    let data = {
      id: d.id,
      autograph: d.img
    }
    return ajax.post('nursery/medication/autograph', data)
  },
  // 招聘管理 - 列表
  recList: () => {
    return ajax.post('nursery/Human/recruitList', {})
  },
  // 招聘管理 - 招聘二维码
  recCode: () => {
    return ajax.post('nursery/Human/humanQrcode', {})
  },
  // 招聘管理 - 简历信息
  recDetail: (d) => {
    return ajax.post('nursery/Human/resumeDetail', { resume_id: d.id, staff_id: '' })
  },
  // 招聘管理 - 删除简历
  recDel: (d) => {
    return ajax.post('nursery/Human/deleteResume', { resume_id: d.id })
  },
  // 数据显示 - 在读人数
  showRead: (d) => {
    let data = {
      year: d.time, start_time: d.s.replace('/', '-'), end_time: d.e.replace('/', '-'),
      semester: [2, 1][d.type] || 1 // 0=上学期 1=下学期
    }
    return ajax.post('nursery/statistics/readingData', data)
  },
  // 数据显示 - 在册人数
  showBook: (d) => {
    let data = {
      year: d.time, start_time: d.s.replace('/', '-'), end_time: d.e.replace('/', '-'),
      semester: [2, 1][d.type] || 1 // 0=上学期 1=下学期
    }
    return ajax.post('nursery/statistics/registered', data)
  },
  // 数据显示 - 出勤率
  showRate: (d) => {
    let data = {
      year: d.time,
      class_id: d.classId, start_time: d.s.replace('/', '-'), end_time: d.e.replace('/', '-'),
      semester: [2, 1][d.type] || 1 // 0=上学期 1=下学期
    }
    return ajax.post('nursery/statistics/attendance', data)
  },
  // 数据显示 - 食材、水、电、气
  showFood: (d) => {
    let data = {
      year: d.time, start_time: d.s.replace('/', '-'), end_time: d.e.replace('/', '-'),
      type: d.id || 1, // 1食材 2水 3电 4气 5工资社保  6费用
      semester: [2, 1][d.type] || 1 // 0=上学期 1=下学期
    }
    return ajax.post('nursery/statistics/foodIngredients', data)
  },
  // 数据显示 - 添加食材、水、电、气
  showAdd: (d) => {
    return ajax.post('nursery/statistics/add_data_statistics', { data: JSON.stringify(d) })
  },
  showFoods: (d) => {
    let data = {
      year: d.time,
      type: d.id || 1,
      semester: [2, 1][d.type] || 1 // 0=上学期 1=下学期
    }
    return ajax.post('nursery/statistics/adjunction', data)
  },
  // 获取班级 - 新的
  getTeacherClass: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 100
    }
    return ajax.post('com/nursery_common/getclasses', data)
  },
  /**----------------------------------------------------- 2020 1215 新增 ----------------------------------------------------- */
  // 来访登记
  signIn: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/register/index', data)
  },
  // 来访登记二维码
  signQr: () => {
    return ajax.post('nursery/register/twentyfour', {})
  },
  // -------- 积分管理
  // 行为积分 列表
  interDeed: (d) => {
    let data = {
      type: [2, 1][d.type] || 2, // 0扣分 1奖分
      year_month: d.time, // 0000-00
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/behavior_integral/index', data)
  },
  // 获取行为积分
  interDeedGet: (d) => {
    // 0扣分 1奖分
    return ajax.post('nursery/behavior_integral/behaviorTemplate', { type: [2, 1][d] || 2 })
  },
  // 添加，扣除 行为记分
  interDeedSum: (d) => {
    let data = {
      program: d.name, // 奖分/扣分项目
      malformed: d.rule, // 规则
      minutes: d.num, // 分值
      type: [2, 1][d.type] || 2, // 0扣分 1奖分
      staff_id: d.id,
      remarks: d.message || '',
      picture: d.img || ''
    }
    return ajax.post('nursery/behavior_integral/create', data)
  },
  // 我的行为积分 积分明细
  interDeedThis: (d) => {
    let data = {
      type: [2, 1][d.type] || 2, // 0扣分 1奖分
      year_month: d.time, // 0000-00
      page: d.page || 1,
      limit: d.limit || 10
    }
    return ajax.post('nursery/behavior_integral/MyBehaviorList', data)
  },
  // 我的月度积分
  interMonthThis: (d) => {
    return ajax.post('nursery/behavior_integral/myMonthlyPoints', { year_month: d.month })
  },
  // 我的总积分
  interAllThis: () => {
    return ajax.post('nursery/behavior_integral/myTotalPoints', {})
  },
  // 获取我的学期/年度积分
  interYearThis: (d) => {
    let data = {
      start_time: d.time, // 0000-00
      end_time: d.end, // 0000-00
      year: d.year, // 0000
      semester: [2, 1][d.type] || 0, // 0下学期 1上学期
    }
    return ajax.post('nursery/behavior_integral/SemesterPoints', data)
  },
  // 月度积分榜
  interMonthList: (d) => {
    let data = {
      year_month: d.month, // 0000-00
      j_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20,
    }
    return ajax.post('nursery/behavior_integral/monthlyScoreboard', data)
  },
  // 学期/年度积分榜
  interYearList: (d) => {
    let data = {
      start_time: d.time, // 0000-00
      end_time: d.end, // 0000-00
      year: d.year, // 0000
      semester: [2, 1][d.type] || 2, // 0下学期 1上学期
      j_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20,
    }
    return ajax.post('nursery/behavior_integral/SemesterScoreboard', data)
  },
  // 总积分榜
  interAllList: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      j_id: d.id
    }
    return ajax.post('nursery/behavior_integral/TotalScoreboard', data)
  },
  // 上传修改积分管理制度
  interUpload: (d) => {
    return ajax.post('nursery/behavior_integral/uploadManagementSystem', { url: d })
  },
  // 获取积分管理制度
  interGetSystem: () => {
    return ajax.post('nursery/behavior_integral/getManagementSystem', {})
  },
  // 获取积分待考核人
  interGetPeople: () => {
    return ajax.post('nursery/behavior_integral/getTheExaminee', {})
  },
  // 工作-老师，家长审核数量
  workCircle: () => {
    return ajax.post('com/nursery_common/pendingAudit', {})
  },
  // 岗位职责
  manInfoList: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/Human/JobDescription', data)
  },
  // -------- 表单管理
  // 在园记录
  tabGar: (d) => {
    return ajax.post('nursery/garden_record/index', d)
  },
  // 获取学生
  tabGarStudent: (d) => {
    return ajax.post('nursery/garden_record/classStudents', d)
  },
  // 在园记录-添加
  tabGarAdd: (d) => {
    return ajax.post('nursery/garden_record/increase', d)
  },
  // 上传园所荣誉/vr
  garHonorAdd: (d) => {
    return ajax.post('nursery/work/honor_add', { type: d.type || 1, url: d.url })
  },
  // 删除园所荣誉
  garHonorDel: (d) => {
    return ajax.post('nursery/work/honor_del', { id: d.id })
  },
  // 请假
  leaveIndex: (d) => {
    return ajax.post('nursery/Education/leaveRecord', d)
  },
  // 同意请假
  leaveAgree: (d) => {
    return ajax.post('nursery/work/agree_leave', { id: d.id })
  },
  // 宝宝考勤
  babyAttendance: (d) => {
    let data = {
      c_id: d.id,
      year_month: d.time,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/Education/timeTag', data)
  },
  // 轮播图 - 列表
  banList: (d) => {
    let data = { page: d.page || 1, limit: d.limit || 10 }
    return ajax.post('nursery/banner/index', data)
  },
  // 轮播图 - 添加
  banAdd: (d) => {
    let data = { describe: d.title, picture: d.image, content: d.content, sort: d.sort || 1 }
    return ajax.post('nursery/banner/increase', data)
  },
  // 轮播图 - 编辑
  banEdit: (d) => {
    let data = { describe: d.title, picture: d.image, content: d.content, sort: d.sort, id: d.id }
    return ajax.post('nursery/banner/editor', data)
  },
  // 轮播图 - 删除
  banDel: (d) => { return ajax.post('nursery/banner/delete', { banner_id: d.id }) },
  // 轮播图 - 详情
  banDetail: (d) => { return ajax.post('nursery/banner/details', { banner_id: d.id }) },
  // 园所咨询 - 列表
  zxList: (d) => {
    let data = { page: d.page || 1, limit: d.limit || 10 }
    return ajax.post('nursery/information/index', data)
  },
  // 园所咨询 - 添加
  zxAdd: (d) => {
    let data = {
      title: d.title, image: d.image, content: d.content
    }
    return ajax.post('nursery/information/increase', data)
  },
  // 园所咨询 - 编辑
  zxEdit: (d) => {
    let data = { title: d.title, image: d.image, content: d.content, id: d.id }
    return ajax.post('nursery/information/editor', data)
  },
  // 园所咨询 - 删除
  zxDel: (d) => { return ajax.post('nursery/information/delete', { id: d.id }) },
  // 园所咨询 - 详情
  zxDetail: (d) => { return ajax.post('nursery/information/details', { teachers_id: d.id }) },
  // 园所咨询 - 上下移
  zxSort: (d) => {
    // 1下移 2上移
    let data = { id: d.id, status: d.type }
    return ajax.post('nursery/information/sort', data)
  },
  // 绩效指标库 考核
  // 列表
  jxIndex: (d) => {
    let data = {
      page: d.page || 1,
      limit: d.limit || 20,
      name: d.name || '',
      group_id: d.gid || '',
      job_id: d.jid || ''
    }
    return ajax.post('nursery/human/achievements', data)
  },
  // 部门获取
  jxGroup: () => {
    return ajax.post('nursery/human/getLinkage', {})
  },
  // 考核详情
  jxDetail: (d) => {
    return ajax.post('nursery/human/assessment_details', { id: d.id })
  },
  // 设置
  jxSend: (d) => {
    let data = {
      id: d.id,
      assessment_name: d.title,
      parent_s_id: d.pid,
      year_month: d.time,
      data: d.json,
      assessment_id: d.aid
    }
    return ajax.post('nursery/human/assessment_edit', data)
  },
  // 获取kpl指标库
  jxKpl: (d) => {
    let data = { department_id: d.id, page: d.page || 1, limit: d.limit || 20 }
    return ajax.post('nursery/human/get_index_database', data)
  },
  // 联系人
  lxr: (d) => {
    let data = { contacts: d.name, contact: d.tel, longitude: d.lng, latitude: d.lat, address: d.addr, localization: d.address }
    return ajax.post('com/nursery_common/nursery_ext', data)
  },
  // 联系人详情
  lxrs: () => {
    return ajax.post('com/nursery_common/nurseryExtDetails', {})
  },
  // 成长管理
  // 获取班级-宝贝
  growBaby: (d) => {
    let data = {
      class_id: d.id || '',
      name: d.name,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/integral/index', data)
  },
  // 奖分
  growGrade: (d) => {
    let data = {
      child_id: d.id,
      integral: d.grade,
      describe: d.text,
      photograph: d.image
    }
    return ajax.post('nursery/adolesce/integral/bonusPoints', data)
  },
  // 积分记录
  growGradeDetail: (d) => {
    let data = {
      class_id: d.id,
      type: d.type || 1,
      date: d.time,
      name: d.name,
      child_id: d.cid,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/integral/awardScoreRecord', data)
  },
  // 积分榜
  growGradeLevel: (d) => {
    let data = {
      class_id: d.id,
      type: d.type || 1,
      date: d.time,
      name: d.name,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/integral/classScoreboard', data)
  },
  // 相册列表
  growPhoto: (d) => {
    let data = {
      child_id: d.id,
      start_time: d.time || '',
      end_time: d.end || '',
      year: d.year || '',
      semester: d.type || 1,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/term_album/index', data)
  },
  // 添加相册
  growPhotoAdd: (d) => {
    let data = {
      child_id: d.id,
      years: d.year,
      picture: d.image
    }
    return ajax.post('nursery/adolesce/term_album/createAlbum', data)
  },
  // 编辑相册
  growPhotoEdit: (d) => {
    let data = {
      child_id: d.id,
      years: d.year,
      picture: d.image,
      term_album_id: d.pid
    }
    return ajax.post('nursery/adolesce/term_album/edit', data)
  },
  // 相册详情
  growPhotoDetail: (d) => {
    let data = {
      child_id: d.id,
      term_album_id: d.pid
    }
    return ajax.post('nursery/adolesce/term_album/details', data)
  },
  // 作业
  growTaskList: (d) => {
    let data = {
      class_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/homeland/index', data)
  },
  // 设定在编人数
  setGroup: (d) => {
    let data = {
      group_id: d.id,
      number: d.number
    }
    return ajax.post('com/nursery_common/settingEditing', data)
  },
  // 设置作业
  growTaskAdd: (d) => {
    let data = {
      content: d.content,
      picture: d.pic,
      video: d.src,
      class_id: d.id
    }
    return ajax.post('nursery/adolesce/homeland/increase', data)
  },
  // 作业类型
  growTaskDetail: (d) => {
    let data = { task_id: d.id, page: d.page || 1, limit: d.limit || 10 }
    data.status = [1, 2, 1, 2][d.type] // 0已答题 1未答题 2已提交 3已完成
    let url = d.type < 2 ? 'nursery/adolesce/homeland/questionsAnswered' : 'nursery/adolesce/homeland/jobList'
    return ajax.post(url, data)
  },
  // 作业详情
  growTaskDetails: (d) => {
    let data = {
      task_id: d.id,
      child_id: d.cid
    }
    return ajax.post('nursery/adolesce/homeland/details', data)
  },
  // 作业完成
  growTaskEnd: (d) => {
    return ajax.post('nursery/adolesce/homeland/completed', { task_answers_id: d.id })
  },
  // 每日成长 列表
  growUpList: (d) => {
    let data = {
      class_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/adolesce/everyday/index', data)
  },
  // 每日成长 新增
  growUpAdd: (d) => {
    let data = {
      content: d.text,
      picture: d.image,
      class_id: d.id
    }
    return ajax.post('nursery/adolesce/everyday/increase', data)
  },
  // 每日成长 编辑
  growUpEdit: (d) => {
    let data = {
      content: d.text,
      picture: d.image,
      id: d.id
    }
    return ajax.post('nursery/adolesce/everyday/modify', data)
  },
  // 每日成长 删除
  growUpDel: (d) => {
    return ajax.post('nursery/adolesce/everyday/delete', { id: d.id })
  },
  // 每日成长 详情
  growUpDetail: (d) => {
    return ajax.post('nursery/adolesce/everyday/details', { id: d.id })
  },
  // 积分商城 - 编辑/新建
  growShopAdd: (d) => {
    return ajax.post('nursery/adolesce/integral/add_points_mall', { class_id: d.id, img: d.img })
  },
  // 积分商城 - 详情
  growShopDetail: (d) => {
    return ajax.post('nursery/adolesce/integral/points_mall', { class_id: d.id })
  },
  // 制度/表单 部门
  toolGroup: (d) => {
    // 1 制度 2表单 3园所课堂
    return ajax.post('nursery/yuansuo/tool/classification', { type: d.id || 1 })
  },
  // 制度/表单 列表
  toolList: (d) => {
    let data = {
      type: d.type || 1,
      department_id: d.id || '',
      title: d.title || '',
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/yuansuo/tool/index', data)
  },
  // 制度/表单 详情
  toolDetail: (d) => {
    return ajax.post('nursery/yuansuo/tool/details', { document_id: d.id })
  },
  // 环创 - 分类
  ueiType: () => {
    return ajax.post('nursery/yuansuo/innovation/classifiy', {})
  },
  // 环创 - 列表
  ueiList: (d) => {
    let data = {
      classify_id: d.id,
      sort: d.type || 1, // 1:点赞量倒序 2:点赞量正序3:浏览量倒序4:浏览量正序5:发布时间正序6:发布时间倒序
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/yuansuo/innovation/index', data)
  },
  // 环创 - 新增
  ueiAdd: (d) => {
    let data = {
      classify_id: d.id,
      title: d.title,
      cover: d.pic,
      content: d.cont
    }
    return ajax.post('nursery/yuansuo/innovation/increase', data)
  },
  // 环创 - 编辑
  ueiEdit: (d) => {
    let data = {
      classify_id: d.id,
      title: d.title,
      cover: d.pic,
      content: d.cont,
      id: d.sid
    }
    return ajax.post('nursery/yuansuo/innovation/editor', data)
  },
  // 环创 - 点赞列表
  ueiUpList: (d) => {
    let data = {
      id: d.id, page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/yuansuo/innovation/likesList', data)
  },
  // 环创 - 详情
  ueiDetail: (d) => {
    let url = 'details'
    if (+d.tp) {
      url = 'detailedInformation'
    }
    console.log(url)
    // 1编辑详情 不传列表详情
    return ajax.post('nursery/yuansuo/innovation/' + url, { id: d.id, type: d.type || '' })
  },
  // 环创 - 我的
  ueiUpUser: (d) => {
    let data = {
      classify_id: d.id,
      sort: d.type || 1, // 1:点赞量倒序 2:点赞量正序3:浏览量倒序4:浏览量正序5:发布时间正序6:发布时间倒序
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/yuansuo/innovation/myInnovation', data)
  },
  // 环创 - 点赞
  ueiUp: (d) => {
    return ajax.post('nursery/yuansuo/innovation/likes', { id: d.id })
  },
  // 环创 - 删除
  ueiDel: (d) => {
    return ajax.post('nursery/yuansuo/innovation/delete', { id: d.id })
  },
  // -------- 老师考勤
  // -------- 财务管理
  money: (d) => {
    return ajax.post('nursery/finance/financial', { page: d.page || 1, limit: d.limit || 20 })
  },
  // 维修申请
  repair: (d) => {
    let data = {
      date: d.time,
      article: d.text,
      explain: d.msg,
      repairman: d.name,
      staff_name: d.author
    }
    return ajax.post('nursery/director/repair/increase', data)
  },
  // 维修列表
  repairList: (d) => {
    let data = {
      date: d.time || '',
      department_id: d.id,
      page: d.page || 1,
      limit: d.limit || 20
    }
    return ajax.post('nursery/director/repair/index', data)
  },
  // 维修详情
  repairDetail: (d) => {
    return ajax.post('nursery/director/repair/details', d)
  },
  // 维修审批
  repairApproval: (d) => {
    let data = {
      id: d.id,
      type: d.type || 1,
      picture: d.img || '',
      completion_time: d.time || ''
    }
    return ajax.post('nursery/director/repair/autograph', data)
  },
  // 考勤
  // 上传人脸
  teacher_face: (d) => {
    return ajax.post('nursery/user/attendanceBaseMap', d)
  },
  // 获取人脸
  teacher_face_get: () => {
    return ajax.post('nursery/user/getBaseMap', {})
  },
  // 我的考勤
  teacher_get: (d) => {
    return ajax.post('nursery/user/MyAttendance', { date: d.time })
  },
  // 删除编制 员工
  del_staffs: (d) => {
    return ajax.post('nursery/Human/deleteEmployee', { staff_id: d.id })
  },
  // 定位信息
  locationMessage: (d) => {
    let url = 'Position_re' // 已经缴纳定位费
    switch (+d.type) {
      case 1:
        url = 'Position_pending' // 待审核
        break
      case 2:
        url = 'Position_canceled' // 已取消
        break
      default:
    }
    return ajax.post('nursery/enroll/' + url, { page: d.page || 1, limit: d.limit || 20, search: d.search || '' })
  },
  // 定位详情
  locationMessageDetail: (d) => {
    return ajax.post('nursery/enroll/Position_detail', { charge_id: d.id })
  },
  // 我的考勤
  teacherUser: (d) => {
    return ajax.post('nursery/user/attendanceRecord', { year_month: d.time || '', page: d.page || 1, limit: d.limit || 20 })
  },
  // 请假记录
  teacherList: (d) => {
    return ajax.post('nursery/user/leaveRecord', { page: d.page || 1, limit: d.limit || 20 })
  },
  // 2021-03-26
  // [新功能] 收集视频点击量与统计 播放视频获取一次请求
  videoNum: () => {
    // 后台可分时间段查询
  },
  // 2021-04-24
  // 宝宝人脸
  babyFace: (d) => {
    return ajax.post('nursery/Education/attendanceBaseMap', { base_map: d.pic, c_id: d.id })
  }
}

// 2021-01-20 新增 公共方法
http.http = (name, data, fn, fn2, flag) => {
  if (http[name] && name !== 'http') {
    if (!flag) {
      model.loading()
    }
    http[name](data).then(e => {
      model.clear()
      if (e.code) {
        fn(e.data);
      } else {
        model.info(e.data.msg, 2);
        if (fn2) { fn2(e.data) }
      }
    }).catch(e => {
      model.clear()
      model.info(e.err || e.msg, 2);
      if (fn2) { fn2(e) }
    })
  }
}

export default http


