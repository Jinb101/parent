
import XRadius from "./packages/radius/index.js";
import XHeader from './packages/header/index.js'
import XLine from "./packages/line/index.js";
import XContent from "./packages/content/index.js";
import XBox from "./packages/box/index.js";

const components = [
  XRadius, XHeader, XLine, XContent, XBox
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  // Vue.prototype.$loading = Loading.service;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '0.0.1',
  install,
  XRadius,
  XHeader,
  XLine,
  XContent,
  XBox
}
