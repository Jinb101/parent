<template>
  <div class="chant_send">
    <div class="m van-hairline--bottom">
      <van-field
        v-model="message"
        rows="4"
        autosize
        type="textarea"
        maxlength="600"
        placeholder="请输入内容"
        show-word-limit
      />
    </div>
    <div class="video">
      <h6>添加视频(横屏拍摄效果佳!)</h6>
      <v-u type="video" @path="onVideo"></v-u>
    </div>
    <div class="radio">
      <van-radio-group v-model="radio" direction="horizontal">
        <van-radio name="1">宝宝打卡</van-radio>
        <van-radio name="2">家长打卡</van-radio>
      </van-radio-group>
    </div>
    <div class="send">
      <van-button type="info" block round @click="onSub">打卡</van-button>
    </div>
  </div>
</template>

<script>
import vU from "../public/upload.vue";
export default {
  props: {
    value: null,
  },
  components: { vU },
  data() {
    return {
      message: "",
      video: "",
      radio: "",
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    ext: {
      handler(e) {
        this.$emit("input", e);
      },
      deep: true,
    },
  },
  methods: {
    onVideo(e) {
      this.video = e.path;
    },
    onSub() {
      let o = {
        ...this.ext,
        video: this.video,
        content: this.message || "",
        type: this.radio,
      };
      this.$api.http("a2023042604", o, (r) => {
        this.$toast("打卡成功");
        this.$emit("end");
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.radio = this.ext.type + "";
  },
};
</script>
<style lang='less' scoped>
.chant_send {
  padding: 15px;
  font-size: 16px;
  overflow-y: scroll;
  h6:not(.h1) {
    color: #999;
    font-size: 14px;
    margin-bottom: 8px;
  }
  h6 {
    padding: 5px 0;
  }
  .send {
    padding: 35px;
  }
  .radio {
    padding: 20px 0;
    font-size: 15px;
  }
}
</style>
