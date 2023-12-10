<template>
  <div class="work_class_child">
    <v-tool-title></v-tool-title>
    <v-line title="基本信息">
      <van-field
        v-model="detail.child.name"
        label="宝宝姓名"
        colon
        input-align="right"
        required
        placeholder="请输入宝宝姓名"
        maxlength="12"
      />
      <van-field
        v-model="detail.child.en_name"
        label="英文名"
        colon
        input-align="right"
        placeholder="请输入宝宝英文名"
        maxlength="12"
      />
      <van-field
        v-model="detail.child.hobby"
        label="兴趣爱好"
        colon
        input-align="right"
        placeholder="请输入宝宝兴趣爱好"
        maxlength="50"
      />
      <van-field label="性别" colon readonly required>
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.child.gender"
          >
            <van-radio :name="1">男</van-radio>
            <van-radio :name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="detail.child.birthday"
        label="出生日期"
        colon
        input-align="right"
        placeholder="请选择宝宝出生日期"
        readonly
        required
        @click="onSelectTime('birthday', 'child')"
      />
      <van-field
        v-model="address.now"
        label="现住址"
        colon
        input-align="right"
        placeholder="请选择现住址"
        readonly
        @click="onSelectData('city')"
      />
      <van-field
        v-model="detail.child.now_detail"
        label="详细地址"
        colon
        input-align="right"
        placeholder="请输入详细地址"
        maxlength="125"
      />
      <van-field
        v-model="detail.child.id_card"
        label="证件号码"
        colon
        input-align="right"
        placeholder="请输入证件号码"
        maxlength="20"
        required
      />
      <van-field
        v-model="address.nation"
        label="国籍"
        colon
        input-align="right"
        placeholder="请选择国籍"
        readonly
        @click="onSelectData('nation')"
      />
      <van-field
        v-model="detail.child.religion"
        label="宗教"
        colon
        input-align="right"
        placeholder="请填写宗教"
        maxlength="20"
      />
      <van-field
        v-model="detail.child.ethnic"
        label="民族"
        colon
        input-align="right"
        placeholder="请填写民族"
        maxlength="20"
      />
      <van-field
        v-model="detail.baby_files.enrollment_data"
        label="入园日期"
        colon
        input-align="right"
        placeholder="请选择入园日期"
        readonly
        @click="onSelectTime('enrollment_data', 'baby_files')"
      />
      <van-field
        v-model="address.blood"
        label="血型"
        colon
        input-align="right"
        placeholder="请选择血型"
        readonly
        @click="onSelectData('blood')"
      />
    </v-line>
    <v-line title="健康信息">
      <van-field
        v-model="detail.baby_files.height"
        label="身高/cm"
        colon
        input-align="right"
        placeholder="请输入身高"
        type="number"
        required
      />
      <van-field
        v-model="detail.baby_files.weight"
        label="体重/kg"
        colon
        input-align="right"
        placeholder="请输入体重"
        type="number"
        required
      />
      <van-field
        label="是否独生子女"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.only_child_or_not"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label="有无高热惊厥史"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.febrile_convulsion_history"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label="是否残疾幼儿"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.disabled_or_not"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label="有无先天性疾病"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.congenital_disability_history"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label="有无过敏史(过敏源)"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.allergic_history"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </v-line>
    <v-line
      title="家庭成员信息"
      add
      @on-add="onAddItems('baby_family_members', 'familyData')"
    >
      <section
        v-for="(i, j) in detail.baby_family_members"
        :key="j + '-a1'"
        class="a1"
      >
        <van-field
          v-model="i.members_name"
          label="姓名"
          colon
          placeholder="请输入姓名"
          maxlength="12"
        >
          <template #button>
            <van-button
              size="mini"
              color="tomato"
              icon="cross"
              @click="onDelItems(j, 'baby_family_members')"
            ></van-button>
          </template>
        </van-field>
        <van-field
          v-model="i.filiation"
          label="关系"
          colon
          placeholder="请输入与宝宝关系"
          maxlength="12"
        />
        <van-field
          v-model="i.degrees"
          label="学历"
          colon
          placeholder="请选择学历"
          readonly
          @click="onSelectData('degrees', j)"
        />
        <van-field
          v-model="i.id_card_no"
          label="身份证号码"
          colon
          placeholder="请输入身份证号码"
          maxlength="20"
        />
        <van-field
          v-model="i.number"
          label="联系方式"
          colon
          placeholder="请输入联系方式"
          maxlength="20"
          type="tel"
        />
        <van-field
          v-model="i.employer"
          label="工作单位"
          colon
          placeholder="请输入工作单位"
          maxlength="125"
          type="textarea"
          rows="2"
          autosize
        />
      </section>
    </v-line>
    <v-line
      title="接送人"
      add
      @on-add="onAddItems('baby_transfer_person', 'transferData')"
    >
      <section
        v-for="(i, j) in detail.baby_transfer_person"
        :key="j + '-a2'"
        class="a2"
      >
        <van-field
          v-model="i.pick_up_person"
          label="姓名"
          colon
          placeholder="请输入姓名"
          maxlength="12"
        >
          <template #button>
            <van-button
              size="mini"
              color="tomato"
              icon="cross"
              @click="onDelItems(j, 'baby_transfer_person')"
            ></van-button>
          </template>
        </van-field>
        <van-field
          v-model="i.id_type"
          label="证件类型"
          colon
          placeholder="请输入证件类型"
          maxlength="12"
        />
        <van-field
          v-model="i.id_no"
          label="证件号码"
          colon
          placeholder="请输入证件号码"
          maxlength="20"
        />
        <van-field
          v-model="i.contact_number"
          label="联系方式"
          colon
          placeholder="请输入联系方式"
          maxlength="20"
          type="tel"
        />
        <van-field
          v-model="i.relationship"
          label="与幼儿关系"
          colon
          placeholder="请输入与幼儿关系"
          maxlength="25"
        />
      </section>
    </v-line>
    <v-line title="附件">
      <van-field
        label="户口本(户主)"
        colon
        readonly
        required
        label-width="10em"
      />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.householders"
          type="householder"
          tips
        ></v-image>
      </section>
      <van-field
        label="户口宝宝页"
        colon
        readonly
        required
        label-width="10em"
      />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.hukou_babys"
          type="hukou_baby"
          tips
        ></v-image>
      </section>
      <van-field label="户口(爸爸页)" colon readonly label-width="10em" />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.dad_pages"
          type="dad_page"
          tips
        ></v-image>
      </section>
      <van-field label="户口(妈妈页)" colon readonly label-width="10em" />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.mom_pages"
          type="mom_page"
          tips
        ></v-image>
      </section>
      <van-field label="接种本" colon readonly required label-width="10em" />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.inoculums"
          type="inoculum"
          tips
        ></v-image>
      </section>
      <van-field label="家庭合影" colon readonly label-width="10em" />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.familys"
          type="family"
          tips
        ></v-image>
      </section>
    </v-line>
    <v-line title="其他档案">
      <van-field label="添加档案" colon readonly label-width="10em" />
      <section class="img">
        <v-image
          @path="onPath"
          :ext="detail.dangan_imgs"
          type="dangan_img"
          tips
        ></v-image>
      </section>
    </v-line>
    <div class="send">
      <van-button block round :color="theme.linear" @click="onSub"
        >保存</van-button
      >
    </div>
    <v-p
      :open="pop.open"
      :title="pop.title"
      :keys="pop.key"
      :item="pop.item"
      @on-change="onPopupChange"
    ></v-p>
    <v-p type="date" :open="times.open">
      <v-t @on-close="times.open = 0" @on-change="onTimeChange"></v-t>
    </v-p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vLine from "./_line.vue";
