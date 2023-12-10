<template>
  <div class="pub_page">
    <v-tool-scroll
      :ids="id"
      down
      :finishDown="downEnd"
      @prev="refreshPage"
      up
      :finishUp="upEnd"
      @next="nextPage"
      :nulls="nulls"
    >
      <slot />
    </v-tool-scroll>
  </div>
</template>

<script>
export default {
  props: {
    open: { type: Number, default: 0 },
    end: { type: Boolean, default: false },
  },
  data() {
    return {
      id: "",
      page: 1,
      downEnd: 0,
      upEnd: 0,
      nulls: false,
    };
  },
  watch: {
    open() {
      this.downEnd++;
      this.upEnd++;
    },
    end(n) {
      this.nulls = n;
    },
  },
  methods: {
    refreshPage() {
      this.page = 1;
      this.init();
    },
    nextPage() {
      this.page++;
      this.init();
    },
    init() {
      this.$emit("on-page", this.page);
    },
  },
  mounted() {
    this.$demo.scroll_num++;
    this.id = this.$route.name + "-" + this.$demo.scroll_num;
  },
};
</script>
<style lang='less' scoped>
.pub_page {
  height: 100%;
}
</style>
