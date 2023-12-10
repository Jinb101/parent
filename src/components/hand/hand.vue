<template>
  <div class="signature">
    <!-- 电子签名 -->
    <div class="canvas">
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
    <div class="save">
      <button class="m_btn bgc_primary" @click.stop.prevent="commit">
        确定
      </button>
    </div>
    <!-- <div class="close">
      <button class="m_btn" @click.stop.prevent="routeGo">
        <van-icon name="cross" />
      </button>
    </div> -->
    <div class="clear">
      <button class="m_btn bgc_info" @click.stop.prevent="clear">
        <van-icon name="replay" />
      </button>
    </div>
    <div class="save_btn">
      <button class="m_btn bgc_success" @click.stop.prevent="commit">
        <van-icon name="success" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: { type: [String, Number], default: 345 },
    height: { type: [String, Number], default: 637 },
  },
  data() {
    return {
      canvasWidth: 345,
      canvasHeight: 637,
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
    this.canvasWidth = this.width;
    this.canvasHeight = this.height;
    this.init();
  },
  methods: {
    // 初始化画板
    init() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.fillStyle = "rgb(255,255,255)"; // bgc
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
      if (!this.points.length) return this.$toast("请签名");
      this.canvasImg = this.canvas.toDataURL(); // 签名img
      // console.log(this.canvasImg); // 保存签名的base64字符串
      // eslint-disable-next-line
      demo.es6().imageRotate(this.canvasImg, { index: 3 }, (res) => {
        this.$emit("on-save", res.src);
      });
      // this.$emit("on-save", this.canvasImg);
    },
  },
};
</script>

<style lang="less">
.signature {
  background: #fff;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .canvas {
    font-size: 0;
  }
  .save,
  .close,
  .clear,
  .save_btn {
    position: absolute;
    .m_btn {
      width: 100%;
      font-size: 15px;
    }
  }
  .save {
    bottom: 0;
    width: 70%;
    left: 10px;
    top: 0;
    margin: auto;
    height: 40px;
    transform: rotate(90deg) translateX(-40%);
    transform-origin: 0 100%;
  }
  .close,
  .clear,
  .save_btn {
    right: 10px;
    width: 40px;
    height: 40px;
    transform: rotate(90deg) translateX(-40%);
    transform-origin: 0 100%;
    .m_btn {
      border: 0;
    }
  }
  .close {
    right: 10px;
    .m_btn {
      color: tomato;
    }
  }
  .save_btn {
    top: 55px;
  }
  .clear {
    top: 10px;
  }
}
</style>
