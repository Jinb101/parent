<template>
  <van-share-sheet
    v-model="showShare"
    :title="title"
    :options="options"
    @select="onSelect"
  />
</template>

<script>
export default {
  props: {
    title: { type: String, default: "立即分享给好友" },
    open: { type: Number, default: 0 },
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    keys: {
      type: Object,
      default: () => {
        return {};
      },
    },
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    open() {
      this.showShare = true;
    },
    item: {
      handler() {
        this.setItem();
      },
      deep: true,
    },
  },
  data() {
    return {
      showShare: false,
      options: [],
      k: { name: "name", icon: "icon" },
    };
  },
  inject: ["appObject"],
  methods: {
    onSelect(e) {
      let os = {
        type: this.ext.share_type,
        event: e.ext.title,
        title: this.title,
        item: this.options,
        id: this.ext.id,
        ext: this.ext,
      };
      this.showShare = false;
      this.$store.dispatch("setShare", os);
    },
    setItem() {
      let a = this.appObject({ i: this.item });
      let b = this.appObject(this.keys, this.k);
      let c = [];
      a.i.forEach((r) => {
        let o = {};
        o[b.name] = r[b.name];
        o[b.icon] = r[b.icon];
        o.ext = r;
        c.push(o);
      });
      this.options = c;
    },
  },
  mounted() {
    this.setItem();
  },
};
</script>
<style lang='less' scoped>
</style>
