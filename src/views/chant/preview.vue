<template>
  <div class="chant_preview">
    <iframe
      :src="ext"
      frameborder="0"
      class="db_image"
      allowtransparency="true"
      allowfullscreen="true"
    ></iframe>
    <template v-if="ext">
      <slot />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {};
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
    ext(v) {
      this.$emit("input", v);
    },
  },
  methods: {},
  mounted() {
    this.ext = this.value;
  },
};
</script>
<style lang='less' scoped>
.chant_preview {
  height: 100%;
  overflow: hidden;
}
</style>
