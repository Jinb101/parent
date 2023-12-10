<template>
  <div class="garden_vr">
    <iframe :src="url" frameborder="0" class="view"></iframe>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.view {
  height: calc(100vh - 90px);
  display: block;
  width: 100%;
}
</style>
