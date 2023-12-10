<template>
  <div class="det">
    <div class="header flex">
      <div class="cover">
        <img :src="covrimg" class="db_image" alt="" style="object-fit: cover" />
      </div>
      <div class="logo">
        <v-a :src="child.base_map" :sex="child.gender === '男' ? 1 : 2"></v-a>
      </div>
      <div class="text">
        <h2>
          {{ child.name }} <b>{{ [child.gender, child.age].join(" ") }}</b>
        </h2>
        <p>
          {{ child.class_name }}
          <van-tag type="primary" size="large"
            >家长{{ +det.state === 1 ? "未" : "已" }}读</van-tag
          >
        </p>
      </div>
    </div>
    <div class="box">
      <h6>工作内容</h6>
      <p v-html="det.work"></p>
      <div class="tag bgc_green">{{ det.library_title }}</div>
      <h6>观察时间</h6>
      <p>{{ appTimeout(det.observation_time) }}</p>
    </div>
    <div class="box">
      <h6>工作目的</h6>
      <p v-html="tohtml(det.purpose)"></p>
      <h6>工作时间</h6>
      <div class="canvas flex">
        <div class="l">
          <van-circle
            v-model="canvaspeeed"
            :rate="canvasnum"
            :speed="100"
            :text="canvastext"
            :stroke-width="80"
            layer-color="#ccc"
          />
        </div>
        <div class="r">
          <p><span></span>总计(工作时间)：{{ det.working_hours }}分钟</p>
          <p><span class="c"></span>专注时间：{{ det.focus_time }}分钟</p>
        </div>
      </div>
      <h6>工作情况</h6>
      <p v-html="tohtml(det.work_situation)"></p>
      <div class="images" v-if="image.length">
        <div
          class="image"
          v-for="(x, y) in image"
          :key="y"
          @click="appShowImage(image, y, 'urls')"
        >
          <van-image :src="x.urls"></van-image>
        </div>
      </div>
      <div class="videos">
        <div class="video" v-for="(x, y) in video" :key="y + '-2'">
          <iframe
            :src="tovideosrc(x.urls)"
            class="db_image"
            frameborder="0"
            allowfullscreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
          ></iframe>
        </div>
      </div>
      <h6>工作描述</h6>
      <p v-html="tohtml(det.description)"></p>
      <h6>建议采取行动</h6>
      <p v-html="tohtml(det.suggest_action)"></p>
      <div class="c_time van-hairline--top">
        发表于 <b>{{ appTimeout(det.create_time) }}</b>
      </div>
    </div>
    <div class="box tool_box flex">
      <div class="btn_like" @click="onsaveshare">
        <van-icon name="wechat" color="#1ee3b6" />
        <p>{{ det.shares }}</p>
      </div>
      <div class="btn_like" @click="onsavelike">
        <img :src="icons(+det.like_or_not === 1 ? 202 : 201)" alt="" />
        <p>{{ det.like_count }}</p>
      </div>
    </div>
    <div class="box" v-if="det.observe_id">
      <van-divider>目前共{{ det.comments }}条评论</van-divider>
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <ul>
          <li
            v-for="(i, j) in item"
            :key="j"
            class="flex van-hairline--bottom"
            @click.stop="oncomments(i)"
          >
            <div class="logo">
              <v-a :src="i.avatar" teacher></v-a>
            </div>
            <div class="text">
              <h3>{{ i.name || "家长" }}</h3>
              <p>
                {{ i.to_name ? ["回复", i.to_name, "："].join("") : "" }}
                <b v-html="i.comment"></b>
              </p>
            </div>
          </li>
        </ul>
      </v-page>
    </div>
    <div class="bottom_top"></div>
    <div class="bottom" v-if="det.observe_id && uncomment">
      <v-c v-model="msg" @change="onsavecomment"></v-c>
    </div>
  </div>
</template>

