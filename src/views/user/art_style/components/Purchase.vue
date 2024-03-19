<template>
    <v-page ref="page" @on-page="onPage">
      <!-- <van-skeleton title avatar :row="3" :loading="true">
        <div>实际内容</div>
      </van-skeleton> -->
    </v-page>
</template>

<script >
export default {
  props: {
    isInfo: false
  },
data() {
return {
  list: [],
};
},
watch: {
  'props.isInfo': function(v, o) {
    if (v) {
      this.onPage(1)
      this.$emit('init')
    }
  }
},
methods: {
  onPage(page, f) {
    console.log(f);
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.list = [];
      }
      this.$api.http("cardRec", { page, limit: 20 }, (e) => {
        console.log(e);
        this.list = this.list.concat(e.list);
        this.$refs.page.onFinish(e.list.length < 20);
      });
    },
},
mounted: {}
};
</script>

<style scoped ></style>
