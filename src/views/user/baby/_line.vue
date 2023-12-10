<template>
  <div class="work_class_line">
    <h6 v-if="title">
      <i :style="bgc"></i>
      <b>{{ title }}</b>
      <span v-if="add" class="col_green" @click="onAdd">新增</span>
    </h6>
    <div class="views">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    add: { type: Boolean, default: false },
  },
  inject: ["appGetTheme"],
  data() {
    return {
      theme: {},
    };
  },
  computed: {
    bgc() {
      return { background: this.theme.linear };
    },
  },
  methods: {
    onAdd() {
      this.$emit("on-add");
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang='less' scoped>
.work_class_line {
  font-size: 15px;
  h6 {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-weight: 650;
    i {
      left: 14px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 2px;
      height: 10px;
      position: absolute;
    }
    span {
      position: absolute;
      right: 15px;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .views {
    padding: 5px 0 15px;
    position: relative;
  }
}
</style>
