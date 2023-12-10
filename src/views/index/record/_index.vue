<template>
  <div class="record">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无记录" v-if="!item.length" />
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        class="van-hairline--bottom"
      >
        <h5 class="flex" @click="onDetail(i, j)">
          <b>{{ i.record_date }}</b>
          <van-icon name="arrow" color="#999" />
        </h5>
        <transition name="moveleft">
          <v-t :ext="i" name="baby" text="here" v-if="i.check">
            <h6></h6>
            <p><van-rate :value="3" count="3" size="15" />良好</p>
            <p><van-rate :value="2" count="3" size="15" />达标</p>
            <p><van-rate :value="1" count="3" size="15" />一般</p>
          </v-t>
        </transition>
      </section>
    </v-tool-page>
  </div>
</template>

<script>
import vT from "./1.vue";
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      time: "",
    };
  },
  components: { vT },
  methods: {
    onDetail(i, j) {
      let f = !i.check;
      this.item = this.item.map((s) => {
        s.check = false;
        return s;
      });
      this.item[j].check = f;
    },
    onPage(e) {
      this.$api.http("record", { page: e, limit: 20, date: this.time }, (r) => {
        this.pageOpen++;
        r = r.map((s) => {
          s.check = false;
          return s;
        });
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.record {
  section {
    padding: 5px 0;
    h5 {
      padding: 10px;
      font-size: 15px;
      font-weight: 650;
      b {
        flex: 1;
      }
    }
  }
}
</style>
