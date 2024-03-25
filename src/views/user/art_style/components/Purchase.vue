<template>
  <v-page ref="page"
          @on-page="onPage">
    <div v-for="item in list"
         :key="item.order_id"
         class="item">
      <div>宝宝名称：{{ item.child.name }}</div>
      <div>父母名称：{{ item.nickname }}</div>
      <div>手机号码：{{ item.phone }}</div>
      <div>支付时间：{{ time(item.pay_time) }}</div>
      <div>订单号：&nbsp;&nbsp;&nbsp;&nbsp;{{ item.order_sn }}</div>
    </div>
  </v-page>
</template>

<script>
export default {
  props: {
    isInfo: false
  },
  data() {
    return {
      list: [],
      isArt: false
    };
  },
  watch: {
    'props.isInfo': function (v, o) {
      if (v) {
        this.onPage(1)
        this.$emit('init')
      }
    }
  },
  methods: {
    // s 时间戳 转换 时间
    // s 时间戳 转换 时间
    time(t) {
      // 10 位时间戳 转换 年月日 - 时分秒
      let date = new Date(t * 1000); // JavaScript 时间戳是以毫秒为单位的，所以需要乘以 1000
      return date.toLocaleString(); // 返回格式化的日期和时间
    },
    onPage(page, f) {
      console.log(this.isArt, 'this.isArt');
      if (this.isArt) {
        this.list = [];
        this.$refs.page.onFinish(true);
        return
      }
      console.log(f);
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.list = [];
      }
      this.$api.http("cardRec", { page, limit: 20 }, (e) => {
        this.list = this.list.concat(e.list);
        this.$refs.page.onFinish(e.list.length < 20);
      });
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const isArtStyle = demo.$local.get("isArtStyle", null)
    if (isArtStyle) {
      this.isArt = true
    }
    // 查看 URL 中 是否拥有 参数 n_id 和 source
    let url = window.location.href;
    let hasNId = this.hasParameter(url, 'n_id');
    let hasSource = this.hasParameter(url, 'source');
    if (hasNId) {
      // eslint-disable-next-line no-undef
      demo.$local.set('nid', hasNId)
    } else if (hasSource) {
      this.isArt = true
      // this.showDarn = true
    }
    // console.log('Has n_id:', hasNId);
    // console.log('Has source:', hasSource);
  }
};
</script>

<style lang="less">
.item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: rgb(128, 128, 128);
}

.item div {
  margin: 5px 0;
}

.van-tab__pane {
  overflow-y: auto !important;
}
</style>
