
demo.access('params', demo.getUrl())
demo.access('es6', demo_es6)
demo.js('.app_foot .views').style({ background: 'url(./image/foot.png) no-repeat left/cover' })
demo.access('$vue', () => {
  let view = () => {
    let s = `<div class="app_view_box" :id="ids" :class="{readonly:readonly}">
            <div class="cover"></div>
            <div class="header" v-if="title">{{title}}</div>
            <div class="views"><slot /></div>
        </div>`
    return {
      props: {
        title: { type: String, default: '' },
        ids: { type: String, default: 'view-1' },
        readonly: { type: Boolean, default: false }
      },
      template: s,
      data() {
        return {}
      },
      mounted() {
        if (this.title) {
          demo.js('#' + this.ids + ' .header').style({ background: 'url(./image/header.png) no-repeat left/cover' })
        }
      },
    }
  }
  let btn = () => {
    let s = `<div class="app_view_line">
                <h3 v-if="title">{{title}}</h3>
                <section v-for="(i,j) in list" :key="j+'-s'">
                    <h4 v-if="i.title">{{i.title}}</h4>
                    <div class="check flex fw" v-if="i.children && i.children.length">
                        <div class="app_check_btn" @click="onActive(j,y)" :class="{active:x.active}" v-for="(x,y) in i.children" :key="y+'-c-'+j" :data-value="x.value">{{x.title}}</div>
                        <div class="app_check_btn input" v-if="i.add && !readonly">
                            <input type="text" placeholder="可输入" v-model="i.search" @input="onAdd($event,j)" @blur="onBlur">
                        </div>
                    </div>
                </section>
            </div>`
    return {
      props: {
        title: { type: String, default: '' },
        item: {
          type: Array, default: () => {
            return []
          }
        },
        readonly: { type: Boolean, default: false }
      },
      template: s,
      data() {
        return {
          list: [],
          timer: null,
          timer2: null,
          index: -1
        }
      },
      watch: {
        item: { handler() { this.init() }, deep: true },
        list: {
          handler(n) {
            this.save(() => {
              this.$emit('change', n)
            })
          }, deep: true
        }
      },
      methods: {
        save(fn) {
          if (this.timer2) {
            clearTimeout(this.timer2)
            this.timer2 = null
          }
          this.timer2 = setTimeout(() => {
            fn()
            clearTimeout(this.timer2)
            this.timer2 = null
          }, 500)
        },
        onBlur() {
          this.$nextTick(() => {
            if (this.index >= 0) {
              this.list[this.index].search = ''
              let arr = this.list[this.index].children.map(s => {
                delete s.is_add
                return s
              })
              this.$set(this.list[this.index], 'children', arr)
            }
          })
        },
        onAdd(e, a) {
          this.index = a
          this.onEvent(() => {
            let val = this.list[this.index].search
            let arr = this.list[this.index].children.map(s => {
              s.active = false
              return s
            })
            let v = arr.filter(r => r.is_add)
            if (v.length) {
              arr = arr.map(s => {
                s.title = s.is_add ? val : s.title
                s.active = s.is_add ? true : false
                return s
              })
            } else {
              arr.push({ is_add: true, title: val, active: true, value: arr.length })
            }
            this.$set(this.list[this.index], 'value', val)
            this.$set(this.list[this.index], 'children', arr)
          })
        },
        onEvent(fn) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            fn()
            clearTimeout(this.timer)
            this.timer = null
          }, 500)
        },
        onActive(a, b) {
          let val = this.list[a]
          let active = val.children[b].active
          if (active) return 0
          this.$set(this.list[a], 'children', this.list[a].children.map(s => {
            s.active = false
            return s
          }))
          this.$set(this.list[a].children[b], 'active', true)
          this.$set(this.list[a], 'value', this.list[a].children[b].title)
        },
        init() {
          this.list = [...this.item].map((s, v) => {
            let value = s.value || (s.children.length ? (s.children[0].title || '') : '')
            let children = (s.children || []).map((k, p) => {
              return {
                title: k.title || '',
                active: value === k.title ? true : !!k.active,
                value: k.value || p + '',
                old: true // 检测是否原始数据 add
              }
            })
            return {
              index: v + 1,
              title: s.title || '',
              children,
              add: !!s.add,
              value,
              search: ''
            }
          })
        }
      },
      mounted() {
        this.init()
      }
    }
  }
  let hand = () => {
    let s = `<div class="app_hands"><div class="canvas">
            <canvas
                id="myCanvas"
                ref="canvas"
                :width="canvasWidth"
                :height="canvasHeight"
                @touchstart="touchStart"
                @touchmove="touchMove"
                @touchend="touchEnd"
                @mousedown="mouseDown"
                @mousemove="mouseMove"
                @mouseup="mouseUp"
            >
                您的浏览器不支持 HTML5 canvas 标签。
            </canvas>
            </div>
        </div>`
    let r = demo.js('#app').rect()
    return {
      template: s,
      props: {
        type: { type: [String, Number], default: '' }
      },
      data() {
        return {
          canvasWidth: r.width,
          canvasHeight: r.height - 90,
          canvasImg: "", // 签名图片地址
          ctx: null, // 画板
          stage_info: [], // 移动端按下点到屏幕的偏差
          isDown: false, // 是否按下
          points: [], // 按下点组合
          startX: 0, // 起始点x坐标
          startY: 0, // 起始点y坐标
          canvas: null,
        };
      },
      mounted() {
        this.init();
      },
      methods: {
        // 初始化画板
        init() {
          this.canvas = this.$refs.canvas;
          this.ctx = this.canvas.getContext("2d");
          this.ctx.fillStyle = "rgba(255,255,255,0.9)"; // bgc
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.strokeStyle = "#000";
          this.ctx.lineWidth = 1;
          this.ctx.lineCap = "round";
          this.stage_info = this.canvas.getBoundingClientRect();
          setTimeout(() => {
            this.stage_info = this.canvas.getBoundingClientRect();
          }, 1200);
        },
        // pc
        mouseDown(ev) {
          let e = ev || event;
          e.preventDefault();
          this.isDown = true;
          let obj = {
            x: e.offsetX,
            y: e.offsetY,
          };
          this.startX = obj.x;
          this.startY = obj.y;
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(obj.x, obj.y);
          this.ctx.stroke();
          this.ctx.closePath();
          this.points.push(obj);
        },
        mouseMove(ev) {
          let e = ev || event;
          e.preventDefault();
          if (this.isDown) {
            let obj = {
              x: e.offsetX,
              y: e.offsetY,
            };
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(obj.x, obj.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.startY = obj.y;
            this.startX = obj.x;
            this.points.push(obj);
          }
        },
        mouseUp(ev) {
          let e = ev || event;
          e.preventDefault();
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY,
          };
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(obj.x, obj.y);
          this.ctx.stroke();
          this.ctx.closePath();
          this.points.push(obj);
          this.points.push({ x: -1, y: -1 });
          this.isDown = false;
        },
        // mobile
        touchStart(ev) {
          let e = ev || event;
          e.preventDefault();
          if (e.touches.length === 1) {
            let obj = {
              x: e.targetTouches[0].clientX - this.stage_info.left,
              y: e.targetTouches[0].clientY - this.stage_info.top,
            };
            this.startX = obj.x;
            this.startY = obj.y;
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(obj.x, obj.y);
            // this.ctx.stroke();
            // this.ctx.closePath();
            this.points.push(obj);
          }
        },
        touchMove(ev) {
          let e = ev || event;
          e.preventDefault();
          if (e.touches.length === 1) {
            let obj = {
              x: e.targetTouches[0].clientX - this.stage_info.left,
              y: e.targetTouches[0].clientY - this.stage_info.top,
            };
            // this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(obj.x, obj.y);
            this.ctx.stroke();
            // this.ctx.closePath();
            this.startX = obj.x;
            this.startY = obj.y;
            this.points.push(obj);
          }
        },
        touchEnd(ev) {
          let e = ev || event;
          e.preventDefault();
          if (e.touches.length === 1) {
            let obj = {
              x: e.targetTouches[0].clientX - this.stage_info.left,
              y: e.targetTouches[0].clientY - this.stage_info.top,
            };
            this.startX = obj.x;
            this.startY = obj.y;
            // this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(obj.x, obj.y);
            // this.ctx.stroke();
            this.ctx.closePath();
            this.points.push(obj);
          }
        },
        // 返回
        routeGo() {
          this.$emit("on-close");
        },
        // 清空
        clear() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.points = [];
        },
        // 提交签名
        commit() {
          this.canvasImg = this.canvas.toDataURL(); // 签名img
          // console.log(this.canvasImg); // 保存签名的base64字符串
          this.$emit("on-save", this.canvasImg, this.type);
        },
      },
    }
  }
  return {
    view, btn, hand
  }
})
demo.font(750)