import vImage from "../../private/image.vue";
import det from "./def";
import vP from "../../private/popup.vue";
import vT from "../../private/time.vue";
import vU from "../../public/upload.vue";
export default {
  props: {
    childData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      id: "",
      detail: det({}),
      value: "",
      theme: {},
      city: [],
      nation: [],
      pop: {
        open: 0,
        title: "",
        key: "",
        item: [],
      },
      selectType: "",
      address: {
        now: "",
        nation: "",
        blood: "",
      },
      degreesIndex: 0,
      times: { open: 0, v: "", k: "" },
      arrears: false,
      arrears2: false,
      arrearsItem: [],
      urge: {
        time: "",
        amount: "",
        id: "",
      },
      payItem: [],
      class: [],
      division: {
        gid: "",
        cid: "",
        g: "",
        c: "",
      },
    };
  },
  components: { vLine, vImage, vP, vT, vU },
  computed: {
    ...mapState({ vuex_share: "share" }),
  },
  watch: {
    childData: {
      handler(n) {
        switch (n.type) {
          case "work_class_grade":
            this.class = [];
            this.division.g = n.data.name;
            this.division.gid = n.data.id;
            this.division.c = "";
            this.division.cid = "";
            break;
          case "work_class_class":
            this.division.c = n.data.name;
            this.division.cid = n.data.id;
            break;
          default:
        }
      },
      deep: true,
    },
  },
  inject: [
    "appShare",
    "appGetTheme",
    "appBack",
    "appPath",
    "appTimeout",
    "appOpenPopup",
  ],
  methods: {
    onSelectTime(v, k) {
      this.times = {
        v,
        k,
        open: Date.now(),
      };
    },
    onTimeChange(e) {
      if (this.times.v === "time") {
        this.urge.time = e.time.replace(/\//g, "-");
        return 0;
      }
      this.detail[this.times.k][this.times.v] = e.time.replace(/\//g, "-");
    },
    onAddItems(i, j) {
      this.detail[i].push(this.detail[j]);
    },
    onPopupChange(e) {
      switch (this.selectType) {
        case "city":
          e.ids = this.$api.city(e.index);
          this.address.now = e.data.join("");
          this.detail.child.now_province = e.ids[0];
          this.detail.child.now_city = e.ids[1];
          this.detail.child.now_area = e.ids[2];
          break;
        case "nation":
          this.address.nation = e.data.name_chinese;
          this.child.nation = e.data.country_id;
          break;
        case "blood":
          this.address.blood = e.data.n;
          this.detail.baby_files.blood_type = e.data.id;
          break;
        case "degrees":
          this.detail.baby_family_members[this.degreesIndex].degree =
            e.data.value;
          this.detail.baby_family_members[this.degreesIndex].degrees =
            e.data.name;
          break;
        default:
      }
      this.selectType = "";
    },
    onSelectData(type, index) {
      let t = "";
      let k = "n";
      let i = [];
      this.selectType = type;
      switch (type) {
        case "city":
          t = "选择现住址";
          i = this.city;
          break;
        case "nation":
          t = "选择国籍";
          i = this.nation;
          k = "name_chinese";
          break;
        case "blood":
          t = "选择血型";
          i = this.detail.blood;
          break;
        case "degrees":
          t = "选择学历";
          k = "name";
          i = this.detail.degrees;
          this.degreesIndex = index;
          break;
        default:
      }
      this.pop.title = t;
      this.pop.key = k;
      this.pop.item = i;
      this.pop.open++;
    },
    onPath(e, type) {
      let url = e
        .map((s) => {
          return s.path;
        })
        .join(",");
      if (type === "dangan_img") {
        this.detail.child[type] = url;
      } else {
        this.detail.baby_files[type] = url;
      }
    },
    onSub() {
      let det = this.$demo.copy(this.detail);
      let os = {
        id: det.id,
        child: det.child,
        baby_files: det.baby_files,
        baby_family_members: det.baby_family_members.map((s) => {
          delete s.degrees;
          return s;
        }),
        baby_transfer_person: det.baby_transfer_person,
      };
      this.$api.http("classesSetChild", os, () => {
        this.$model.info("编辑成功", 2);
      });
    },
    onceGetDetail() {
      this.$api.http("classesChildDetail", {}, (e) => {
        this.detail = det(e);
        this.address.now = this.$api.city(this.detail.addressId, "id").join("");
        // 国籍
        let nid = this.detail.child.nation;
        if (nid) {
          this.address.nation =
            (
              this.nation.filter((r) => {
                return r.country_id === +nid;
              })[0] || {}
            ).name_chinese || "";
        }
        // 血型
        let b = this.detail.baby_files.blood_type;
        if (b) {
          this.address.blood = (
            this.detail.blood.filter((s) => {
              return s.id === +b;
            })[0] || {}
          ).n;
        }
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.city = this.$api.city();
    // 获取国籍
    this.$api.http("getNational", {}, (s) => {
      this.nation = s;
      // 获取宝贝详情
      this.onceGetDetail();
    });
  },
};
</script>
<style lang='less' scoped>
.work_class_child {
  overflow-y: scroll;
  .arrears {
    background-color: #f5f5f5;
    overflow-y: scroll;
    section {
      font-size: 15px;
      padding: 15px;
      position: relative;
      background-color: #fff;
      padding-bottom: 45px;
      margin-bottom: 8px;
      p {
        line-height: 1.3;
        margin-bottom: 5px;
        color: #999;
        b {
          color: #333;
          font-weight: 650;
        }
      }
      .tool {
        position: absolute;
        height: 30px;
        line-height: 30px;
        color: #fff;
        right: 15px;
        bottom: 15px;
        span {
          padding: 0 15px;
          margin-left: 20px;
          border-radius: 5px;
        }
      }
    }
  }
  h4 {
    text-align: center;
    font-size: 15px;
    padding: 30px 0;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .image_logo {
    width: 220px;
    height: 220px;
    margin: 0 auto;
  }
  .pay {
    overflow-y: scroll;
    background-color: #f5f5f5;
    section {
      background-color: #fff;
      padding: 15px;
      font-size: 15px;
      p {
        color: #999;
        margin-bottom: 5px;
        b {
          color: #333;
          font-weight: 600;
        }
      }
    }
  }
  .img {
    padding: 8px;
  }
  .send {
    margin: 30px auto 60px;
    width: 60%;
  }
  .a1,
  .a2 {
    background: rgba(232, 252, 255, 0.5);
    &:nth-child(2n) {
      background: rgba(232, 255, 232, 0.5);
    }
    .van-cell {
      background: transparent;
    }
  }
}
</style>
