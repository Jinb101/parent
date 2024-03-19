class validate {
  // 登录
  login(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_null(opt['pwd'])) {
      return error('请输入密码', 'pwd')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的手机号', 'tel')
    }
    if (is_length(opt['pwd'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd')
    }
    return code('验证成功', 1, opt)
  }
  // 注册
  reg(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_null(opt['sms'])) {
      return error('请输入验证码', 'sms')
    }
    if (is_null(opt['pwd'])) {
      return error('请输入密码', 'pwd')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的手机号', 'tel')
    }
    if (is_length(opt['sms'], 4, 4)) {
      return error('请输入 4 位验证码', 'sms')
    }
    if (is_length(opt['pwd'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd')
    }
    if (!opt['checked']) {
      return error('请先同意用户协议', 'checked')
    }
    return code('验证成功', 1, opt)
  }
  // 发送短信
  sms(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的手机号', 'tel')
    }
    return code('验证成功', 1, opt)
  }
  // 忘记密码
  forget(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_null(opt['sms'])) {
      return error('请输入验证码', 'sms')
    }
    if (is_null(opt['pwd'])) {
      return error('请输入密码', 'pwd')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的手机号', 'tel')
    }
    if (is_length(opt['sms'], 4, 4)) {
      return error('请输入 4 位验证码', 'sms')
    }
    if (is_length(opt['pwd'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd')
    }
    return code('验证成功', 1, opt)
  }
  // 修改密码
  pwd(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_null(opt['sms'])) {
      return error('请输入验证码', 'sms')
    }
    if (is_null(opt['pwd'])) {
      return error('请输入密码', 'pwd')
    }
    if (is_null(opt['pwd2'])) {
      return error('请确认密码', 'pwd2')
    }
    if (is_length(opt['sms'], 4, 4)) {
      return error('请输入 4 位验证码', 'sms')
    }
    if (is_length(opt['pwd'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd')
    }
    if (is_length(opt['pwd2'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd2')
    }
    if (opt['pwd'] !== opt['pwd2']) {
      return error('两次密码输入不一致', 'pwd2')
    }
    return code('验证成功', 1, opt)
  }
  // 申请老师
  teach(opt) {
    if (is_null(opt['name'])) {
      return error('请输入名字', 'name')
    }
    if (is_null(opt['tel'])) {
      return error('请输入联系方式', 'tel')
    }
    if (is_null(opt['id'])) {
      return error('请选择岗位', 'id')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的联系方式', 'tel')
    }
    return code('验证成功', 1, opt)
  }
  // 修改密码
  upd_pwd(opt) {
    if (is_null(opt['pwd'])) {
      return error('请输入原密码', 'pwd')
    }
    if (is_null(opt['pwd2'])) {
      return error('请输入新密码', 'pwd2')
    }
    if (is_null(opt['pwd3'])) {
      return error('请确认新密码', 'pwd3')
    }
    if (is_length(opt['pwd2'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd2')
    }
    if (is_length(opt['pwd3'], 6, 20)) {
      return error('密码长度不符，请输入 6-20 位密码', 'pwd3')
    }
    if (opt['pwd2'] !== opt['pwd3']) {
      return error('两次密码输入不一致', 'pwd3')
    }
    if (opt['pwd'] === opt['pwd3']) {
      return error('新密码与原密码一致', 'pwd3')
    }
    return code('验证成功', 1, opt)
  }
  // 修改手机号
  phone(opt) {
    if (is_null(opt['tel'])) {
      return error('请输入手机号', 'tel')
    }
    if (is_null(opt['sms'])) {
      return error('请输入验证码', 'sms')
    }
    if (is_phone(opt['tel'])) {
      return error('请正确输入手机号', 'tel')
    }
    if (is_length(opt['sms'], 4, 4)) {
      return error('请输入 4 位验证码', 'sms')
    }
    return code('验证成功', 1, opt)
  }
  // 新增生源
  addEnrollment(opt) {
    if (is_null(opt['name'])) {
      return error('请输入宝宝姓名', 'name')
    }
    if (is_null(opt['sex'])) {
      return error('请选择性别', 'sex')
    }
    if (is_null(opt['time'])) {
      return error('请选择出生年月', 'time')
    }
    if (is_null(opt['nick'])) {
      return error('请输入家长姓名', 'nick')
    }
    if (is_null(opt['tel'])) {
      return error('请输入联系方式', 'tel')
    }
    if (is_null(opt['address'])) {
      return error('请输入联系地址', 'address')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的联系方式', 'tel')
    }
    return code('验证成功', 1, opt)
  }
  // 编辑
  editEnrollment(opt) {
    if (is_null(opt['num'])) {
      return error('请输入序号', 'num')
    }
    if (is_null(opt['name'])) {
      return error('请输入名字', 'name')
    }
    if (is_null(opt['sex'])) {
      return error('请选择性别', 'sex')
    }
    if (is_null(opt['year'])) {
      return error('请选择出生年月', 'year')
    }
    if (is_null(opt['nick'])) {
      return error('请输入家长姓名', 'nick')
    }
    if (is_null(opt['tel'])) {
      return error('请输入联系方式', 'tel')
    }
    if (is_null(opt['address'])) {
      return error('请输入联系地址', 'address')
    }
    if (is_null(opt['time'])) {
      return error('请选择时间', 'time')
    }
    if (is_null(opt['add'])) {
      return error('请输入添加人', 'add')
    }
    if (is_null(opt['add_time'])) {
      return error('请选择添加时间', 'add_time')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的联系方式', 'tel')
    }
    return code('验证成功', 1, opt)
  }
  // 发表通知
  noticeAdd(opt) {
    if (is_null(opt['title'])) {
      return error('请输入标题', 'title')
    }
    if (is_null(opt['message'])) {
      return error('请输入内容', 'message')
    }
    return code('验证成功', 1, opt)
  }
  // 发起采购
  approvalSend(opt) {
    if (!is_array(opt['json'])) {
      return error('请添加采购物品', 'json')
    }
    if (!is_array(opt['id'])) {
      return error('请选择审批人', 'id')
    }
    // if (!is_array(opt['zid'])) {
    //   return error('请选择知会人', 'zid')
    // }
    // if (is_null(opt['gid'])) {
    //   return error('请选择供应商', 'gid')
    // }
    // if (is_null(opt['message'])) {
    //   return error('请输入任务说明', 'message')
    // }
    return code('验证成功', 1, opt)
  }
  // 发起领用
  approvalSendCollect(opt) {
    if (!is_array(opt['json'])) {
      return error('请添加领用物品', 'json')
    }
    if (!is_array(opt['id'])) {
      return error('请选择审批人', 'id')
    }
    // if (!is_array(opt['zid'])) {
    //   return error('请选择知会人', 'zid')
    // }
    // if (is_null(opt['message'])) {
    //   return error('请输入任务说明', 'message')
    // }
    return code('验证成功', 1, opt)
  }
  // 发起费用
  approvalSendCost(opt) {
    if (is_null(opt['price'])) {
      return error('请输入申请金额', 'price')
    }
    if (!is_array(opt['id'])) {
      return error('请选择审批人', 'id')
    }
    // if (!is_array(opt['zid'])) {
    //   return error('请选择知会人', 'zid')
    // }
    // if (is_null(opt['message'])) {
    //   return error('请输入任务说明', 'message')
    // }
    if (isNaN(opt['price'])) {
      return error('请正确输入申请金额', 'price')
    }
    return code('验证成功', 1, opt)
  }
  // 发起报销
  approvalSendReimbursement(opt) {
    if (!is_array(opt['json'])) {
      return error('请添加领用物品', 'json')
    }
    if (!is_array(opt['id'])) {
      return error('请选择审批人', 'id')
    }
    // if (!is_array(opt['zid'])) {
    //   return error('请选择知会人', 'zid')
    // }
    // if (is_null(opt['message'])) {
    //   return error('请输入任务说明', 'message')
    // }
    return code('验证成功', 1, opt)
  }
  // 发起出勤
  approvalSendAttendance(opt) {
    if (is_null(opt['type'])) {
      return error('请选择出勤类别', 'type')
    }
    if (is_null(opt['st'])) {
      return error('请选择开始时间', 'st')
    }
    if (is_null(opt['et'])) {
      return error('请选择结束时间', 'et')
    }
    if (!is_array(opt['id'])) {
      return error('请选择审批人', 'id')
    }
    // if (!is_array(opt['zid'])) {
    //   return error('请选择知会人', 'zid')
    // }
    // if (is_null(opt['message'])) {
    //   return error('请输入任务说明', 'message')
    // }
    return code('验证成功', 1, opt)
  }
  // 添加物资
  logDataAdd(opt) {
    if (is_null(opt['name'])) {
      return error('请输入物资名称', 'name')
    }
    if (is_null(opt['cid'])) {
      return error('请选择物资分类', 'cid')
    }
    // if (is_null(opt['num'])) {
    //   return error('请输入物资数量', 'num')
    // }
    // if (is_null(opt['price'])) {
    //   return error('请输入物资单价', 'price')
    // }
    if (is_null(opt['uid'])) {
      return error('请选择物资单位', 'uid')
    }
    // if (isNaN(opt['num']) || opt['num'].indexOf('.') >= 0 || opt['num'].indexOf('-') >= 0) {
    //   return error('请正确输入物资数量', 'num')
    // }
    // if (isNaN(opt['price']) || opt['num'].indexOf('-') >= 0) {
    //   return error('请正确输入物资单价', 'price')
    // }
    return code('验证成功', 1, opt)
  }
  // 添加班级 班级班级
  eduClassEvent(opt) {
    if (is_null(opt['name'])) {
      return error('请输入班级名称', 'name')
    }
    if (is_null(opt['cid'])) {
      return error('请选择班级类型', 'tid')
    }
    if (is_null(opt['num'])) {
      return error('请输入班级容量', 'num')
    }
    // if (is_null(opt['tid'])) {
    //   return error('请选择班主任', 'tid')
    // }
    // if (!is_array(opt['sid'])) {
    //   return error('请选择教师', 'sid')
    // }
    if (isNaN(opt['num']) || opt['num'].indexOf('.') >= 0 || opt['num'].indexOf('-') >= 0) {
      return error('请正确输入班级容量', 'num')
    }
    if (opt['num'] < 1) {
      return error('班级容量太小', 'num')
    }
    return code('验证成功', 1, opt)
  }
  // 编辑学生详情
  eduStudentEdit(opt) {
    if (is_null(opt['name'])) {
      return error('请输入宝宝姓名', 'name')
    }
    if (is_null(opt['gender'])) {
      return error('请选择宝宝性别', 'gender')
    }
    if (is_null(opt['birthday'])) {
      return error('请选择宝宝生日', 'birthday')
    }
    return code('验证成功', 1, opt)
  }
  // 食材订单提交
  foodAdd(opt) {
    if (is_null(opt['name'])) {
      return error('请输入联系人', 'name')
    }
    if (is_null(opt['tel'])) {
      return error('请输入联系方式', 'tel')
    }
    if (is_null(opt['addr'])) {
      return error('请输入联系地址', 'addr')
    }
    if (is_phone(opt['tel'])) {
      return error('请输入正确的手机号', 'tel')
    }
    return code('验证成功', 1, opt)
  }
}

// eslint-disable-next-line new-cap
export default new validate()

function code(err, code = 0, data = {}) {
  return { code, err, data: JSON.parse(JSON.stringify(data)) }
}

function is_null(str) {
  return str === '' || (str + '').split(' ').join('') === ''
}

function is_undefined(bool) {
  return bool === undefined || bool === ''
}

function is_email(str) {
  let p = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  // let p = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
  return !p.test(str)
}

function is_array(arr) {
  return Array.isArray(arr) && arr.length > 0
}

function is_phone(num = '') {
  if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(num))) {
    return 1
  }
  return 0
}

function is_length(val, min = 6, max = 18) {
  val = (val + '').split('')
  max = max < min ? min : max
  if (val.length < min) {
    return 1
  }
  if (val.length > max) {
    return 2
  }
  return 0
}

function error(err, name = '') {
  return code(err, 0, { name })
}