demo.access('$json', () => {
  let theme1 = () => {
    let arr = [
      {
        title: '整体表现',
        item: [
          {
            list: [{
              children: [
                { title: 'Excellent 优' },
                { title: 'Good 好' },
                { title: 'Pair 好' },
                { title: 'Poor 再加油' }
              ],
            }],

          }
        ]
      },
      {
        title: '课程表现',
        item: [
          {
            title: '入园情绪',
            list: [
              {
                add: true,
                children: [
                  { title: '心情佳' },
                  { title: '普通' },
                  { title: '哭闹' },
                  { title: '其他' }
                ]
              },
            ]
          }, {
            title: '上课与活动情形', list: [
              {
                add: true, title: '与教师互动情形：', children: [
                  { title: '佳' }, { title: '普通' }, { title: '其他' }
                ]
              },
              { add: true, title: '学习情绪：', children: [{ title: '佳' }, { title: '普通' }, { title: '其他' }] },
              { add: true, title: '与其他幼生互动情形：', children: [{ title: '佳' }, { title: '普通' }, { title: '其他' }] },
            ]
          }, { title: '生活常规', list: [{ children: [{ title: '优' }, { title: '好' }, { title: '可' }, { title: '再加强' }] }] }

        ]
      },
      {
        title: '生活状况', item: [
          // { title: '入园情绪', list: [{ add: true, children: [{ title: '心情佳' }, { title: '普通' }, { title: '哭闹' }, { title: '其他' }] }] },
          {
            title: '用餐情况', list: [{
              title: '早餐胃口', add: true,
              children: [{ title: '佳' }, { title: '可' }, { title: '差' }]
            }, {
              title: '午餐胃口', add: true,
              children: [{ title: '佳' }, { title: '可' }, { title: '差' }]
            }, {
              title: '下午点心', add: true,
              children: [{ title: '佳' }, { title: '可' }, { title: '差' }]
            }]
          }, {
            title: '午睡情况', list: [{ add: true, children: [{ title: '很快入睡' }, { title: '入睡时间长' }, { title: '不肯睡' }, { title: '其他' }] }]
          }, { title: '生理状况', list: [{ add: true, children: [{ title: '正常' }, { title: '流鼻涕' }, { title: '其他' }] }] },
          { title: '入厕情况', list: [{ children: [{ title: '正常' }, { title: '尿湿异物丶床铺' }, { title: '园内大便' }] }] }
        ]
      },
      { title: '带回物品', item: [{ list: [{ add: true, children: [{ title: '通知单' }, { title: '棉被/鞋子' }, { title: '收据' }, { title: '其他' }] }] }] }
      , { title: '特殊叮嘱', type: 'textarea', value: '', hand: '', label: '老师签字', sub: 1, path: '' },
      { title: '家长反馈', type: 'textarea', value: '', hand: '', label: '家长签字', sub: 2, path: '' }
    ]
    if (demo.params.type === 'teacher') {
      arr.splice(arr.length - 1, 1)
    }
    arr = arr.map(s => {
      if (!s.type) {
        s.item.map(r => {
          r.list = r.list.map(j => {
            j.value = j.value || ''
            return j
          })
          return r
        })
      }
      return s
    })
    return arr
  }

  return {
    theme1
  }
})