<script>
import vA from "../../../newpublic/avatar.vue";
import vC from "../../../class/comment.vue";
export default {
  props: {
    value: null,
    uncomment: Boolean,
  },
  data() {
    return {
      msg: "",
      item: [],
      // eslint-disable-next-line
      covrimg: siteConfig().icon("banner1", "player"),
      canvasnum: 0,
      canvaspeeed: 0,
      obj: {},
    };
  },
  inject: ["appTimeout", "appShowImage"],
  components: { vA, vC },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    child() {
      return this.ext.child || {};
    },
    det() {
      return this.ext.observe || {};
    },
    video() {
      let a = this.det.working_moments || [];
      return a.filter((r) => {
        return +r.type !== 1;
      });
    },
    image() {
      let a = this.det.working_moments || [];
      return a.filter((r) => {
        return +r.type === 1;
      });
    },
    canvastext() {
      return this.canvasnum.toFixed(2) + "%";
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onsaveshare() {
      this.$api.http("a2023051903", { observe_id: this.det.observe_id }, () => {
        this.ext.observe.shares += 1;
      });
      // 分享
      this.$emit("share", this.det);
    },
    oncomments(e) {
      this.obj = {
        parent_id: e.parent_id,
        r_id: e.r_id,
      };
      this.msg = "回复" + e.name + ":";
    },
    onsavelike() {
      let s = +this.det.like_or_not === 1 ? 2 : 1;
      this.$api.http(
        "a2023051904",
        {
          observe_id: this.det.observe_id,
          status: s,
          open_id: "",
        },
        () => {
          this.ext.observe.like_or_not = s;
          this.ext.observe.like_count =
            s === 1
              ? this.ext.observe.like_count + 1
              : this.ext.observe.like_count - 1;
        }
      );
    },
    onsavecomment(e) {
      if (!e) {
        return this.$toast("请输入评论");
      }
      this.$api.http(
        "a2023051905",
        {
          observe_id: this.det.observe_id,
          comment: e,
          parent_id: this.obj.parent_id || 0,
          r_id: this.obj.r_id || 0,
          reply_client: 2,
        },
        (v) => {
          this.msg = "";
          this.item.unshift(v);
          this.ext.observe.comments += 1;
          this.cobj = {};
        }
      );
    },
    icons(num) {
      // eslint-disable-next-line
      return siteConfig().icon(num, "parent");
    },
    tohtml(e) {
      let str = JSON.stringify(e) + "";
      str = str.replace('"', "");
      str = str.substr(0, str.length - 1);
      return str.replace(/\\n/g, "<br>");
    },
    tovideosrc(src) {
      // eslint-disable-next-line
      return this.$js.api.h5 + "h5/player/?url=" + src;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "a2023051906",
        {
          page,
          observe_id: this.det.observe_id,
        },
        (e) => {
          this.item = e;
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.ext = this.value;
    this.$nextTick(() => {
      let s = (this.det.focus_time / this.det.working_hours) * 100;
      this.canvasnum = s > 100 ? 100 : +s.toFixed(2);
    });
  },
};
</script>
<style lang='less' scoped>
.det {
  .header {
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    color: #fff;
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: #38f;
    }
    .logo,
    .text {
      position: relative;
      z-index: 5;
    }
    .text {
      width: calc(100% - 50px);
      box-sizing: border-box;
      padding: 5px 10px;
      h2 {
        font-weight: 650;
        font-size: 16px;
        padding: 5px 0;
        b {
          padding-left: 5px;
          font-size: 14px;
          font-weight: 400;
        }
      }
      p {
        font-size: 14px;
      }
    }
  }
  .box {
    padding: 20px 15px 10px;
    background-color: #fff;
    margin-bottom: 10px;
    font-size: 14px;
    h6 {
      font-size: 15px;
      font-weight: 650;
      margin-bottom: 10px;
    }
    > p {
      color: #999;
      padding-bottom: 10px;
      line-height: 1.8;
    }
    .c_time {
      color: #999;
      padding: 10px 0 0;
    }
    .tag {
      padding: 5px 10px;
      color: #fff;
      display: inline-block;
      margin-bottom: 10px;
    }
  }
  .images,
  .videos {
    margin-bottom: 10px;
  }
  .video {
    height: 195px;
    width: 100%;
    background-color: #222;
    overflow: hidden;
    border-radius: 5px;
    color: #fff;
    & + .video {
      margin-top: 10px;
    }
  }
  .canvas {
    padding: 10px 0;
    height: 160px;
    align-items: center;
    .l {
      flex: 1;
      text-align: center;
    }
    .r {
      line-height: 20px;
      font-size: 14px;
      padding-left: 30px;
      span {
        display: inline-block;
        vertical-align: middle;
        width: 22px;
        height: 11px;
        border-radius: 5px;
        margin-right: 4px;
        background-color: #ccc;
        &.c {
          background-color: #1989fa;
        }
      }
      p + p {
        margin-top: 5px;
      }
    }
  }
  .tool_box {
    // align-items: center;
    justify-content: center;
  }
  .btn_like {
    width: 60px;
    height: 60px;
    // margin: 0 auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 12px;
    box-sizing: border-box;
    color: #666;
    background-color: #f8f7fa;
    font-weight: 650;
    img {
      width: 25px;
      height: 25px;
      display: block;
      margin-bottom: 5px;
    }
    .van-icon {
      font-size: 25px;
    }
    & + .btn_like {
      margin-left: 15px;
    }
  }
  .bottom_top {
    height: 100px;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px 0 10px;
    background: #fff;
    z-index: 99;
  }
  li {
    padding: 10px 0;
    position: relative;
    .logo {
      width: 50px;
      margin-right: 10px;
      height: 50px;
    }
    .text {
      width: calc(100% - 60px);
      h3 {
        font-weight: 650;
        padding: 5px 0;
      }
      p {
        color: #999;
      }
    }
  }
}
</style>
