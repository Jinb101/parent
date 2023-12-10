<template>
  <div class="menu_tab" :class="[dire, { small: small }]">
    <section
      v-for="(i, j) in item"
      :key="j"
      @click="type = i.id"
      :class="{ active: +type === i.id }"
    >
      <img :src="icons(+type === i.id)" alt="" />
      <p>{{ i.name }}</p>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    icon: {
      type: Array,
      default: () => {
        return [500, 501];
      },
    },
    dire: { type: String, default: "y" },
    value: null,
    small: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    type: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    type(v) {
      this.$emit("input", v);
    },
  },
  methods: {
    icons(flag) {
      let name = this.icon[flag ? 1 : 0];
      // eslint-disable-next-line
      return siteConfig().icon(name, "parent");
    },
  },
  mounted() {
    this.type = this.value;
  },
};
</script>
<style lang='less' scoped>
.menu_tab {
  section {
    font-size: 15px;
    position: relative;
    text-align: center;
    color: #666;
    transition: all 0.3s;
    cursor: pointer;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 56;
      transition: all 0.3s;
    }
    p {
      z-index: 57;
      position: relative;
    }
    &.active {
      color: #222;
    }
  }
  &.x section {
    flex: 1;
    padding: 13px 10px;
    margin: 0 5px;
    &.active {
      color: #fff;
    }
  }
  &.y section {
    padding: 20px 10px 15px;
    margin-bottom: 5px;
    border-radius: 0 20px 20px 0;
  }
  &.small {
    font-size: 14px;
    section {
      padding: 8px 0;
      img {
        width: 110%;
        transform: translateX(-5%);
      }
    }
  }
}
</style>
