// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import vueRouter from "vue-router";
import router from "./router";
import Title from "vue-wechat-title";
import store from "./store/index";
import {
  Icon,
  Lazyload,
  Image,
  Popup,
  Picker,
  ShareSheet,
  ImagePreview,
  Tabbar,
  TabbarItem,
  NoticeBar,
  Field,
  Grid,
  GridItem,
  NavBar,
  Empty,
  Swipe,
  SwipeItem,
  Loading,
  Collapse,
  CollapseItem,
  Button,
  Radio,
  RadioGroup,
  DatetimePicker,
  Checkbox,
  Tab,
  Tabs,
  Rate,
  Stepper,
  ActionSheet,
  Cell,
  Badge,
  Tag,
  Search,
  Divider,
  CellGroup,
  CheckboxGroup,
  PullRefresh,
  List,
  Switch,
  Popover,
  Progress,
  Circle,
  Form,
  Calendar
} from "vant";

import "amfe-flexible";
import "@vant/touch-emulator";
// import 'public/css/main.css'

import vToolScroll from "com/scroll/better_scroll.vue";
import vToolTitle from "./views/public/title.vue";
import vToolPage from "./views/public/page.vue";
import vView from "./views/newpublic/view.vue";
import vPage from "./views/newpublic/page.vue";
import vFixed from "./views/newpublic/fixed.vue";

import xj from "com/demo/index.js";
import $api from "public/api/api.js";
import $js from "public/js/const.js";
import $model from "public/js/model.js";
import $validate from "public/js/validate.js";
import $vx from "public/js/vx.js";
let version = window.demo.getUrlParam("id");
var demo = null;
let localName = "youeryuanweb" + version;
// eslint-disable-next-line
window.demo = demo = new Demo({
  name: localName,
  ajaxTimeout: 12e4,
  ajaxUploadTimeout: 9e5 + 1
});

window.demo.access("es6", demo.fn("demo_es6"));
window.demo.access("calculate", demo.fn("demo_calculate"));
window.demo.access("month", demo.fn("demo_month"));
window.demo.access("pwd", demo.fn("demo_pwd"));
window.demo.access("validate", demo.fn("demo_validate"));
window.demo.access("theme", demo.fn("demo_theme"));
window.demo.access("xj", demo.fn("demo_xj"));
window.demo.access("vx", demo.fn("demo_vx"));
window.demo.access("upload", demo.fn("demo_upload"));
// eslint-disable-next-line
// window.demo.access('$map', DemoAMap)
window.demo.access("scroll_num", 0);
window.demo.access("timer_editor", null);
window.demo.access("timer_user_mail", null);
window.demo.access("toBindWx", (id, path) => {
  return (
    $js.prefix +
    "/500/auth/index.html?type=web&id=" +
    id +
    "&url=" +
    encodeURIComponent($js.api.http) +
    "&local=" +
    localName +
    "&hash=" +
    path
  );
});

Vue.config.productionTip = false;
Vue.use(Title).use(xj);

if ($js.env) {
  Image.methods.onError = function(e) {
    try {
      e.target.src = $js.path + "static/image/theme/t4.png";
      console.log(e);
    } catch (err) {
      // console.log(err);
    }
  };
}

Vue.config.errorHandler = function(err, vm, info) {
  err.message.includes("handler.call is not a function");
};
// vant
Vue.use(Icon)
  .use(Lazyload)
  .use(Image)
  .use(Popup)
  .use(Picker)
  .use(ShareSheet)
  .use(ImagePreview)
  .use(Tabbar)
  .use(TabbarItem)
  .use(NoticeBar)
  .use(Field)
  .use(Grid)
  .use(GridItem)
  .use(NavBar)
  .use(Empty)
  .use(Swipe)
  .use(SwipeItem)
  .use(Loading)
  .use(Collapse)
  .use(CollapseItem)
  .use(Button)
  .use(Radio)
  .use(RadioGroup)
  .use(DatetimePicker)
  .use(Divider)
  .use(Checkbox)
  .use(Tab)
  .use(Tabs)
  .use(Rate)
  .use(Stepper)
  .use(ActionSheet)
  .use(Cell)
  .use(Badge)
  .use(Tag)
  .use(Search)
  .use(CellGroup)
  .use(CheckboxGroup)
  .use(PullRefresh)
  .use(List)
  .use(Switch)
  .use(Popover)
  .use(Progress)
  .use(Circle)
  .use(Form)
  .use(Calendar);

Vue.prototype.$demo = window.demo;
Vue.prototype.$api = $api;
Vue.prototype.$model = $model;
Vue.prototype.$validate = $validate;
Vue.prototype.$js = $js;
Vue.prototype.$vx = $vx;
Vue.prototype.$theme = window.demo
  .xj()
  .theme(window.demo.getUrl().theme || "orange");

Vue.component("vToolScroll", vToolScroll);
Vue.component("vToolTitle", vToolTitle);
Vue.component("vToolPage", vToolPage);
Vue.component("vView", vView);
Vue.component("vFixed", vFixed);
Vue.component("vPage", vPage);

const originalPush = vueRouter.prototype.push;
vueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};
const originalReplace = vueRouter.prototype.replace;
vueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch(err => err);
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
