<template>
  <div
    class='better_scroll'
    :id="ids"
    :ref="ids+'-Dom'"
    :class="theme"
  >
    <div
      class="content"
      :ref="ids+'-Content'"
      :class="[{'content_x':xs},styls]"
      :style="xs?'width:'+width:''"
    >
      <span
        class="down_loading"
        v-if="down && loading.down"
        :ref="ids+'-prev'"
        :style="'color:'+loadingColor"
      >
        <van-loading type="spinner" />
      </span>
      <slot></slot>
      <span
        class="null_loading"
        v-if="nulls"
        :style="'color:'+loadingColor"
      >
        {{nullText}}
      </span>
      <span
        class="up_loading"
        v-else-if="up && loading.up"
        :ref="ids+'-next'"
        :style="'color:'+loadingColor"
      >
        <van-loading type="spinner" />
      </span>
    </div>
    <transition name="fade">
      <span
        class="fixed_show_page"
        v-if="pageShow && pageShow.show && showPage"
      >
        <b>{{pageShow.page}}</b>/<b>{{pageShow.total}}</b>
      </span>
    </transition>
    <transition name="fade">
      <span
        v-if="toTop && showTop"
        class="fixed_show_top"
        @click.stop="top_click"
      >
        <van-icon name="arrow" />
      </span>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */

