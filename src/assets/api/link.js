// 不需要登陆可以访问的接口

const api = {
  config: "com/common/nursery_info", // 园所基本信息
  wx: "com/common/get_share", // 微信配置
  login: "parents/user/login", // 登录
  sms: "parents/user/SendSms", // 验证码
  resetPwd: "parents/user/ForgetPassword", // 重置密码
  checkSms: "parents/user/checkcode", // 验证验证码
  reg: "parents/user/register", // 注册
  banner: "parents/index/banner", // 轮播图
  cute: "parents/lovable/lovable", // 精彩瞬间
  cuteDetail: "parents/lovable/lovableDetails", // 精彩瞬间 详情
  info: "parents/index/information", // 园所资讯 / 教师风采
  infoDetail: "parents/index/informationDetails", // 园所资讯 / 教师风采 详情
  bannerDetail: "parents/index/banner_details", // 轮播图 详情
  gardenDetail: "parents/index/organization", // 园所简介
  gardenHonor: "parents/index/honour", // 园所荣誉
  foodGetDetail: "parents/recipes/latestRecipe", // 宝贝食谱
  foodHistory: "parents/recipes/historicalCookbook", // 历史食谱
  foodNewGetDetail: "parents/recipes/latest_recipe", // 宝贝食谱 [新]
  recommend: "parents/my/InvitationRules", // 推荐有礼
  signIn: "parents/index/enroll", // 报名参观
  isIndexOpen: "parents/index/parent_menu", // 是否开启主页功能
  agreeinfo: "parents/user/Protocol", // 用户协议
  getToken: "com/common/get_token",
  getopenid: "com/common/get_openid",
  a1130: "parents/user/acquireThePark" // 获取园所
};

