<template>
  <div class="index_notice_detail">
    <v-tool-title></v-tool-title>
    <h2 class="title">{{ detail.title }}</h2>
    <div class="tool flex">
      <span v-if="detail.name">
        <van-icon name="manager-o" />
        {{ detail.name }}
      </span>
      <span>
        <van-icon name="underway-o" />
        {{ appTimeout(detail.time) }}
      </span>
    </div>
    <div class="content app_frame_content"
         style="white-space: pre-wrap"
         v-html="detail.content"></div>
    <div class="images flex fw">
      <div class="ava"
           v-for="(i, j) in detail.imgs"
           :key="j + '-i'"
           @click="appShowImage(detail.imgs, j, 'img')">
        <van-image :src="i.img"></van-image>
      </div>
    </div>
    <van-button v-if="detail.is_sign > 0 && !detail.sign"
                size="small"
                type="primary"
                @click="write = true">签名</van-button>
    <div v-if="detail.sign">
      <h5>我的签名</h5>
      <van-image :src="detail.sign"
                 class="sign"></van-image>
    </div>
    <transition name="van-slide-left">
      <div class="app_show_fixed top"
           style="z-index: 580"
           v-if="write">
        <v-tool-title text="签名"
                      back
                      @on-back="write = false"></v-tool-title>
        <div class="views">
          <v-h @on-save="onSave"></v-h>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import vH from "com/hand/hand.vue";
export default {
  data() {
    return {
      detail: {},
      write: false,
    };
  },
  components: { vH },
  inject: ["appTimeout", "appShowImage"],
  methods: {
    onSave(e) {
      this.$demo.es6().imageCompress(e, {}, (res) => {
        this.$api.upload({ imgs: res.small, type: "img" }, (rej) => {
          this.$api.http(
            "noticeWrite",
            { sign: rej.data.halfway, notice_id: this.detail.id },
            () => {
              this.$model.info("添加成功", 1);
              this.write = false;
              this.init();
            }
          );
        });
      });
    },
    init() {
      let params = this.$route.params;
      this.$api.http("noticeDetail", { notice_id: params.id }, (e) => {
        this.detail = e;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.index_notice_detail {
  overflow-y: scroll;
  padding: 8px;

  .sign {
    height: 200px;
  }

  .title {
    font-weight: 700;
    padding: 10px 0;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .tool {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;

    .van-icon {
      vertical-align: middle;
    }

    span+span {
      margin-left: 20px;
    }
  }

  .content {
    padding: 8px 0;
  }

  .images {
    .ava {
      width: 100px;
      height: 100px;
      margin: 0 10px 10px 0;
      border-radius: 5px;
      overflow: hidden;
    }
  }
}</style>
