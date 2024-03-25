import js from "./const";
import store from "../../store/index";
/* eslint-disable */
const vx = (data = {}, type = "share", flag) => {
  let demo = window.demo;
  if (wx) {
    let e = demo.$local.get("wxConfig", {});
    let a = demo.$local.get("appConfig", {});
    let v = a.nursery_ext || {};
    let debug = +demo.getUrlParam("wx");
    let os = Object.assign(
      {},
      {
        title: a.name,
        desc: a.desc || a.name,
        link: js.api.share + "?wxshare=1&" + window.location.href.split("?")[1],
        logo: a.logo,
        address: v.address,
        latitude: v.latitude,
        longitude: v.longitude,
        localization: v.localization
      },
      data
    );
    console.log(os, e.signature, "===", data);
    wx.config({
      debug: !!debug,
      appId: e.appId,
      timestamp: e.timestamp,
      nonceStr: e.nonceStr,
      signature: e.signature,
      jsApiList: [
        // 所有要调用的 API 都要加到这个列表中
        "updateAppMessageShareData",
        "updateTimelineShareData",
        "wxOpenLaunchWeapp",
        "uploadImage",
        "getLocation",
        "openLocation"
      ],
      openTagList: ["wx-open-launch-weapp"]
    });
    wx.error(function(res) {
      try {
        let t = res.errMsg;
        if (t.indexOf("config:invalid") >= 0) {
          console.log("重新请求微信配置", t);
        }
      } catch (err) {}
      console.log(res);
    });
    wx.ready(function() {
      if (flag) {
        store.dispatch("setShareWx", Date.now());
      }
      switch (type) {
        case "location":
          wx.openLocation({
            latitude: +os.latitude || 0, // 纬度，浮点数，范围为 90 ~ -90
            longitude: +os.longitude || 0, // 经度，浮点数，范围为 180 ~ -180。
            name: os.address || "", // 位置名
            address: os.localization || "", // 地址详情说明
            scale: 15 // 地图缩放级别，整形值，范围从 1~28。默认为最大
          });
          break;
        default:
          if (type === "reg") {
            let link = os.link.split("#")[0] || "";
            link = link.replace("c=", "v=");
            link += "&c=" + demo.$session.get("user", {}).salt;
            os.link = link;
          }
          wx.updateAppMessageShareData({
            title: os.title, // 分享标题
            desc: os.desc, // 分享描述
            link: os.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl: os.logo, // 分享图标
            success: function(r) {
              // 设置成功
              if (!!debug) {
                console.log(r, "success", "updateAppMessageShareData");
              }
            },
            trigger: function(r) {
              if (!!debug) {
                console.log(r, "trigger", "updateAppMessageShareData");
              }
            }
          });
          wx.updateTimelineShareData({
            title: os.title, // 分享标题
            link: os.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl: os.logo, // 分享图标
            success: function(r) {
              // 设置成功
              if (!!debug) {
                console.log(r, "success", "updateTimelineShareData");
              }
            },
            trigger: function(r) {
              if (!!debug) {
                console.log(r, "trigger", "updateTimelineShareData");
              }
            }
          });
      }
    });
  }
};

export default vx;
