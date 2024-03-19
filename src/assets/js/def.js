let env = process.env.NODE_ENV === "development";
let path = env ? "../../../" : "./";

let b = (name, f) => {
  return path + "static/image/bar/" + (f ? name + "_active" : name) + ".png";
};
let c = (name, title, num = 0, icon, obj = {}) => {
  icon = icon || name;
  return { name, title, num, icon: b(icon), icons: b(icon, 1), ...obj };
};
let c2 = (name, title, num = 0, icon) => {
  icon = icon || name;
  return {
    name,
    title,
    num,
    icon: path + "static/image/icon/" + icon + ".png"
  };
};
let c4 = (name, title, icon) => {
  icon = icon || name;
  return {
    name,
    title,
    icon: path + "static/image/theme/" + icon + ".png"
  };
};
let c5 = (name, title, url = "", level = 0, num = 0, w = "user") => {
  return {
    name,
    title,
    num,
    icon: path + "static/image/" + w + "/" + name + ".png",
    level,
    url
  };
};

let c7 = (name, title, url = "", level = 0, num = 0) => {
  return c5(name, title, url, level, num, "index");
};
let c8 = (title, name, url, level = 0, color = "") => {
  return {
    title,
    icon: path + "static/image/user/" + name + ".png",
    url,
    level,
    color,
    num: 0
  };
};
let c9 = (name, title, url, level, type, obj = {}) => {
  return { ...c7(name, title, url, level), type, ...obj };
};

// eslint-disable-next-line
let siteicon = siteConfig().icon;
let u1 = (text, path, icon, level = 0, num = 0) => {
  return {
    text,
    path,
    icon: siteicon(icon, "index"),
    num,
    square: true,
    default: true,
    theme: 5,
    level
  };
};

// 底部 tabbar
let tabbar = [
  c("home", "首页"),
  c("class", "班级圈"),
  c("education", "家庭教育", 0, "listen"),
  c("listen", "听故事"),
  c("user", "我的")
];

// 首页二级入口
let indexRoute = [
  c9("6000", "通知", "/notice", 1, 1),
  c9("6001", "园所风采", "/garden", 0, 2),
  // c9('6002', '教师风采', '/teach', 0, 3),
  c9("6003", "宝贝在线", "/baby_video", 2, 4, { menulevel: 1007 }),
  c9("6004", "调研表", "/survey", 2, 5),
  c9("6005", "班级课表", "/teach_plan", 2, 6),
  c9("6006", "食谱", "/food", 0, 7),
  c9("6007", "宝宝考勤", "/attendance", 2, 8),
  c9("6008", "成长管理", "/growth", 2, 9),
  c9("6009", "家园联系", "/record", 2, 10),
  c9("brief", "招生动态", "/poster", 0, 13),
  c9("6010", "转发有礼", "/recommend", 0, 11),
  // c9('sign', '预约参观', '/visit'),
  c9("a", "智能相册", "/album", 2, 12, { menulevel: 1004 }),
  c9("6014", "学国学", "/chant", 2, 14, { menulevel: 1009 }),
  c9("6015", "投票", "/vote", 2, 15)
  // c9("6016", "艺体中心", "/art_style", 2, 16)
  // c9('6013', '家园联系 2', '/record1', 2, 14),
].map(s => {
  s.text = s.title;
  return s;
});

let growth = [
  c7("a1", "成长任务", "/growth_task"),
  c7("a2", "宝宝积分", "/growth_integral"),
  c7("a3", "积分商城", "/growth_shop")
];

let users = [
  c8("完善宝贝信息", 1, "/user_baby", 4),
  c8("喂药管理", 2, "/drugs", 5),
  c8("缴费", 3, "/pay", 3),
  c8("邀请其他监护人", 4, "/user_invite", 1),
  c8("宝贝在线续费", 5, "/pay_renew", 2),
  c8("家长扫脸样图", 6, "/user_info_avatar", 5, ["#ff5301", "#f8b477"])
].map(s => {
  s.color = s.color || "#e5e5e5";
  s.square = s.default = true;
  s.text = s.title;
  s.theme = 5;
  return s;
});