if (demo.params.api) {
  demo.access('baseUrlApi', decodeURIComponent(demo.params.api))
}

demo.access('$api', () => {
  let http = (api, data = {}, fn) => {
    demo.ajax(demo.baseUrlApi + api).post({
      access_token: demo.params.token,
      n_id: demo.params.id,
      ...data
    }, res => {
      if (res.code === 200) {
        fn ? fn(res.data) : null
      } else {
        vant.Toast(res.msg || 'netWork Error')
      }
    }, '', { access_token: demo.params.token })
  }
  let upload = (imgs, fn) => {
    demo.ajax(demo.baseUrlApi + 'com/nursery_common/uploadImage').upload({
      imgs, type: 'img'
    }, e => {
      if (e.code === 200) {
        fn ? fn({
          pic: e.data.data, path: e.data.halfway
        }) : null
      } else if (e.code !== 2) {
        vant.Toast(e.msg || 'netWork Error')
      }
    }, '', {
      access_token: demo.params.token
    })
  }
  let detail = (record_date, fn) => {
    http('parents/take_notes/park_details', {
      record_date
    }, e => {
      fn ? fn(e) : null
    })
  }
  let save = (ndata, record_date, park_records_id, fn) => {
    let content = demo.copy([...ndata])
    let os = {
      record_date,
      content: JSON.stringify(content),
      parent_signature: '',
      park_records_id
    }
    // 判断是否签字
    let v = content.filter(s => {
      return !!s.type
    })
    let tp = demo.params.type
    let r = []
    if (tp === 'teacher') {
      r = v.filter(h => { return h.sub === 1 })
    } else {
      r = v.filter(h => { return h.sub === 2 })
    }
    if (!r.length) {
      return vant.Toast('数据错误')
    }
    if (r[0].path === '') {
      return vant.Toast('请签字')
    }
    os.parent_signature = r[0].path
    http('parents/take_notes/parent_signature', os, () => {
      vant.Toast('录入成功')
      fn ? fn() : null
    })
  }
  return {
    detail, save, upload
  }
})
