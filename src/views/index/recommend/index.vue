<template>
  <div class="recommend">
    <v-tool-title>
      <!-- <span @click="onShare">
        <van-icon name="share" size="20" class="col_green" />
      </span> -->
    </v-tool-title>
    <div class="pub_page">
      <div class="banner van-hairline--bottom">
        <van-image :src="url"></van-image>
      </div>
      <div class="app_frame_content" v-html="det"></div>
      <div v-if="ls" class="ls">
        <h6 class="van-hairline--bottom">邀请好友列表</h6>
        <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onFriend">
          <van-empty description="暂无邀请记录" v-if="!item.length" />
          <section
            v-for="(i, j) in item"
            :key="j + '-s'"
            class="van-hairline--bottom flex"
          >
            <div class="ava">
              <van-image :src="i.headimgurl" fit="cover" round></van-image>
            </div>
            <div class="text">
              <p class="name">{{ i.nickname }}</p>
              <p class="time">加入时间：{{ appTimeout(i.create_time) }}</p>
            </div>
            <div class="val">
              +<b>{{ i.integral }}</b
              >积分
            </div>
          </section>
        </v-tool-page>
        <div class="foot flex">
          <van-button :color="theme.bgc" @click="appPath('/recommend_shop')"
            >积分兑换</van-button
          >
          <div class="g van-ellipsis">我的积分：{{ grade }}</div>
          <van-button
            :color="theme.linear"
            @click="appPath('/recommend_detail')"
            >兑换记录</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      det: "",
      url: "",
      ls: false,
      grade: 0,
      item: [],
      pageOpen: 0,
      pageEnd: false,
      theme: {},
    };
  },
  methods: {
    onShare() {
      // eslint-disable-next-line
      let user = demo.$session.get("user", {});
      // this.$model.info("请打开右上角选择发送给朋友", 2);
      let link = user.code
        ? ["/wx/share/?id=", user.n_id, "&c=", user.code]
        : ["/parent/?id=", this.$demo.$local.get("nid")];
      this.$vx({
        name: "推荐有礼",
        desc: "快来，我发现一个实用的幼儿园管理平台",
        link: window.location.origin + link.join(""),
      });
    },
    onFriend(e) {
      this.$api.http("recommendFriend", { page: e, limit: 20 }, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r.list;
          return 0;
        }
        this.item = this.item.concat(r.list);
        this.pageEnd = r.list.length !== 20;
      });
    },
  },
  inject: ["appIsLogin", "appGetTheme", "appTimeout", "appPath"],
  mounted() {
    this.url = this.$js.def.icon.grade.icon;
    this.$api.http("recommend", {}, (e) => {
      this.det = e;
    });
    this.theme = this.appGetTheme();
    this.appIsLogin(
      (e) => {
        this.ls = true;
        this.grade = e.integral;
        this.onFriend(1);
      },
      () => {}
    );
    this.$nextTick(() => {
      this.onShare();
    });
  },
};
</script>
<style lang='less' scoped>
.recommend {
  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 44px;
    width: 100%;
    background-color: #fff;
    .g {
      flex: 1;
      font-size: 14px;
      text-align: center;
      font-weight: 650;
      line-height: 44px;
    }
  }
  .pub_page {
    overflow-y: scroll;
    .banner {
      padding: 15px;
      height: 145px;
      margin: 0 auto;
    }
    .ls {
      padding-bottom: 55px;
      section {
        padding: 10px;
        font-size: 14px;
        position: relative;
        .ava {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        .text {
          width: calc(1005 - 50px);
          line-height: 25px;
          .time {
            font-size: 12px;
            color: #999;
            line-height: 1;
          }
        }
        .val {
          position: absolute;
          right: 10px;
          top: 10px;
          b {
            font-weight: 650;
            padding: 0 2px;
            font-size: 18px;
          }
        }
      }
    }
    h6 {
      font-size: 14px;
      padding: 10px 15px;
    }
  }
}
</style>