let user2 = [
  u1("完善宝贝信息", "/user_baby", 7001, 1),
  u1("喂药管理", "/drugs", 102, 2),
  u1("缴费", "/pay", 406, 3),
  u1("邀请其他监护人", "/user_invite", 7010, 4),
  u1("宝贝在线续费", "/pay_renew", 7003, 5),
  u1("家长扫脸样图", "/user_info_avatar", 7009, 6),
  u1("切换宝宝", "to:baby", 7015, 7),
  u1("食材小店", "to:food", 8, 8),
  u1("家庭教育订单", "/educationorder", 7006, 9),
  u1("用户手册", "/help", 509, 10),
  u1("微信绑定", "/wx_bind", 516, 11),
  u1("收货地址", "/address", 7012, 12),
  u1("用户协议", "/lib_agree", 7011, 13),
  u1("招生动态", "/poster", 301, 14),
  u1("转发有礼", "/recommend", 7014, 15),
  u1("宝贝测评", "/evaluate", 7016, 16),
  u1("投票", "/vote", 7020, 15),
  u1("艺体中心", "/art_style", 7025, 17)
];

let chant = [
  u1("吟诵音频", "1", 7022),
  u1("吟诵视频", "2", 510),
  u1("朗读音频", "3", 7022)
  // u1('示范课视频', '3', 7021),
];

// share
let shareIcon = {
  delete: c2("删除", "delete", 0, "share_delete"),
  detail: c2("查看详情", "detail", 0, "share_detail"),
  copy: { name: "复制链接", icon: "link", title: "copy" },
  share: { name: "微信", icon: "wechat", title: "share" },
  edit: c2("编辑", "edit", 0, "share_edit"),
  comment: c2("评论", "comment", 0, "share_comment"),
  shield: c2("屏蔽", "shield", 0, "share_shield"),
  unshield: c2("取消屏蔽", "unshield", 0, "share_shield"),
  good: c2("点赞", "good", 0, "share_good"),
  ungood: c2("取消点赞", "ungood", 0, "share_ungood"),
  class_atten: c2("出勤记录", "atten", 0, "share_atten"),
  class_arrears: c2("欠费记录", "arrears", 0, "share_arrears"),
  class_out: c2("退学", "out", 0, "share_win"),
  class_win: c2("毕业", "win", 0, "share_win"),
  class_division: c2("分班", "division", 0, "share_division"),
  class_transfer: c2("转班", "transfer", 0, "share_transfer"),
  class_payment: c2("缴费明细", "payment", 0, "share_payment"),
  class_logo: c2("考勤图", "logo", 0, "share_logo"),
  down: c2("下载", "down", 0, "down"),
  joinphoto: c2("加入相册", "joinphoto", 0, "down")
};

// 主题
let theme = {
  t2: c4("t2", "默认"),
  t3: c4("t3", "不规则图形"),
  t4: c4("t4", "渐变"),
  t5: c4("t5", "渐变二"),
  t6: c4("t6", "渐变三"),
  t7: c4("t7", "小山"),
  t8: c4("t8", "草地")
};

let icon = {
  send: c2("发布", "", 0, "send"),
  boy: c2("男孩", "", 0, "boy"),
  girl: c2("女孩", "", 0, "girl"),
  end: c2("end", "", 0, "icon_end"),
  grade: c2("grade", "", 0, "grade"),
  wx: c2("wx", "", 0, "share_wx"),
  like: c2("like", "", 0, "x_like"),
  msg: c2("msg", "", 0, "x_msg")
};

let upload = {
  excel: c2("excel", "", 0, "ico_excel"),
  word: c2("word", "", 0, "ico_word"),
  pdf: c2("pdf", "", 0, "ico_pdf"),
  video: c2("video", "", 0, "ico_video")
};

let uploadAccept = {
  video: { accept: { type: "other", accept: "video/*" }, type: "video" },
  img: {},
  pdf: {
    accept: { type: "other", accept: "application/pdf,.pdf" },
    type: "pdf"
  },
  word: {
    accept: {
      type: "other",
      accept:
        "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    type: "pdf"
  },
  excel: {
    accept: {
      type: "other",
      accept:
        "application/msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    type: "pdf"
  }
};

let types = {
  atten: [
    // 出勤类型
    { name: "事假", id: 1 },
    { name: "病假", id: 2 },
    { name: "其他", id: 3 }
  ],
  theme: [
    // 环创集
    { text: "点赞量倒序", v: "1" },
    { text: "点赞量正序", v: "2" },
    { text: "浏览量倒序", v: "3" },
    { text: "浏览量正序", v: "4" },
    { text: "发布时间倒序", v: "5" },
    { text: "发布时间正序", v: "6" }
  ]
};

// 9-2 秋
// 3-8 春
// eslint-disable-next-line
let t = demo.timeout("", "array");
let semester = {
  year: t[0],
  semester: t[1] >= 9 || t[1] <= 2 ? 2 : 1
};

export default {
  tabbar,
  indexRoute,
  shareIcon,
  icon,
  upload,
  uploadAccept,
  theme,
  types,
  growth,
  users,
  user2,
  semester,
  chant
};