// import BScroll from "better-scroll";
export default {
  props: {
    // 默认 ID
    ids: {
      type: String,
      default: "better-scroll-" + Math.floor(Math.random() * 100000),
    },
    // 快速滚动
    to: {
      type: Object,
      default: () => {
        return { x: 0, y: 0, rand: 0 };
      },
    },
    // 下拉刷新
    down: { type: Boolean, default: false },
    // 上拉刷新
    up: { type: Boolean, default: false },
    // 下拉完成
    finishDown: { type: Number, default: 0 },
    // 上拉完成
    finishUp: { type: Number, default: 0 },
    // theme 主题
    theme: { type: String, default: "" },
    // content 样式
    styls: { type: String, default: "" },
    // content 宽度
    width: { type: String, default: "" },
    // 禁用/启用状态
    disable: { type: Boolean, default: false },
    // 是否显示滚动条
    bar: { type: Boolean, default: true },
    // 没有数据
    nulls: { type: Boolean, default: false },
    // 没有数据显示文本
    nullText: { type: String, default: "这已经是底线了" },
    // 数显 (分页)
    pageShow: {
      type: Object,
      default: () => {
        return { show: false, page: 1, total: 1, rand: 0 };
      },
    },
    // 快速返回到顶部
    toTop: { type: Boolean, default: false },
    // loading颜色
    loadingColor: { type: String, default: "#999" },
    // refresh
    refresh: { type: Number, default: 0 },
    // x轴
    xs: { type: Boolean, default: false },
    // y轴
    ys: { type: Boolean, default: true },
    // 返回数据
    tag: { type: String, default: "" },
  },
  components: {},
  data() {
    return {
      scroll: null,
      dom: null,
      contentDom: null,
      loading: {
        down: false,
        up: false,
      },
      xy: { x: 0, y: 0 },
      y: 0,
      showPage: false,
      showTop: false,
    };
  },
  // 监控data中的数据变化
  watch: {
    finishDown(n) {
      if (this.down && n > 0) {
        this.s_down();
      }
    },
    finishUp(n) {
      if (this.up && n > 0) {
        this.s_up();
      }
    },
    to: {
      handler(n) {
        if (this.scroll) {
          this.scroll.scrollTo(n.x, n.y, 500);
        }
      },
      deep: true,
    },
    disable(n) {
      if (n) {
        this.s_stop();
      } else {
        this.s_run();
      }
    },
    y(n) {
      if (n !== 0) {
        n = n > 0 ? 0 : n;
        this.scroll.scrollTo(0, n, 500);
        this.scroll.refresh();
      }
    },
    pageShow: {
      handler(n) {
        this.checkPageText(n);
      },
      deep: true,
    },
    toTop(n) {
      this.showTop = n;
    },
    xy: {
      handler(n) {
        this.checkTopShow(n);
      },
      deep: true,
    },
    refresh(n) {
      if (n > 0 && this.scroll) {
        this.scroll.refresh();
      }
    },
  },
  // 方法集合
  methods: {
    checkTopShow(n) {
      this.showTop = false;
      if (n.y * -1 > 100 && this.toTop) {
        this.$nextTick(() => {
          this.showTop = n;
        });
      }
    },
    // 检测是否加载分页显示
    checkPageText(n) {
      this.showPage = false;
      if (n.show) {
        this.showPage = true;
        setTimeout(() => {
          this.showPage = false;
        }, 1200);
      }
    },
    // 点击回到顶部
    top_click() {
      this.scroll.scrollTo(0, 0, 500);
      this.$nextTick(() => {
        this.$emit("top");
        this.showTop = false;
      });
    },
    // 滚动开始之前
    _before(e) {
      // console.log("scroll before");
    },
    // 滚动开始时
    _start(e) {
      // console.log("scroll start");
    },
    // 滚动过程中
    _scroll(e) {
      this.xy = e;
      this.$emit("run", e);
    },
    // 滚动被取消
    _close(e) {
      // console.log("scroll close");
    },
    // 滚动结束
    _end(e) {
      let height = (this.contentDom.clientHeight - this.dom.clientHeight) * -1;
      if (this.up && this.loading.up) {
        if (height < this.y) {
          this.y = height;
        }
      }
      if (this.down && this.loading.down) {
        this.y = this.$refs[this.ids + "-prev"].clientHeight;
      }
      this.checkTopShow(this.xy);
    },
    // 鼠标/手指离开
    _blur(e) {
      if (this.down && this.loading.down && this.xy.y < this.y) {
        this.xy.y = this.y;
      }
    },
    // 轻拂时
    _focus(e) {
      // console.log("scroll focus");
    },
    // refresh 方法调用完成后
    _finish(e) {
      // console.log("scroll finish");
    },
    // 下拉刷新 // 用于 第一页重新加载
    _down(e) {
      this.loading.down = true;
      this.$emit("prev");
    },
    // 上拉刷新 // 用于分页
    _up(e) {
      if (this.nulls) {
        this.s_up();
        return 0;
      }
      this.loading.up = true;
      this.$emit("next");
    },
    // 初始化加载
    start() {
      if (this.scroll === null) {
        this.scroll = new BScroll("#" + this.ids, {
          scrollX: this.xs,
          scrollY: this.ys,
          bounce: true,
          click: true,
          mouseWheel: true,
          probeType: 1,
          pullDownRefresh: this.down,
          pullUpLoad: this.up,
          scrollbar: this.bar,
          preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|P)$/,
          },
        });
        this.dom = this.$refs[this.ids + "-Dom"];
        this.contentDom = this.$refs[this.ids + "-Content"];
        // 滚动开始之前
        this.scroll.on("beforeScrollStart", (e) => {
          this._before(e);
        });
        // 滚动开始时
        this.scroll.on("scrollStart", (e) => {
          this._start(e);
        });
        // 滚动过程中
        this.scroll.on("scroll", (e) => {
          this._scroll(e);
        });
        // 滚动被取消
        this.scroll.on("scrollCancel", (e) => {
          this._close(e);
        });
        // 滚动结束
        this.scroll.on("scrollEnd", (e) => {
          this._end(e);
        });
        // 鼠标/手指离开
        this.scroll.on("touchEnd", (e) => {
          this._blur(e);
        });
        // 轻拂时
        this.scroll.on("flick", (e) => {
          this._focus(e);
        });
        // refresh 方法调用完成后
        this.scroll.on("refresh", (e) => {
          this._finish(e);
        });
        // 下拉刷新 // 用于 第一页重新加载
        this.scroll.on("pullingDown", (e) => {
          this._down(e);
        });
        // 上拉刷新 // 用于分页
        this.scroll.on("pullingUp", (e) => {
          this._up(e);
        });
        this.$emit("created", { data: this.tag, scroll: this.scroll });
      } else {
        this.scrollContent.refresh();
      }
    },
    // 下拉完成
    s_down() {
      if (this.scroll) {
        this.scroll.finishPullDown();
        this.loading.down = false;
        this.$nextTick(() => {
          this.scroll.refresh();
          // this.scroll.scrollTo(0, 0, 300);
        });
      }
    },
    // 上拉完成
    s_up() {
      if (this.scroll) {
        this.scroll.finishPullUp();
        this.loading.up = false;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    // 滚动到指定位置
    s_to() {
      if (this.scroll) {
        let time = this.to.y === 0 ? 20 : 500;
        this.scroll.scrollTo(this.to.x, this.to.y, time);
      }
    },
    // 股东到指定dom
    s_toDom(el) {
      if (this.scroll) {
        this.scroll.scrollToElement(el, 500);
      }
    },
    // 重启滚动
    s_run() {
      if (this.scroll) {
        this.scroll.enable();
      }
    },
    // 暂停滚动
    s_stop() {
      if (this.scroll) {
        this.scroll.disable();
      }
    },
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$nextTick(() => {
      this.start();
    });
  },
  destroyed() {
    if (this.scroll) {
      this.scroll.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
@bs: 1px;
.better_scroll {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  &.select .content {
    user-select: text !important;
  }
  .content {
    min-height: 100%;
  }
  .content_x {
    height: 100%;
    width: auto;
  }
  .loading_scroll {
    color: #fff;
    font-size: 30 / @bs;
    height: 40 / @bs;
    line-height: 40 / @bs;
    text-align: center;
    display: block;
    b {
      font-size: 12 / @bs;
      color: #999;
      vertical-align: top;
      padding-left: 10 / @bs;
    }
  }
  .down_loading,
  .up_loading,
  .null_loading {
    text-align: center;
    font-size: 30 / @bs;
    padding: 10 / @bs 0;
    display: block;
  }
  .null_loading {
    font-size: 15 / @bs;
    color: #999;
  }
  .fixed_show_page {
    position: absolute;
    bottom: 10 / @bs;
    left: 0;
    right: 0;
    height: 20 / @bs;
    line-height: 20 / @bs;
    font-size: 15 / @bs;
    color: #eee;
    margin: auto;
    border-radius: 40%;
    background-color: fade(#222, 30%);
    text-align: center;
    width: 50 / @bs;
  }
  .fixed_show_top {
    position: absolute;
    bottom: 10 / @bs;
    right: 10 / @bs;
    background-color: fade(#222, 30%);
    width: 30 / @bs;
    height: 30 / @bs;
    line-height: 30 / @bs;
    text-align: center;
    color: #eee;
    border-radius: 30%;
    transform: rotate(-90deg);
    cursor: pointer;
  }
}
</style>