// 需要登录访问的接口
const loginApi = {
  foodNewHistory: "parents/recipes/historical_recipes", // 历史食谱 [新]
  teachPlan: "parents/home_interactive/classPlan", // 教学计划
  notice: "parents/home_interactive/notice", // 通知
  noticeDetail: "parents/home_interactive/noticedetail", // 通知详情
  noticeWrite: "parents/home_interactive/notice_signature",
  cuteLike: "parents/lovable/likeCancelLike", // 点赞
  class: "com/common/GetClass", // 获取班级
  user: "com/common/getuser", // 用户信息
  bindBaby: "parents/my/Bind", // 绑定宝贝
  babyVideo: "parents/home_interactive/BabyOnline", // 宝贝在线
  babyVideoCheck: "parents/home_interactive/babyIsOff", // 宝贝在线是否开启
  babyVideoDetail: "parents/home_interactive/OnlineDetail", // 宝贝在线详情
  babywatch: "parents/baby_online/BabyViewingRecords", // 记录宝贝在线观看记录
  // babyWatchList: 'nursery/baby_online/WatchList', // 宝贝在线观看记录

  feedBack: "parents/home_interactive/feedback", // 调研表
  feedBackAdd: "parents/home_interactive/Submit", // 答题
  feedBackDetail: "parents/home_interactive/OnlineAnswer", // 答题详情
  attendance: "parents/home_interactive/attendance", // 宝宝考勤
  attendancePunch: "parents/home_interactive/attendanceRecord", // 宝宝打卡记录
  attendanceLeaveList: "parents/home_interactive/leaveRecord", // 我的请假记录
  attendanceLeave: "parents/home_interactive/leave", // 宝宝请假
  growthTask: "parents/develop/index", // 成长任务
  growthTaskDetail: "parents/develop/details", // 成长任务详情
  growTaskAdd: "parents/develop/answer", // 提交成长任务
  growIntegral: "parents/develop/integral", // 宝宝积分
  growIntegralDetail: "parents/develop/pointsRecord", // 宝宝积分详情
  growIntegralWin: "parents/develop/points_mall", // 宝宝积分奖励
  record: "parents/index/gardenRecord", // 在园记录
  recommendFriend: "parents/my/RecommendedScore", // 邀请好友
  recommendShopTab: "parents/integral_mall/classification", // 邀请积分商城栏目
  recommendShopList: "parents/integral_mall/goods_list", // 邀请积分商城列表
  recommendShopDetail: "parents/integral_mall/goods_details", // 详情
  recommendShopBuy: "parents/integral_mall/convertible_goods", // 购买
  recommendShopEx: "parents/integral_mall/exchange_details", // 兑换详情
  recommendShopExDel: "parents/integral_mall/exchange_delete", // 删除
  recommendExList: "parents/integral_mall/exchange_record", // 兑换记录
  getFaceConfig: "com/common/get_config", // 人脸配置

  classList: "parents/class_show/index", // 班级圈
  classGood: "parents/class_show/like", // 点赞
  classComment: "parents/class_show/comment", // 评论
  classDel: "parents/class_show/del_class_show", // 删除
  classCommentAll: "parents/class_show/moreComments", // 更多评论分页
  classAdd: "parents/class_show/publishclassshow", // 班级圈 - 发布
  classdet: "parents/class_show/Detail", // 班级圈详情
  delComment: "parents/class_show/delMyComment", // 班级圈详情

  storeTeach: "parents/story/index", // 老师讲故事
  storeList: "parents/routine/index", // 故事汇
  storeParent: "parents/parent_class/index", // 家长课堂
  storeTeachDetail: "parents/story/details", // 老师讲故事详情
  storeListDetail: "parents/routine/details", // 故事汇详情
  storeParentDetail: "parents/parent_class/catalog", // 家长课堂详情

  userBabyInfo: "parents/my/BabyInfo", // 宝贝信息
  userUpdateLogo: "parents/my/UploadAvatar", // 修改头像
  userUpdateNick: "parents/my/EditNickname", // 修改昵称
  userUpdatePhone: "parents/user/replacementPhone", // 修改手机号
  userUnBindBaby: "parents/my/unBind", // 解绑
  userInviteAdd: "parents/my/inviteguardian", // 邀请监护人
  userGetAvatar: "parents/my/getBaseMap", // 获取考勤图
  userSetAvatar: "parents/my/parentAttendanceChart", // 设置考勤图

  payGetBabyVip: "parents/my/payment", // 宝贝在线续费列表
  paySetBabyVip: "parents/My/submitOrder", // 下单购买
  payGetBabyVip2: "parents/baby_online/BabyOnlinePaymentService",

  getNational: "com/common/getCountry", // 国籍
  classesChildDetail: "parents/baby_information/baby_information", // 宝宝详情
  classesSetChild: "parents/baby_information/edit_baby_information", // 完善宝贝信息

  payWaitList: "parents/Charge/chargeItem", // 待缴费
  payListRecord: "parents/Charge/chargeRecord", // 缴费记录
  payPlaceOrder: "parents/Charge/chargePlaceOrder", // 下单
  payNewDetail: "parents/Charge/paymentItem", // 新生缴费详情
  payNewSend: "parents/Charge/freshman_payment", // 新生缴费
  payDetail: "parents/Charge/query_order", // 查询缴费订单
  payDot: "parents/charge/PaymentRedDot", // 缴费小红点
  payVor: "parents/charge/payment_voucher", // 凭证

  drugsList: "parents/medication/index", // 喂药列表
  drugsAdd: "parents/medication/create", // 添加喂药
  drugsDetail: "parents/medication/details", // 喂药详情
  drugsDel: "parents/medication/delete", // 删除喂药记录

  schoolPhoto: "parents/semester_album/index", // 学期相册
  schoolclassadd: "parents/semester_album/classCircleoinAlbum", // 班级圈加入相册【新】
  schoolPhotoadd: "parents/semester_album/createAlbum", // 添加【新】
  schoolPhotodel: "parents/semester_album/delete_album", // 删除【新】

  shopIfy: "parents/foods/index/classification", // 食材分类
  shopfood: "parents/foods/index/index", // 商品列表
  shopfood2: "parents/foods/index/garden_goods", // 园所商品
  shopfoods: "parents/foods/index/product_details", // 商品详情
  shopbuyadd: "parents/foods/cart/add_cart", // 加入购物车
  shopbuy: "parents/foods/cart/get_cart", // 购物车
  shopbuyset: "parents/foods/cart/modify_shopping_cart", // 修改购物车
  shoporder: "parents/foods/order/get_cart", // 确认订单
  shoporderset: "parents/foods/order/order_goods", // 商品下单
  shoporderpay: "parents/foods/order/payment_order", // 订单支付

  help: "parents/problem/index",
  helpDetail: "parents/problem/details",
  helptype: "parents/problem/getClassify",
  helplist: "parents/problem/tabulation",

  supid: "parents/recipes/get_suppliers",
  setOpenid: "com/common/setOpenid",

  bindacc: "parents/my/bindBabyAccount", // 绑定账号

  poster: "parents/poster/index", // 海报详情
  postermy: "parents/poster/MyRegistrationInformation",

  eduify: "parents/home_education/classification", // 家庭教育指导站 分类
  edulist: "parents/home_education/index", // 课程列表
  edudet: "parents/home_education/details", // 课程详情
  // edumenu: 'parents/home_education/catalogue', // 课程目录
  eduvtime: "parents/home_education/setViewingRecords", // 记录视频观看时长
  edugtime: "parents/home_education/getLastViewingTime", // 获取上次观看时长
  edushare: "parents/home_education/retransmission", // 分享转发看
  eduorder: "parents/home_education/placeOrder", // 下订单
  edupay: "parents/home_education/payment", // 支付
  eduorderstatus: "parents/home_education/orderStatus", // 订单状态
  eduorderlist: "parents/home_education/order", // 订单列表
  eduorderdet: "parents/home_education/orderDetails", // 订单详情
  edusubmit: "parents/home_education/confirmReceipt", // 确认收货
  educancel: "parents/home_education/cancelOrder", // 取消订单

  address: "parents/address/index", // 收货地址
  addressadd: "parents/address/addAddress", // 添加/修改
  addressdel: "parents/address/deleteAddress", // 删除
  addressset: "parents/address/defaultAddress", // 设置默认
  addressget: "parents/address/getDefaultAddress", // 获取默认

  newmenulevel: "parents/common/ServiceManagement", // 新权限

  a2023030801: "parents/take_notes/personalList", // 家园联系列表
  a2023030802: "parents/take_notes/park_details", // 家园联系详情
  a2023030803: "parents/take_notes/parent_signature", // 提交

  a2023031801: "parents/semester_album/GetPosters", // 相册海报

  a2023041401: "parents/evaluation/evaluationData", // 宝宝测评 获取
  a2023041402: "parents/evaluation/evaluationScore", // 宝宝测评 提交
  a2023041403: "parents/evaluation/evaluationRecords", // 宝宝测评 获取记录
  a2023041404: "parents/evaluation/latestRecord", // 宝宝测评 获取详情

  a2023042601: "parents/v2_country_study/getClassify", // 经典吟诵 分类
  a2023042602: "parents/v2_country_study/index", // 经典吟诵 列表
  a2023042603: "parents/v2_country_study/details", // 经典吟诵 详情
  a2023042604: "parents/v2_country_study/clockIn", // 经典吟诵 打卡
  a2023042605: "parents/v2_country_study/clockInList", // 经典吟诵 打卡列表
  a2023042606: "parents/v2_country_study/ClockInDetails", // 经典吟诵 打卡详情
  a2023042607: "parents/v2_country_study/moreComments", // 经典吟诵 更多评论
  a2023042608: "parents/v2_country_study/DeleteClockIn", // 经典吟诵 删除打卡
  a2023042609: "parents/v2_country_study/CheckInAndLike", // 经典吟诵 点赞
  a2023042610: "parents/v2_country_study/comment", // 经典吟诵 评论
  a2023042611: "parents/v2_country_study/ActivationCode", // 激活码

  a2023051901: "parents/montessori/index", // 列表 家园联系册 板 1
  a2023051902: "parents/montessori/details", // 详情 家园联系册 板 1
  a2023051903: "parents/montessori/share", // 分享 家园联系册 板 1
  a2023051904: "parents/montessori/CheckInAndLike", // 点赞 家园联系册 板 1
  a2023051905: "parents/montessori/comment", // 评论 家园联系册 板 1
  a2023051906: "parents/montessori/moreComments", // 获取评论 家园联系册 板 1
  a2023051907: "parents/montessori/getHomeContactBook", // 模板类型
  a2023051908: "parents/montessori/unread", // 小红点

  a2023052301: "parents/vote/index", // 投票列表
  a2023052302: "parents/vote/EventDetails", // 投票详情
  a2023052303: "parents/vote/ActiveUsers", // 投票人
  a2023052304: "parents/vote/WorkDetails", // 详情
  a2023052305: "parents/vote/ballot", // 投票
  a2023052306: "parents/vote/endBroadcasting", // 完播率
  a2023052307: "parents/vote/comment", // 评论
  a2023052308: "parents/vote/getComments", // 评论列表

  // 艺体
  // 我的积分
  userPoints: "parents/eurhythmics/MyArtAndSportsPoints",
  // 购买记录
  cardRec: "parents/eurhythmics/CardPurchaseRecords",
  // 宝宝列表
  babyList: "parents/my/bindBabyAccount",
  // 技能列表
  skitList: "parents/eurhythmics/skill",
  // 向日葵艺体充值
  payFee: "parents/eurhythmics/payFee",
  // 向日葵艺体充值
  payOrder: "parents/eurhythmics/payParentsOrder",
  // 公众号 二维码
  getOffCode: "parents/common/getOfficialQrCode"
};

export default {
  api,
  loginApi
};
