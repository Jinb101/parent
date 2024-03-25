/* eslint-disable */
var demo_calculate = function() {
  var t = demo;
  var check = function(a = 0, b = 0) {
    var ac = t._is_obj(a).code,
      bc = t._is_obj(b).code;
    var p = [0];
    var z = [0];
    if (ac === 4) {
      p = p.concat(a);
    } else {
      p.push(a * 1);
    }
    if (bc === 4) {
      z = z.concat(b);
    } else {
      z.push(b * 1);
    }
    p = t.array(p).sum();
    z = t.array(z).sum();
    ac = null;
    bc = null;
    return { s: p, e: z };
  };
  return {
    add: function(a, b) {
      // 加
      var sum = check(a, b);
      return t.array([sum.s, sum.e]).sum();
    },
    sub: function(a, b) {
      // 减法
      var sum = check(a, b);
      return t.array([sum.e]).sum(sum.s, 1);
    },
    mul: function(a, b) {
      // 乘法
      var sum = check(a, b);
      return t.array([sum.s, sum.e]).sum(1, 2);
    },
    exc: function(a, b) {
      // 除
      b = b ? b : 1;
      var sum = check(a, b);
      return t.array([sum.e]).sum(sum.s, 3);
    },
    sur: function(a, b) {
      // 余
      b = b ? b : 1;
      var sum = check(a, b);
      return t.array([sum.e]).sum(sum.s, 4);
    },
    /*
        数组求和 [5,3,1,2,4] => [1,2,3,4,5] 求和 最小/最大
        1+2 = [3,3,4,5]
        3+3 = [6,4,5] => [4,5,6]
        4+5 = [9,6] => [6,9]
        6+9 = [15]
        3+6+9+15 = 33
    */
    sortSum: function(arr, fn, flag) {
      let a = t.copy(arr);
      if (t._is_obj(a).code !== 4 || !a.length) return {};
      let o = [];
      a = a.filter(k => {
        return k !== undefined;
      });
      function s() {
        flag
          ? t
              .array(a)
              .sort()
              .sort()
          : t
              .array(a)
              .sort()
              .reverse();
        let v = a[1];
        if (v !== undefined) {
          let ns = a[0] + v;
          o.push(ns);
          a.splice(0, 2, ns);
          s();
        }
      }
      s();
      let r = {
        max: t.array(o).sum(),
        arr: arr,
        new: o,
        sum: t.array(arr).sum()
      };
      fn ? fn(r) : null;
      return r;
    },
    /*
        求 相邻连接数 [1,2,3,8,9,11,13,4,6,7] => ['1,2,3','8,9','6,7']
    */
    adj: function(a, tx, flag) {
      if (t._is_obj(a).code !== 4 || !a.length) return a;
      let arr = t.copy(a);
      switch (flag) {
        case 1:
          t.array(arr)
            .sort()
            .reverse();
          break;
        case 2:
          t.array(arr)
            .sort()
            .sort();
          break;
        default:
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
          if (arr[i] + 1 === arr[i + 1]) {
            arr[i] += "-";
          }
        }
        os.push(arr[i] + "");
      }
      let vv = os.join(",").replace(/-,/g, "-");
      vv = vv.split(",");
      vv = vv.filter(k => {
        return isNaN(k);
      });
      if (tx && tx !== "-") {
        vv = JSON.parse(JSON.stringify(vv).replace(/-/g, tx));
      }
      return vv;
    },
    /** 宫格抽奖算法 */
    grid: function(o) {
      let v = o.split("x");
      let x = v[0] * 1;
      let y = v[1] * 1;
      if (x <= 0 || y <= 0) return [];
      let p = [];
      let i = 0;
      for (i; i < x; i++) {
        p.push(i);
      }
      i = 1;
      for (i; i < y; i++) {
        p.push(x * i + x - 1);
      }
      i = x - 1;
      for (i; i > 0; i--) {
        p.push(x * (y - 1) + i - 1);
      }
      i = y - 2;
      for (i; i > 0; i--) {
        p.push(x * i);
      }
      return p;
    },
    // 红包算法
    money: function(max, len) {
      let s = 0;
      let val = +max;
      let vv = [];
      let yv = [];
      let rv = [];
      val *= 100;
      for (let i = 0; i < len; i++) {
        if (i === len - 1) {
          s = val / 100;
        } else {
          let m = val - (len - i - 1);
          // m = i === 0 ? (m > len * 2 ? m / 2 : len) : m
          let r = t.rand(1, m); // sum
          val -= r;
          s = r / 100;
        }
        vv.push(s);
        yv.push(val / 100);
        rv.push({ money: s, val: val / 100 });
      }
      return {
        money: vv,
        val: yv,
        list: rv
      };
    }
  };
};

var demo_es6 = function(cls) {
  let isPlug = false;
  try {
    isPlug = Compressor && Compressor.prototype;
  } catch (e) {}

  let b_f = (b, ext) => {
    let blobToFile = function(newBlob, fileName) {
      newBlob.lastModifiedDate = new Date();
      newBlob.name = fileName;
      return newBlob;
    };
    let e = (ext + "").split("/");
    let file = blobToFile(b, "demo_es6-" + Date.now() + "." + e[e.length - 1]);
    return new window.File([file], b.name, { type: b.type });
  };

  // base64 -> file
  let base64ToFile = base64 => {
    let blob = s => {
      let arr = s.split(",");
      let fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);
      while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
      }
      return {
        b: new Blob([u8Arr], {
          type: fileType
        }),
        t: fileType
      };
    };
    let b = blob(base64);
    return b_f(b.b, b.t);
  };

  // 图片压缩
  let imageCompress = async (data, opt, fn, error) => {
    opt = opt || {};
    let obj = { width: 1e3, height: 1e3, num: 0, ...opt, name: "a.png" };
    function _type(src) {
      let v = "";
      try {
        v = src.split(",");
        v = v[0].match(/:(.*?);/)[1];
      } catch (e) {}
      return v;
    }
    function readImg(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        reader.onerror = function(e) {
          err(e, "FileReader");
          reject(e);
        };
        reader.readAsDataURL(file);
        img.onload = function() {
          let type = _type(img.src);
          resolve({ img, type });
        };
        img.onerror = function(e) {
          err(e, "Image");
          reject(e);
        };
      });
    }
    function readSrc(src) {
      let type = _type(src);
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.crossorigin = "anonymous";
        img.onload = () => {
          resolve({ img: base64ToFile(src), type });
        };
        img.onerror = () => {
          err("图片获取失败");
          reject("image error");
        };
      });
    }
    function err(err, text) {
      error ? error(err, text) : null;
    }
    /**
     * 压缩图片
     *@param img 被压缩的 img 对象
     * @param type 压缩后转换的文件类型
     * @param mx 触发压缩的图片最大宽度限制
     * @param mh 触发压缩的图片最大高度限制
     */
    function compressImg(img, mx, mh, type) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const { width: originWidth, height: originHeight } = img;
        // 最大尺寸限制
        const maxWidth = +mx;
        const maxHeight = +mh;
        // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > 1) {
            // 宽图片
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            // 高图片
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        try {
          resolve({ code: 1, src: canvas.toDataURL(type || "image/jpeg") });
        } catch (err) {
          resolve({ code: 0, src: img.src });
        }
      });
    }

    let tobase = async (f, flag) => {
      let base64 = {};
      let file = f;
      if (flag) {
        let c = await readImg(f);
        base64 = await compressImg(c.img, obj.width, obj.height, c.type);
        if (base64.code) {
          file = base64ToFile(base64.src);
        }
      } else {
        let c = await readImg(f);
        base64 = c.img || {};
      }
      let _data = data;
      if (opt.type !== "file") {
        _data = base64ToFile(data);
      }
      fn
        ? fn({
            file,
            src: base64.src || "",
            small: _data.size > file.size ? file : _data,
            type: file.type,
            data: _data,
            obj,
            compress: flag ? "default" : "compressorjs"
          })
        : null;
    };

    let toNum = n => {
      return n >= 1 || n <= 0 ? 0.6 : n;
    };

    if (obj.type === "file" && data instanceof Blob) {
      data = b_f(data, obj.name);
    }

    let img = obj.type === "file" ? await readImg(data) : await readSrc(data);
    let _file = img.img;
    if (!_file) {
      return err("compressor error");
    }
    if (!(_file instanceof File)) {
      _file = base64ToFile(_file.src);
    }
    if (isPlug) {
      new Compressor(_file, {
        quality: toNum(obj.num),
        maxHeight: obj.height,
        maxWidth: obj.width,
        checkOrientation: true,
        strict: true,
        success(res) {
          tobase(b_f(res, res.type), false);
        },
        error(e) {
          err(e);
        }
      });
      return 0;
    }
    tobase(_file, true);
    return 0;
  };

  // 图片压缩 多张
  let imagesCompress = (data, opt, fn) => {
    let len = data.length;
    let cc = [];
    for (let i = 0; i < len; i++) {
      imageCompress(data[i], opt, e => {
        cc.push(e);
      });
    }
    let n = 0;
    let fr = () => {
      n++;
      setTimeout(() => {
        if (cc.length !== len) {
          if (n > 20) {
            fn([]);
          } else {
            fr();
          }
        } else {
          fn(cc);
        }
      }, 200);
    };
    fr();
  };

  let image = (src, compress) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.crossorigin = "anonymous";
      img.onload = () => {
        let o = {
          width: img.width,
          height: img.height,
          src: src
        };
        if (compress) {
          imageCompress(src, {}, ret => {
            o.data = ret;
          });
        }
        resolve(o);
      };
      img.onerror = () => {
        reject("图片获取失败");
      };
    });
  };

  // 图片旋转
  let imageRotate = (content, options = {}, callback) => {
    let rotate = options.index || 0;
    let _set = (fileContent, fileType, fn) => {
      let canvasDOM = document.createElement("canvas");
      let canvasContext = canvasDOM.getContext("2d");
      let img = new Image();
      img.src = fileContent;
      img.onload = () => {
        switch (rotate % 4) {
          case 0:
            canvasDOM.width = img.width;
            canvasDOM.height = img.height;
            canvasContext.rotate((0 * Math.PI) / 180);
            canvasContext.drawImage(img, 0, 0);
            break;
          case 1:
            canvasDOM.width = img.height;
            canvasDOM.height = img.width;
            canvasContext.rotate((90 * Math.PI) / 180);
            canvasContext.drawImage(img, 0, -img.height);
            break;
          case 2:
            canvasDOM.width = img.width;
            canvasDOM.height = img.height;
            canvasContext.rotate((180 * Math.PI) / 180);
            canvasContext.drawImage(img, -img.width, -img.height);
            break;
          default:
            canvasDOM.width = img.height;
            canvasDOM.height = img.width;
            canvasContext.rotate((270 * Math.PI) / 180);
            canvasContext.drawImage(img, -img.width, 0);
        }
        let url = canvasDOM.toDataURL(fileType, 1);
        fn(url, canvasDOM.width, canvasDOM.height);
      };
    };
    let tofn = (base, w, h) => {
      imageCompress(base, options, res => {
        callback ? callback({ ...res, width: w, height: h }) : null;
      });
    };
    if (content instanceof File) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(content);
      fileReader.onload = e => {
        _set(e.target.result, content.type, (res, w, h) => {
          tofn(res, w, h);
        });
      };
    } else if (typeof content === "string") {
      let fileType = content.includes("data:image/png;base64")
        ? "image/png"
        : content.includes("data:image/gif;base64")
        ? "image/gif"
        : "image/jpeg";
      _set(content, fileType, (res, w, h) => {
        tofn(res, w, h);
      });
    }
  };

  // 延迟函数
  let wait = async (time, fn) => {
    const delay = ms =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    const getData = status =>
      new Promise((resolve, reject) => {
        status ? resolve("done") : reject("fail");
      });
    try {
      const res = await getData(!0);
      const timestamp = Date.now();
      await delay(time);
      fn ? fn(res, Date.now() - timestamp) : null;
    } catch (error) {
      fn ? fn("error", error) : null;
    }
  };

  // 倒计时按钮
  let btn = (dom, fn, timeout) => {
    let t = cls ? cls : demo;
    let ts = Date.now();
    fn({
      code: 1,
      err: "click start",
      time: ts
    });
    timeout = timeout < 1 ? 0 : timeout || 0;
    if (timeout < 1) return !1;
    if (t.$obj(dom, 1) === 3) {
      dom = t.$.dom(dom);
    }
    dom.setAttribute("disabled", "disabled");
    let text = dom.innerHTML;
    dom.innerHTML = timeout + "s";
    let sr = setInterval(function() {
      timeout--;
      dom.innerHTML = timeout + "s";
      fn({ code: 3, err: "loading", time: timeout });
      if (timeout <= 0) {
        dom.innerHTML = text;
        dom.removeAttribute("disabled");
        text = null;
        fn({
          code: 2,
          err: "click reset"
        });
        clearInterval(sr);
      }
    }, 1e3);
  };

  // 倒计时
  let downTime = (time, fn, end, tname = "downtime") => {
    let that = cls ? cls : demo;
    let name = tname + "_timer";
    if (that[name] === undefined) {
      that.access(name, null);
    }

    let clear = () => {
      if (that[name]) {
        clearTimeout(that[name]);
        that[name] = null;
      }
    };

    clear();
    let ts = Date.now();
    time = time || ts;
    end = end || ts + 60e3;
    let sum = start => {
      var st = Math.ceil((end - start) / 1000);
      st = st < 1 ? 0 : st;
      var os = {
        all: st,
        startTime: start,
        endTime: end
      };
      function zero(i) {
        i = parseInt(i);
        return i >= 10 ? i + "" : "0" + i;
      }
      if (st > 0) {
        os.d = zero(st / (24 * 60 * 60));
        os.h = zero((st / (60 * 60)) % 24);
        os.m = zero((st / 60) % 60);
        os.s = zero(st % 60);
        os.arr = [os.d, os.h, os.m, os.s];
      }
      fn ? fn(os) : null;
      return os;
    };
    let times = () => {
      sum(time);
      that[name] = setTimeout(() => {
        time += 1e3;
        if (time <= end) {
          times();
        } else {
          clear();
        }
      }, 1e3);
    };
    times();
  };

  // progress
  let progress = (dom, opt, fn) => {
    let ts = cls ? cls : demo;
    opt = Object.assign(
      {
        max: 100,
        now: 0,
        range: [30, 60, 90],
        color: ["#34d834", "orange", "tomato", "red"],
        sty: { height: "2px" },
        remove: false
      },
      opt
    );
    // var len = arguments.length > 2
    if (ts.$obj(dom, 1) === 3) {
      dom = ts.$.dom(dom);
    }
    if (!dom) {
      return "";
    }
    var cls = dom.className;
    if (cls.indexOf(ts.options.prefix + "_progress") < 0) {
      ts.class(dom).add(ts.options.prefix + "_progress");
    }
    dom.setAttribute("data-length", opt.max);
    dom.setAttribute("data-now", opt.now);
    dom.innerHTML = '<i class="run"></i>';
    ts.js(dom, 0).style(opt.sty);
    var run = dom.querySelector(".run");
    var width = (opt.now / opt.max) * 100;
    var col = "";
    if (opt.color.length && Array.isArray(opt.color)) {
      col = opt.color[0];
    }
    if (opt.range.length > 1) {
      if (opt.range[opt.range.length - 1] <= 100) {
        opt.range[opt.range.length - 1] = 999;
      }
      for (var i = 0; i < opt.range.length; i++) {
        if (width < opt.range[i] && width > (opt.range[i - 1] || 0)) {
          if (opt.color[i]) {
            col = opt.color[i];
          }
        }
      }
    }
    if (col) {
      run.style.background = col;
    }
    ts.js(run, 0).width(width + "%");
    fn ? fn(width) : null;
    if (width >= 100 && opt.remove) {
      setTimeout(function() {
        ts.remove(dom);
      }, 500);
    }
    return width;
  };

  // 获取 header
  let header = () => {
    var req = new XMLHttpRequest();
    req.open("GET", document.location.href, false);
    req.send(null);
    var headerArr = req.getAllResponseHeaders().split("\n");
    var headers = {};
    headerArr.forEach(item => {
      if (item !== "") {
        var index = item.indexOf(":");
        var key = item.slice(0, index);
        var value = item.slice(index + 1).trim();
        headers[key] = value;
      }
    });
    return headers;
  };

  // 逐字加载
  let verbatim = (opt, fn) => {
    let t = cls ? cls : demo;

    opt = t.copy(
      Object.assign(
        {
          cls: "animate",
          finishTimeout: 500,
          str: "",
          dom: "",
          timeout: 1
        },
        opt
      )
    );

    let str = opt.str;
    let c = t.$obj(str, 1);
    let timer = null;
    let r = { a: [], s: "", n: "" };
    if (c === 4 || c === 6) {
      str = JSON.stringify(str);
    }
    c = null;
    var l = (str += "").length;
    r.length = l;

    let dom = opt.dom;
    if (t.$obj(dom, 1) === 3) {
      dom = t.$.dom(dom);
    }

    let animate = data => {
      if (data.finish) {
        setTimeout(function() {
          t.js(dom, 0).text(t.js(dom, 0).text());
        }, opt.finishTimeout);
        return "";
      }
      if (data.n === undefined) return "";
      dom.appendChild(
        t._div("span", t.options.prefix + "_delay " + opt.cls, data.n)
      );
    };
    let tt = opt.timeout;
    tt = tt < 10 ? tt * 1e3 : tt;
    timer = setInterval(function() {
      if (str === "" && l === r.a.length) {
        clearInterval(timer);
        timer = null;
        delete r.n;
        r.finish = true;
        fn ? fn(r) : null;
        animate(r);
        r = null;
        l = null;
        return "";
      }
      var v = str.charAt(0) || "";
      r.a.push(v);
      r.s += v;
      r.n = v;
      r.l = r.a.length;
      str = str.substr(1);
      fn ? fn(r) : null;
      animate(r);
    }, tt);
  };

  // 时钟
  let clock = (opt, fn) => {
    let t = cls ? cls : demo;
    let vt = null;
    opt = t.copy(
      Object.assign(
        {
          scale: "100px",
          color: ["#333", "#ccc"],
          background: "",
          dom: "body",
          id: "",
          index: ""
        },
        opt || {}
      )
    );
    if (t.$obj(opt.color, 1) === 3) {
      opt.color = [opt.color];
    }
    let send = v => {
      doms.h.style.transform = "rotate(" + v.h + "deg)";
      doms.m.style.transform = "rotate(" + v.i + "deg)";
      doms.s.style.transform = "rotate(" + v.s + "deg)";
      fn ? fn(v.obj) : null;
    };
    let start = () => {
      let val = t.timeout("", "rotate");
      val.obj = t.timeout("", "object");
      vt = setTimeout(() => {
        clearTimeout(vt);
        vt = null;
        start();
      }, 1e3);
      send(val);
    };
    let cs = obj => {
      let s = "";
      Object.keys(obj).forEach(r => {
        s += r + ":" + obj[r] + ";";
      });
      return s;
    };
    let dom = opt.dom;
    if (t.$obj(dom, 1) === 3) {
      dom = t.$.dom(dom);
    }
    let id = t.options.prefix + "_" + (opt.id || "clock");
    let bg =
      "data:image/png;base64,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";
    let div = t._div("div", id);
    let sty = z => {
      return cs({
        position: "absolute",
        width: "100%",
        height: "100%",
        "z-index": (opt.index || 300) + z
      });
    };
    div.innerHTML =
      "<span data-h style=" +
      sty(1) +
      "><i></i></span><span data-m style=" +
      sty(2) +
      "><i></i></span><span data-s style=" +
      sty(3) +
      "><i></i></span>";
    div.setAttribute(
      "style",
      cs({
        background:
          "url(" +
          (opt.background || bg) +
          ") 0 0 no-repeat scroll transparent",
        "background-size": "100% 100%",
        width: opt.scale,
        height: opt.scale,
        position: "relative",
        "z-index": opt.index || 300,
        "text-align": "left"
      })
    );
    dom.appendChild(div);
    let cc = h => {
      let max = parseInt(opt.scale);
      return cs({
        position: "absolute",
        width: max * 0.02 + "px",
        height: max / 2 - h * max * 0.1 + "px",
        background: t.$alg.gradients(180, ...opt.color),
        left: 0,
        right: 0,
        top: 0,
        bottom: max * 0.2 + "px",
        margin: "auto",
        "border-radius": max * 0.01 + "px " + max * 0.01 + "px 0 0"
      });
    };
    let doms = {
      h: t.js(dom, 0).find("[data-h]"),
      m: t.js(dom, 0).find("[data-m]"),
      s: t.js(dom, 0).find("[data-s]")
    };
    doms.h.children[0].style = cc(2);
    doms.m.children[0].style = cc(1);
    doms.s.children[0].style = cc(0);
    start();
  };

  // 视频记忆功能
  let video = function(video, fn, name, bool, storage) {
    let ts = cls ? cls : demo;
    if (ts.$obj(video, 1) === 3) {
      video = ts.$.dom(video);
    }
    let data = [
      "loadstart",
      "durationchange",
      "loadedmetadata",
      "loadeddata",
      "progress",
      "canplay",
      "canplaythrough",
      "play",
      "pause",
      "seeking",
      "seeked",
      "waiting",
      "playing",
      "timeupdate",
      "ended",
      "error"
    ];
    let str = ["$session", "$local"][storage ? 1 : 0];
    let ct = function() {
      ts[str].set(_lang, []);
      let val = ts[str].get(_name) || {};
      if (val.n) {
        video.currentTime = val.c;
      }
    };
    name = name || "name";
    let _name = "video-" + name + "-time";
    let _lang = "video-" + name + "-lang";
    let _seek = "video-" + name + "-seek";
    ts[str].set(_lang, []);
    if (bool) {
      setTimeout(() => {
        ct();
      }, 200);
    }
    data.forEach(r => {
      video.addEventListener(r, function(e) {
        let o = {
          type: r,
          data: e,
          dom: video
        };
        if (bool) {
          switch (r) {
            case "loadstart":
              ct();
              break;
            case "timeupdate":
              let m = e.target.duration;
              if (!isNaN(m)) {
                let v = { d: m, c: e.target.currentTime, n: Date.now() };
                ts[str].set(_name, v);
                o.name = _name;
                o.time = v;
              }
              break;
            case "ended":
            case "error":
              ts[str].set(_lang, []);
              break;
            default:
          }
        }
        fn ? fn(o) : null;
      });
    });
    let os = {
      play: function() {
        video.play();
        return video;
      },
      pause: function() {
        video.pause();
        return video;
      },
      currentTime: function(v) {
        video.currentTime = +v;
        return video;
      },
      // 禁止拖动
      unSeek: function(v, f) {
        let type = v.type;
        if (["seeking", "timeupdate"].indexOf(type) < 0) return;
        let e = v.data.target.currentTime || 0;
        let n = _seek;
        let val = ts[str].get(n) || 0;
        let cal = { code: 1, old: val, num: e };
        if (e - val > 1) {
          cal.code = 0;
          video.currentTime = val;
        }
        f ? f(cal) : null;
        if (type !== "seeking") {
          ts[str].set(n, e);
        }
        return this;
      },
      // 快进 快退
      multiple: function(scale, bool) {
        let num = video.currentTime;
        if (isNaN(scale)) {
          scale = 1;
        }
        num = bool ? (num += scale) : (num -= scale);
        num = num < 0 ? 0 : num;
        video.currentTime = num;
        return this;
      },
      // 倍数
      speed: function(scale) {
        let v = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 8];
        if (isNaN(scale)) {
          scale = 3;
        }
        let num = +scale > v.length - 1 ? 3 : +scale;
        video.playbackRate = v[num];
        return v;
      },
      // 累积播放
      lang: function(e, len, fn) {
        if (e.type === "timeupdate") {
          let n = _lang;
          let _d = ts[str].get(n) || [];
          let val = Math.floor(e.data.target.currentTime || 0);
          let max = e.data.target.duration;
          if (isNaN(len)) {
            len = 15;
          }
          len = len < 1 ? 1 : len;
          len = len > max ? max : len;
          if (val > 0 && _d.indexOf(val) < 0 && _d[0] !== -1) {
            _d.push(val);
            ts[str].set(n, _d);
          }
          if (_d.length >= len && _d[0] !== -1) {
            fn ? fn(_d.length) : null;
            ts[str].set(n, [-1]);
          }
        }
        return this;
      },
      // 销毁
      destroy: function() {
        ts[str].clear(_seek);
        ts[str].clear(_lang);
        ts[str].clear(_name);
        video.pause();
        video.currentTime = 0;
        video = null;
      }
    };
    return os;
  };

  // 读取 file 视频的长度 ios 不兼容 (可调用，但不会进行判断)
  let videoTimeout = (file, timeout, fn) => {
    let a = URL.createObjectURL(new Blob([file], { type: "application/zip" }));
    let tss = setTimeout(() => {
      fn({ flag: true });
    }, 3e3);

    let v = new Audio(a);
    v.addEventListener("loadedmetadata", function(_event) {
      fn({
        flag: timeout > v.duration,
        timeout,
        time: v.duration,
        event: v,
        _event
      });
      clearTimeout(tss);
    });
  };

  // excel 读取/导出
  let xlsx = (option = {}, fn) => {
    let ver = window.XLSX && XLSX.version;
    if (!ver) return 0;

    let read = (file, callback) => {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });
        if (callback) callback(workbook);
      };
      reader.readAsBinaryString(file);
    };

    let readWorkbook = (workbook, isCsv = false, index = 0) => {
      var sheetNames = workbook.SheetNames; // 工作表名称集合
      let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[index]]);
      let csv = "";
      if (isCsv) {
        csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetNames[index]]);
      }
      return { json, csv };
    };

    let openDownloadDialog = (url, saveName) => {
      if (typeof url === "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建 blob 地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5 新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    };
    let sheet2blob = (sheet, sheetName) => {
      sheetName = sheetName || "sheet1";
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成 excel 的配置项
      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成 Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本 IOS 设备上有更好的兼容性
        type: "binary"
      };
      // eslint-disable-next-line
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      // 字符串转 ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return blob;
    };

    let opt = {
      index: 0,
      csv: false,
      type: "read",
      down: Date.now(),
      ...option
    };

    switch (opt.type) {
      case "read":
        if (opt.file) {
          read(opt.file, r => {
            let v = readWorkbook(r, opt.csv, opt.index);
            fn ? fn(v) : null;
          });
        }
        break;
      case "down":
        if (opt.data) {
          let sheet = XLSX.utils.json_to_sheet(opt.data);
          openDownloadDialog(sheet2blob(sheet), opt.down + ".xlsx");
        }
        break;
      default:
    }
    // 上传转 json
    // json 转出
  };

  //将数字（整数）转为汉字，从零到一亿亿，需要小数的可自行截取小数点后面的数字直接替换对应 arr1 的读法就行了
  let toChinaNum = (num, isFlag = false, isTW = false) => {
    var arr1 = new Array(
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九"
    );
    var arr2 = new Array(
      "",
      "十",
      "百",
      "千",
      "万",
      "十",
      "百",
      "千",
      "亿",
      "十",
      "百",
      "千",
      "万",
      "十",
      "百",
      "千",
      "亿"
    );
    //可继续追加更高位转换值
    if (!num || isNaN(num)) {
      return "零";
    }
    let f = "";
    if (num < 0) {
      num = Math.abs(num);
      f = "负";
    }
    let val = num.toString().split(".");
    var english = val[0].split("");
    let decimal = (val[1] || "").split("");
    var result = "";
    for (var i = 0; i < english.length; i++) {
      var des_i = english.length - 1 - i;
      //倒序排列设值
      result = arr2[i] + result;
      var arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零 (千 | 百|十)/g, "零").replace(/十零/g, "十");
    //合并中间多个零为一个零
    result = result.replace(/零+/g, "零");
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, "亿");
    //移除末尾的零
    result = result.replace(/零+$/, "");
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, "十");

    let r = n => {
      let num = n;
      if (isTW) {
        var arr4 = [
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
          "十",
          "百",
          "千"
        ];
        var arr3 = [
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖",
          "拾",
          "佰",
          "仟"
        ];
        let v = n.split("").map(s => {
          let i = arr4.indexOf(s);
          return i > -1 ? arr3[i] : s;
        });
        num = v.join("");
      }
      num = num.indexOf("元") === 0 ? "零" + num : num;
      return num;
    };

    if (isFlag && decimal.length) {
      let arr3 = ["角", "分"];
      let dec = decimal
        .map((s, v) => {
          return arr1[s] + (arr3[v] || "");
        })
        .join("");
      return r(f + [result, dec].join("元"));
    }
    return r(f + result);
  };

  // div 转 canvas
  let tocanvas = async (dom, option = {}, demo) => {
    let ts = demo || window.demo;
    if (ts.$obj(html2canvas, 1) !== 5) {
      return null;
    }
    let box = ts.js(dom, ts.$obj(dom, 1) === 6 ? 0 : 1);
    let rect = box.rect();

    let scale = window.devicePixelRatio;

    let _w = rect.width;
    let _h = rect.height;

    let { width, height } = option;
    width = width || _w;
    height = height || _h;

    let opt = {
      ...option,
      scale,
      width,
      height,
      useCORS: true,
      allowTaint: false
    };

    let imgs = box.dom().querySelectorAll("img");
    if (imgs.length) {
      Array.from(imgs).map(s => {
        s.setAttribute("crossorigin", "anonymous");
      });
    }

    return html2canvas(box.dom(), opt).then(canvas => {
      if (imgs.length) {
        Array.from(imgs).map(s => {
          s.removeAttribute("crossorigin");
        });
      }
      return {
        img: canvas.toDataURL("image/png"),
        canvas,
        file: base64ToFile(canvas.toDataURL("image/png"))
      };
    });
  };

  // 下载
  let download = (down, type, demo) => {
    let t = demo || window.demo;
    let a = t._div("a");
    a.download = t.rand(6) + "_" + Date.now();
    a.href = down;
    a.dataset.downloadurl = [type || "image/png", a.download, a.href].join(":");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return !0;
  };

  // 几天前
  let timeoutDiff = (timeout, days = 3) => {
    let t = cls || window.demo;
    let today = parseInt(Date.now() / 1e3);
    let time = t.timeout(timeout, "object");
    if (today < time.default) {
      return t.timeout(timeout);
    }
    let d = today - time.default;
    let dd = parseInt(d / 86400);
    let hh = parseInt(d / 3600);
    let mm = parseInt(d / 60);
    let ss = parseInt(d);
    if (dd > 0 && dd < days) {
      return dd + "天前";
    } else if (dd <= 0 && hh > 0) {
      return hh + "小时前";
    } else if (hh <= 0 && mm > 0) {
      return mm + "分钟前";
    } else if (ss < 60) {
      return ss <= 0 ? "刚刚" : ss + "秒前";
    } else if (dd >= days && dd < 30) {
      return [time.m, time.d].join("-") + " " + [time.h, time.i].join(":");
    } else if (dd >= 30) {
      return t.timeout(timeout, "all");
    }
  };

  // 防抖
  let timeoutFn = (name, fn, timeout = 500) => {
    let t = cls ? cls : window.demo;
    if (t[name]) {
      clearTimeout(t[name]);
      t[name] = null;
    }
    t[name] = setTimeout(() => {
      fn ? fn() : null;
    }, timeout);
  };

  // 加密解密
  let md5 = (key, val, type) => {
    if (typeof CryptoJS !== "object") {
      return val;
    }
    if (!!type) {
      // 解
      let decData = CryptoJS.enc.Base64.parse(val).toString(CryptoJS.enc.Utf8);
      let decJson = CryptoJS.AES.decrypt(decData, key).toString(
        CryptoJS.enc.Utf8
      );
      return decJson;
      // let decData = CryptoJS.enc.Base64.parse(val).toString(CryptoJS.enc.Utf8);
      // return CryptoJS.AES.decrypt(decData, CryptoJS.enc.Utf8.parse(key), {
      //     mode: CryptoJS.mode.ECB,
      //     padding: CryptoJS.pad.Pkcs7
      // }).toString(CryptoJS.enc.Utf8)
    } else {
      let encJson = CryptoJS.AES.encrypt(val, key).toString();
      let encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      return encData;
      // let encJson = CryptoJS.AES.encrypt(val, CryptoJS.enc.Utf8.parse(key), {
      //     mode: CryptoJS.mode.ECB,
      //     padding: CryptoJS.pad.Pkcs7
      // }).toString()
      // return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
    }
  };

  let isWx = () => {
    var w = navigator.userAgent.match(/micromessenger\/(\d+\.\d+\.\d+)/i) || [];
    w = w[1] || "";
    let len = (w + "").split(".");
    len = len.filter(k => {
      return k !== "";
    });
    return +len[0] >= 5;
  };

  // url:访问地址 加密
  let encrypt = (data, url, type = "web", join = "_____") => {
    let t = cls ? cls : demo;
    let o = {
      type,
      data,
      url
    };
    let k = t.$random.vars();
    let c = md5(k, JSON.stringify(o), 0);
    return [encodeURIComponent(c), k].join(join);
  };
  // 解密
  let decrypt = (encrypt, join = "_____") => {
    let m = decodeURIComponent(encrypt).split(join);
    let data = md5(m[1], m[0], 1);
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    return data;
  };

  let mobile = () => {
    let userAgent = navigator.userAgent;
    let webLog = { ua: userAgent };
    // 获取微信版本
    let m1 = userAgent.match(/MicroMessenger.*?(?= )/);
    if (m1 && m1.length > 0) {
      webLog.wechat = m1[0];
    }
    // 苹果手机
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      // 获取设备名
      if (userAgent.includes("iPad")) {
        webLog.device = "iPad";
      } else {
        webLog.device = "iPhone";
      }
      // 获取操作系统版本
      m1 = userAgent.match(/iPhone OS .*?(?= )/);
      if (m1 && m1.length > 0) {
        webLog.system = m1[0];
      }
    }
    // 安卓手机
    if (userAgent.includes("Android")) {
      // 获取设备名
      m1 = userAgent.match(/Android.*; ?(.*(?= Build))/);
      if (m1 && m1.length > 1) {
        webLog.device = m1[1];
      }
      // 获取操作系统版本
      m1 = userAgent.match(/Android.*?(?=;)/);
      if (m1 && m1.length > 0) {
        webLog.system = m1[0];
      }
    }
    return webLog;
  };

  return {
    version: "1.0.97",
    image,
    wait,
    base64ToFile,
    imageCompress,
    imagesCompress,
    imageRotate,
    blobToFile: b_f,
    btn,
    downTime,
    progress,
    header,
    verbatim,
    video,
    clock,
    videoTimeout,
    xlsx,
    toChinaNum,
    tocanvas,
    download,
    timeoutDiff,
    timeoutFn,
    md5,
    isWx,
    encrypt,
    decrypt,
    mobile
  };
};
var demo_vx = function(cls) {
  // 需引入微信 jsSdk
  let that = cls ? cls : demo;
  // 当前版本号
  let ver = "1.4.1";
  // 存储名
  let name = that.options.prefix + "-vx-config-" + ver.replace(/\./g, "");
  let isDebug = false;
  let isError = false;

  let setDebug = f => {
    isDebug = !!f;
  };

  // 插件选择
  let choose = function(type) {
    let obj = {
      share: [
        "updateAppMessageShareData",
        "updateTimelineShareData",
        "onMenuShareWeibo"
      ],
      image: [
        "chooseImage",
        "previewImage",
        "uploadImage",
        "downloadImage",
        "getLocalImgData"
      ],
      audio: [
        "startRecord",
        "stopRecord",
        "onVoiceRecordEnd",
        "playVoice",
        "pauseVoice",
        "stopVoice",
        "onVoicePlayEnd",
        "uploadVoice",
        "downloadVoice",
        "translateVoice"
      ],
      geo: ["openLocation", "getLocation"],
      default: ["getNetworkType", "scanQRCode"]
    };
    if (type === "all") {
      let v = Object.values(obj).reduce((a, b) => {
        return a.concat(b);
      });
      return v;
    }
    if (obj[type]) return obj[type];
    return obj.default;
  };

  // 图像
  // ------- 拍照
  let image = function(fn, size) {
    let val = _getData("plug") || [];
    if (val.indexOf("chooseImage") < 0) {
      fn ? fn(error("不支持 chooseImage")) : null;
      return "";
    }
    wx.chooseImage({
      count: size || 9, // 默认 9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var localIds = res.localIds; // 返回选定照片的本地 ID 列表，localId 可以作为 img 标签的 src 属性显示图片
        if (localIds.length) {
          fn ? fn(localIds) : null;
        }
      }
    });
  };
  // ------- 预览
  let imageView = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("previewImage") < 0) {
      fn ? fn(error("不支持 previewImage")) : null;
      return "";
    }
    opt = opt || {};
    wx.previewImage({
      current: opt.src || "", // 当前显示图片的 http 链接
      urls: opt.list || [] // 需要预览的图片 http 链接列表
    });
  };
  // ------- 上传
  let imageUpload = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("uploadImage") < 0) {
      fn ? fn(error("不支持 uploadImage")) : null;
      return "";
    }
    opt = opt || {};
    wx.uploadImage({
      localId: opt.id || "", // 需要上传的图片的本地 ID，由 chooseImage 接口获得
      isShowProgressTips: 1, // 默认为 1，显示进度提示
      success: function(res) {
        // var serverId = res.serverId; // 返回图片的服务器端 ID
        fn ? fn(error("serverId", 1, res)) : null;
      }
    });
  };
  // ------- 下载
  let imageDown = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("downloadImage") < 0) {
      fn ? fn(error("不支持 downloadImage")) : null;
      return "";
    }
    opt = opt || {};
    wx.downloadImage({
      serverId: opt.id || "", // 需要下载的图片的服务器端 ID，由 uploadImage 接口获得
      isShowProgressTips: 1, // 默认为 1，显示进度提示
      success: function(res) {
        //   var localId = res.localId; // 返回图片下载后的本地 ID
        fn ? fn(error("localId", 1, res)) : null;
      }
    });
  };
  // ------- 获取本地图片
  let imageGet = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("getLocalImgData") < 0) {
      fn ? fn(error("不支持 getLocalImgData")) : null;
      return "";
    }
    opt = opt || {};
    wx.getLocalImgData({
      localId: opt.id || "", // 图片的 localID
      success: function(res) {
        var localData = res.localData; // localData 是图片的 base64 数据，可以用 img 标签显示
        if (localData.indexOf("data:image") !== 0) {
          localData = "data:image/jpeg;base64," + localData;
        }
        localData = localData
          .replace(/\r|\n/g, "")
          .replace("data:image/jpg", "data:image/jpeg");
        fn ? fn(error("localData", 1, { url: localData, res })) : null;
      }
    });
  };

  // 音频
  // ------- 开始录音
  let music = function(fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("startRecord") < 0) {
      fn ? fn(error("不支持 startRecord")) : null;
      return "";
    }
    wx.startRecord();
    fn ? fn(error("", 1)) : null;
  };
  // ------- 停止录音
  let musicStop = function(fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("stopRecord") < 0) {
      fn ? fn(error("不支持 stopRecord")) : null;
      return "";
    }
    wx.stopRecord({
      success: function(res) {
        // var localId = res.localId;
        fn ? fn(error("localId", 1, res)) : null;
      }
    });
  };
  // ------- 监听录音
  let musicWatch = function(fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("onVoiceRecordEnd") < 0) {
      fn ? fn(error("不支持 onVoiceRecordEnd")) : null;
      return "";
    }
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: function(res) {
        // var localId = res.localId;
        fn ? fn(error("localId", 1, res)) : null;
      }
    });
  };
  // ------- 播放语音
  let musicPlay = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("playVoice") < 0) {
      fn ? fn(error("不支持 playVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.playVoice({
      localId: opt.id || "" // 需要播放的音频的本地 ID，由 stopRecord 接口获得
    });
  };
  // ------- 暂停播放
  let musicPause = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("pauseVoice") < 0) {
      fn ? fn(error("不支持 pauseVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.pauseVoice({
      localId: opt.id || "" // 需要暂停的音频的本地 ID，由 stopRecord 接口获得
    });
  };
  // ------- 停止播放
  let musicPlayStop = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("stopVoice") < 0) {
      fn ? fn(error("不支持 stopVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.stopVoice({
      localId: opt.id || "" // 需要停止的音频的本地 ID，由 stopRecord 接口获得
    });
  };
  // ------- 监听语音播放
  let musicPlayWatch = function(fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("onVoicePlayEnd") < 0) {
      fn ? fn(error("不支持 onVoicePlayEnd")) : null;
      return "";
    }
    wx.onVoicePlayEnd({
      success: function(res) {
        // var localId = res.localId; // 返回音频的本地 ID
        fn ? fn(error("", 1, res)) : null;
      }
    });
  };
  // ------- 上传语音
  let musicUpload = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("uploadVoice") < 0) {
      fn ? fn(error("不支持 uploadVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.uploadVoice({
      localId: opt.id || "", // 需要上传的音频的本地 ID，由 stopRecord 接口获得
      isShowProgressTips: 1, // 默认为 1，显示进度提示
      success: function(res) {
        // var serverId = res.serverId; // 返回音频的服务器端 ID
        fn ? fn(error("serverId", 1, res)) : null;
      }
    });
  };
  // ------- 下载语音
  let musicDown = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("downloadVoice") < 0) {
      fn ? fn(error("不支持 downloadVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.downloadVoice({
      serverId: opt.id || "", // 需要下载的音频的服务器端 ID，由 uploadVoice 接口获得
      isShowProgressTips: 1, // 默认为 1，显示进度提示
      success: function(res) {
        // var localId = res.localId; // 返回音频的本地 ID
        fn ? fn(error("localId", 1, res)) : null;
      }
    });
  };
  // ------- 识别音频
  let musicListen = function(opt, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("translateVoice") < 0) {
      fn ? fn(error("不支持 translateVoice")) : null;
      return "";
    }
    opt = opt || {};
    wx.translateVoice({
      localId: opt.id || "", // 需要识别的音频的本地 Id，由录音相关接口获得
      isShowProgressTips: 1, // 默认为 1，显示进度提示
      success: function(res) {
        // alert(res.translateResult); // 语音识别的结果
        fn ? fn(error("translateResult", 1, res)) : null;
      }
    });
  };

  // 定位
  let geo = function(fn, type) {
    let val = _getData("plug") || [];
    if (val.indexOf("getLocation") < 0 && val.indexOf("geoLocation") < 0) {
      fn ? fn(error("不支持 getLocation")) : null;
      return "";
    }
    wx.getLocation({
      type: type || "gcj02", // 默认为 wgs84 的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
      success: function(res) {
        // var latitude = res.latitude; // 纬度，浮点数，范围为 90 ~ -90
        // var longitude = res.longitude; // 经度，浮点数，范围为 180 ~ -180。
        // var speed = res.speed; // 速度，以米/每秒计
        // var accuracy = res.accuracy; // 位置精度
        fn
          ? fn({
              lat: res.latitude,
              lng: res.longitude,
              speed: res.speed,
              acc: res.accuracy
            })
          : null;
      }
    });
  };
  let geoOpen = function(obj, fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("openLocation") < 0) {
      fn ? fn(error("不支持 openLocation")) : null;
      return "";
    }
    obj = obj || {};
    wx.openLocation({
      latitude: obj.lat || 0, // 纬度，浮点数，范围为 90 ~ -90
      longitude: obj.lng || 0, // 经度，浮点数，范围为 180 ~ -180。
      name: obj.name || "", // 位置名
      address: obj.address || "", // 地址详情说明
      scale: obj.scale || 1, // 地图缩放级别，整形值，范围从 1~28。默认为最大
      infoUrl: obj.url || "" // 在查看位置界面底部显示的超链接，可点击跳转
    });
  };

  // 分享
  let share = (option, fn, type = false) => {
    // 分享到朋友圈 : 分享给朋友
    let api = type ? "updateTimelineShareData" : "updateAppMessageShareData";
    let val = _getData("plug") || [];
    if (val.indexOf(api) < 0 && val.indexOf(api) < 0) {
      fn ? fn(error("不支持 " + api)) : null;
      return "";
    }
    let opt = {
      title: option.title || "",
      desc: option.desc || "",
      imgUrl: option.logo || "",
      success: e => {
        fn ? fn(e) : null;
      }
    };
    if (!type) {
      opt.link = option.link || window.location.href;
    }
    console.log(api, wx[api]);
    wx[api](opt);
  };

  // 获取网络状态
  let state = function(fn) {
    let val = _getData("plug") || [];
    if (val.indexOf("getNetworkType") < 0) {
      fn ? fn(error("不支持 getNetworkType")) : null;
      return "";
    }
    wx.getNetworkType({
      success: function(res) {
        // var networkType = res.networkType; // 返回网络类型 2g，3g，4g，wifi
        fn ? fn(error("networkType", 1, res)) : null;
      }
    });
  };

  // 扫一扫
  let qr = function(fn, flag) {
    let val = _getData("plug") || [];
    if (val.indexOf("scanQRCode") < 0) {
      fn ? fn(error("不支持 scanQRCode")) : null;
      return "";
    }
    wx.scanQRCode({
      needResult: !!flag * 1, // 默认为 0，扫描结果由微信处理，1 则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function(res) {
        // var result = res.resultStr; // 当 needResult 为 1 时，扫码返回的结果
        fn ? fn(error("resultStr", 1, res)) : null;
      }
    });
  };

  // 付款
  let pay = function(data, callback) {
    let d = {
      appId: data.appid,
      timeStamp: data.timeStamp + "",
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.sign
    };
    WeixinJSBridge.invoke("getBrandWCPayRequest", d, function(res) {
      let type = (res.err_msg + "").replace("get_brand_wcpay_request:", "");
      callback(
        error(
          type === "ok"
            ? "支付成功"
            : type === "cancel"
            ? "取消支付"
            : "支付失败",
          type === "ok",
          res
        )
      );
    });
  };
  // 使用 微信内置方法 赋给 name
  let use = function(name, data, fn) {
    this.check(name, data, e => {
      fn(e);
    });
  };

  // 网页授权
  /**
   *
   * @param {Object} con // {data:state 参数，link:重定向地址，}
   */
  let auth = function(con, fn) {
    let val = _getData("appId");
    if (!val) {
      fn ? fn(error("appid is null")) : null;
      return "";
    }
    con = that.copy(
      Object.assign(
        {
          link: window.location.href
            .replace(window.location.search, "")
            .replace(window.location.hash, ""),
          data: that.options.prefix,
          type: 0
        },
        con || {}
      )
    );
    let url =
      "https://open.weixin.qq.com/connect/oauth2/authorize?" +
      _ots({
        appid: val, // 公众号的唯一标识
        redirect_uri: encodeURI(con.link), // 授权后重定向的回调链接地址，请使用 urlEncode 对链接进行处理
        response_type: "code", // 返回类型，请填写 code
        scope: ["snsapi_userinfo", "snsapi_base"][con.type], // 应用授权作用域 snsapi_base,snsapi_userinfo
        state: con.data // 重定向后会带上 state 参数
      }) +
      "#wechat_redirect";
    window.location.replace(url);
  };

  // 微信版本号
  let version = level => {
    var w = navigator.userAgent.match(/micromessenger\/(\d+\.\d+\.\d+)/i) || [];
    w = w[1] || "";
    let len = (w + "").split(".");
    len = len.filter(k => {
      return k !== "";
    });
    if (level > 0) {
      if (len[0] * 1 >= level) {
        return true;
      } else {
        return false;
      }
    }
    return len;
  };

  // 检测 WeiXinJSBridge
  let check = function(name, data, fn) {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          this[name](data, fn),
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", this[name](data, fn));
        document.attachEvent("onWeixinJSBridgeReady", this[name](data, fn));
      }
    } else {
      this[name](data, fn);
    }
  };

  let debug = false;
  let error = (e, c, d) => {
    if (debug) {
      log(e);
    }
    return { err: e || "", code: !!c, data: d || {} };
  };
  let log = res => {
    console.log(res);
  };

  // 存储状态
  let _setData = e => {
    that.$session.set(name, { time: Date.now() + 864e6, item: e });
  };
  // 获取状态
  let _getData = e => {
    let val = that.$session.get(name) || {};
    if (val.time && val.time > Date.now()) {
      val = val.item;
      if (val[e] !== undefined) {
        return val[e];
      }
      return "";
    }
    return "";
  };
  let _ots = function(obj) {
    let s = "";
    Object.keys(obj).forEach(r => {
      s += r + "=" + obj[r] + "&";
    });
    s = s.substring(0, s.length - 1);
    return s;
  };

  // 初始化
  let init = (e, fn, f2, type) => {
    if (!version(5)) {
      f2 ? f2(error("微信版本过低")) : null;
      return 0;
    }
    isError = false;
    let plug = [];
    let i = false;
    switch (type) {
      case "share":
      case "image":
      case "default":
      case "geo":
      case "audio":
      case "all":
        i = true;
        plug = choose(type);
        break;
      default:
        plug = choose("share");
    }
    wx.config({
      debug: isDebug,
      appId: e.appId,
      timestamp: e.timestamp,
      nonceStr: e.nonceStr,
      signature: e.signature,
      jsApiList: plug
    });
    wx.ready(() => {
      e.plug = i ? choose(type) : plug;
      _setData(e);
      fn ? fn(e.plug) : null;
    });
    wx.error(res => {
      isError = true;
      let msg = res.errMsg || "微信加载失败";
      f2 ? f2(error(msg, 0, res)) : null;
    });
  };

  // 自定义插件 初始化
  /**
   *
   * @param {Object} config 配置 {type:类型，list:自定义插件，key:微信 appid 等配置}
   * @param {Function} fn 回调 code 判断成功已否
   */
  let plug = (config, fn) => {
    let type = config.type;
    if (config.key && config.key.appId) {
      init(
        config.key,
        p => {
          if (isError) {
            return !1;
          }
          fn(error("", 1, p));
        },
        e => {
          fn(e);
        },
        type
      );
    } else {
      fn ? fn(error("config.key.appId is null")) : null;
    }
  };

  // key {appID,timestap,sin...}
  let start = (key, fn) => {
    plug({ type: "all", key }, e => {
      fn(e);
    });
  };

  return {
    debug,
    check,
    use,
    version,
    init,
    plug,
    image,
    imageUpload,
    imageDown,
    imageView,
    imageGet,
    music,
    musicDown,
    musicListen,
    musicPause,
    musicPlay,
    musicPlayStop,
    musicPlayWatch,
    musicStop,
    musicUpload,
    musicWatch,
    geo,
    geoOpen,
    state,
    qr,
    pay,
    auth,
    start,
    setDebug,
    share
  };
};
var demo_upload = function() {
  if (!demo_vx) {
    return {};
  }

  let init = function(wxconfig, fn) {
    demo_vx().start(wxconfig, res => {
      fn ? fn(res) : null;
    });
    return this;
  };

  let image = (length = 1) => {
    return new Promise((resolve, reject) => {
      let img = [];
      demo_vx().image(res => {
        res.length &&
          res.forEach(id => {
            demo_vx().imageGet({ id }, fileId => {
              if (fileId.code) {
                demo.es6().imageCompress(
                  fileId.data.url,
                  { width: 1920, height: 1080 },
                  file => {
                    img.push(file);
                    if (img.length === res.length) {
                      resolve(
                        img.filter(s => {
                          return !!s;
                        })
                      );
                    }
                  },
                  err => {
                    console.log(err, "err");
                  }
                );
              } else {
                img.push("");
              }
              if (img.length === res.length) {
                resolve(
                  img.filter(s => {
                    return !!s;
                  })
                );
              }
            });
          });
      }, length);
    });
  };

  let imageView = (list = [], src = "") => {
    src = src || list[0];
    demo_vx().imageView({ src, list }, e => {
      console.log(e);
    });
  };

  let share = (opt = {}, fn, type) => {
    demo_vx().share(
      opt,
      e => {
        fn ? fn(e) : null;
      },
      type
    );
  };

  return {
    init,
    image,
    share,
    imageView
  };
};

var demo_month = function() {
  var t = demo;
  let eve = (os, ext) => {
    return {
      week: os.w,
      index: os.week,
      time: os.y + "/" + os.m + "/" + os.d,
      time2: os.y + "/" + +os.m + "/" + +os.d,
      timeout: os.default,
      month: os.m * 1,
      day: os.d * 1,
      year: os.y,
      ext: ext || {}
    };
  };
  return {
    date: function(y, m) {
      if (isNaN(y)) {
        y = 2020;
      }
      if (isNaN(m)) {
        m = 1;
      }
      let v = new Date().getFullYear();
      y = y > v + 60 ? v : y < 1970 ? v : y;
      m = m > 12 ? 12 : m < 1 ? 1 : m;
      var d = new Date(y, m, 0);
      return d.getDate();
    },
    day: function(time) {
      var date = t.timeout(time, "object");
      var d = new Date(date.y, date.m * 1, 0);
      return d.getDate();
    },
    month: function(num) {
      var now = new Date();
      if (num === undefined) {
        num = now.getMonth();
      }
      if (t._is_obj(num).code !== 1) {
        num = Date.now();
      }
      if (num < 12) {
        now.setMonth(num);
      } else {
        // 时间戳
        now = new Date(t.timeout(num, "ymd"));
      }
      var current_month_num = this.day(now.getTime());
      var current_month = [];

      for (var i = 1; i <= current_month_num; i++) {
        var day = now.setDate(i);
        var os = t.timeout(day, "object");
        current_month.push(eve(os));
      }
      return current_month;
    },
    time: function(interval, hour, range, timeout) {
      if (!timeout) {
        timeout = Date.now();
      }
      hour = hour || 0;
      var num = (interval || 60) * 1e3;
      var day = 36e5 * (range || 1);
      var len = Math.ceil(day / num) + 1;
      var start = t.timeout(timeout, "zero") + (hour > 0 ? hour * 6e4 : 0);
      var s = [];
      for (var i = 0; i < len; i++) {
        var v = start;
        s.push(t.timeout(v, "alls"));
        start += num;
      }
      return s;
    },
    // 获取未来几天
    week: function(days, timeout, fn) {
      if (!timeout) {
        timeout = Date.now();
      }
      if (!days || isNaN(days)) {
        days = 7;
      }
      if (days < 0) {
        days *= -1;
      }
      var time = t.timeout(timeout, "zero");
      var s = [];
      for (var i = 0; i < days * 1; i++) {
        s.push(time + 864e5 * i);
      }
      s = s.map(function(k, v) {
        return eve(t.timeout(k, "object"), { timeout: k, index: v });
      });
      fn ? fn(s) : null;
      return s;
    },
    // 获取当前月份已过日期
    current: function() {
      var m = demo.timeout("", "object").m - 1;
      var item = this.month(m);
      var now = t.timeout("", "object");
      item = item.filter(k => {
        return k.timeout <= now.default;
      });
      return item;
    },
    // 获取之前 n 天
    before: function(len) {
      len = isNaN(len) ? 1 : len;
      len = len < 1 ? 1 : len;
      let start = t.timeout("", "zero") - 864e5 * len;
      let o = [];
      for (let i = 1; i <= len; i++) {
        var os = t.timeout(start + 864e5 * i, "object");
        o.push(eve(os));
      }
      return o;
    },
    // 获取第几周
    // 传入 时间戳 返回 第几周
    // 传入 第几周 返回 时间 array
    getWeek: function(time, start, fs) {
      let num = isNaN(time) ? 0 : time;
      let type = num > 864e5 - 1;
      start = start || new Date(new Date().setMonth(0)).setDate(1);
      if (fs) {
        let obj = t.timeout(start, "object");
        start = obj.default - 864e2 * (obj.week - 1);
        if (fs === 2 && [6, 0].indexOf(obj.week) >= 0) {
          start = obj.default + 864e2 * (obj.week === 6 ? 2 : 1);
        }
      }
      if (type) {
        let days = Math.ceil((num - start) / 864e5);
        let week = Math.ceil(days / 7);
        return { days, week, start, time: num };
      }
      let end = start + num * 864e5 * 7;
      return t.timeout(end, "object");
    }
  };
};

var demo_pwd = function(data, fn, cls, flag = true) {
  var that = cls ? cls : demo;
  var name = that.options.prefix + "-login-pwd";
  var len = arguments.length > 1;
  var pwd = !!window.atob;
  data = { time: Date.now(), account: "", password: "", day: 7, ...data };
  if (flag && that.getUrlParam) {
    let id = that.getUrlParam("id") || "";
    name += id ? "-" + id : "";
  }
  var arr = that.$local.get(name, []);
  // 如果账号或密码为空 则获取
  if (!data.account || !data.password) {
    if (arr.length) {
      arr = arr.filter(function(k) {
        return 864e5 * k.day + k.st - Date.now() > 0;
      });
      that.$local.set(name, arr);
      arr = arr.map(function(k) {
        return {
          account: k.log,
          password: k.len,
          pwd: k.pwd
        };
      });
    }
    if (len) {
      fn({ code: 0, list: arr, name: name, pwd: pwd });
    }
    return arr;
  }
  var os = {
    log: data.account,
    len: data.password.replace(/./g, "*"),
    pwd: pwd ? btoa(data.password) : data.password, // atob
    st: data.time,
    day: data.day
  };
  if (arr.length) {
    arr = arr.filter(function(k) {
      return 864e5 * k.day + k.st - Date.now() > 0 && k.log !== os.log;
    });
    arr.unshift(os);
  } else {
    arr = [os];
  }
  that.$local.set(name, arr);
  arr = arr.map(function(k) {
    return {
      account: k.log,
      password: k.len,
      pwd: k.pwd
    };
  });
  if (len) {
    fn({ code: 1, list: arr, name: name, pwd: pwd });
  }
  os = null;
  return arr;
};
var demo_validate = function() {
  let rex = {
    phone: /^[1][3,4,5,7,8,9][0-9]{9}$/,
    email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    strength: /^(?=.*\d)(?=.*[a-z]).{6,18}$/, // 6-18 位 英文或数字
    zh: /^[\u4e00-\u9fa5]{0,}$/, // 中文
    w: /^\w+$/, // 数字、26 个英文字母或下划线
    decimal: /^\d+\.\d+$/, // 小数
    name: /^[\u4E00-\u9FA5]{2,4}$/, // 中文名字
    tel: /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/, // 电话 (座机/手机)
    d: /^\d+$/, // 正整数
    d2: /^-?\d+\.?\d{0,2}$/, // 保留两位小数
    url: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
  };

  let t = demo;
  if (t.version < "1.0.8") {
    t.$obj = function(a, c) {
      let r = t._is_obj(a);
      if (c) return r.code;
      return r;
    };
  }

  let is_null = val => {
    if (val === undefined || val === null) return !0;
    let v = (val + "").split(" ").join("");
    return v !== "";
  };

  // 必须是包含字母和数字的组合 upper 为 true 时 必须包含 大写。min,max 长度
  let is_password = (val, min, max, upper) => {
    min = min || 8;
    max = max || 16;
    let up = upper ? "(?=.*[A-Z])" : "";
    let abs = new RegExp(
      "^(?=.*\\d)(?=.*[a-z])" + up + ".{" + min + "," + max + "}$"
    );
    return abs.test(val);
  };

  // 身份证验证
  let is_card = val => {};

  // 银行卡验证
  let is_bank = val => {};

  // 长度验证
  let is_length = (val, min, max, fn) => {
    min = isNaN(min) ? 6 : min || 6;
    max = isNaN(max) ? 18 : max || 18;
    max = max < min ? min + 1 : max;
    let len = (val + "").length;
    if (len < min) {
      fn ? fn("长度不能小于" + min + "位", min, 0) : null;
      return !1;
    }
    if (len > max) {
      fn ? fn("长度不能大于" + max + "位", max, 0) : null;
      return !1;
    }
    fn ? fn("验证通过", len, 1) : null;
    return !0;
  };

  // 位数验证
  let is_num = (val, len, len2, fn) => {
    len = isNaN(len) ? 9 : len || 9;
    len2 = isNaN(len2) ? 2 : len2 || 2;

    if (len2 < 1) {
      let tst = new RegExp("^\\d{0," + len + "}$");
      return tst.test(val);
    }
    let ts2 = new RegExp("^-?\\d{0," + len + "}.?\\d{0," + len2 + "}$");
    return ts2.test(val);
  };

  // init 基础验证
  let init = function(val, type) {
    // 正则验证
    if (rex[type]) {
      return rex[type].test(val);
    }

    // 判断是否为空
    return is_null(val);
  };

  // input 实时验证
  let input = function(el, type, bool) {
    let dom = el;
    if (t.$obj(el, 1) === 3) {
      dom = t.js(el).dom();
    }
    let box = t.js(dom, 0);
    if (bool) {
      box.input(function(res) {
        let val = res.value;
        if (!init(val, type)) {
          res.value = val.substring(0, val.length - 1);
        }
      });
    } else {
      // input 离开验证
      box.attr("demo-validate-status", "");
      box.dom().onblur = function() {
        box.attr("demo-validate-status", init(this.value, type) ? "" : "error");
      };
    }
  };

  // 复杂验证
  let validate = {
    pwd: is_password,
    null: is_null,
    card: is_card,
    bank: is_bank,
    length: is_length,
    number: is_num
  };

  return {
    input,
    init,
    validate
  };
};
var demo_theme = function(type) {
  let lin = (c1, c2 = "#fff") => {
    return { linear: "linear-gradient(to right, " + c1 + ", " + c2 + ")" };
  };
  let c = (bgc, notice) => {
    return {
      bgc,
      notice
    };
  };
  let d = (...arg) => {
    let o = {};
    arg.forEach(s => {
      Object.assign(o, s);
    });
    return o;
  };
  let theme = {
    green: d(c("#99cc33", 1), lin("#99cc33", "#18bc9c")),
    blue: d(c("#229ffd", 0), lin("#229ffd", "#0873c3")),
    warning: d(c("#E6A23C", 1), lin("#E6A23C", "orange")),
    danger: d(c("#F56C6C", 1), lin("#F56C6C", "tomato"))
  };
  return theme[type] || theme.green;
};
var demo_worker = function() {};
var demo_xj = function() {
  let def = "purple";
  let themeArr = {
    purple: {
      color: ["#6943f2", "#ab95f1", "#c7b5f3"]
    },
    orange: {
      color: ["#ff5301", "#fb8639", "#f8b477"]
    },
    ed765e: { color: ["#ed765e", "#fea858"] },
    "9fa5d5": { color: ["#9fa5d5", "#e8f5c8"] },
    eebd89: { color: ["#eebd89", "#d13abd"] },
    a9f99e: { color: ["#a9f99e", "#45add5"] }
  };

  // 主题选择
  let theme = name => {
    let os = themeArr[name] || themeArr[def];
    if (!os.color.length) return os;
    let linear =
      "linear-gradient(45deg," +
      os.color[0] +
      "," +
      (os.color[2] || os.color[1]) +
      ")";
    let ret = {
      ...os,
      bgc: "background:" + os.color[0],
      linear,
      bgc_linear: "background:" + linear
    };
    return ret;
  };

  // 主题自定义
  let themepush = (name, obj = {}) => {
    if (themeArr[name]) return {};
    themeArr[name] = { color: [], ...obj };
    return theme(name);
  };

  return {
    theme,
    themepush
  };
};
let vc = null;
var siteConfig = () => {
  let params = demo.getUrl();
  if (typeof VConsole === "function") {
    let db = demo.$local.get("debug-page-status", "");
    if (+db === 1 || params.debug) {
      if (!vc) {
        vc = new VConsole();
      }
    }
  }
  // demo.options.ajaxUploadTimeout = 12e4
  // demo.options.ajaxTimeout = 2e4
  let _location = window.location;
  let sourceURL =
    location.origin.indexOf("local") > -1
      ? "http://127.0.0.5/500/"
      : _location.origin + "/500/";
  let iseditor = true;

  if (iseditor) {
    if (typeof tinymce === "object" && tinymce.init) {
    } else {
      let js = sourceURL + "tinymce/tinymce.js";
      demo.script(js, () => {});
    }
  }
  // 错误信息
  let errorinfo = (options = {}) => {
    let opt = {
      size: 2,
      url: sourceURL + "http/?type=error",
      user: {},
      ...options
    };
    let config = {};
    let arr = [];

    let post = (data = {}, callback, headers = {}) => {
      if (fetch && window.fetch) {
        if (sourceURL.indexOf("127.0") >= 0) return 0;
        fetch(opt.url, {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            ...headers
          }
        })
          .then(r => r.text())
          .then(e => {
            callback ? callback(e) : null;
          });
      }
    };

    let uploadinfo = callback => {
      post({ errorinfo: JSON.stringify(arr) }, r => {
        callback ? callback(r.data) : null;
        cleararr();
      });
    };

    let cleararr = () => {
      arr = [];
    };

    let setConfig = c => {
      let con = { ...config, ...c };
      config = JSON.parse(JSON.stringify(con));
    };
    let setMsg = data => {
      if (JSON.stringify(arr).length / 1024 > opt.size) {
        uploadinfo();
      } else {
        arr.push({
          ...data,
          use_author: config,
          use_timeout: Date.now(),
          use_type: "家长端"
        });
      }
    };

    if (opt.user) {
      setConfig(opt.user);
    }

    return {
      setConfig,
      setMsg,
      uploadinfo
    };
  };

  let menulevel = arr => {
    let k = {
      // forward_courtesy: 1000, // 转发
      // achievements: 1001, // 绩效积分
      // group: 1002, // 集团
      // finance: 1003, // 财务
      baby_photo_album: 1004, // 宝宝相册
      // baby_evaluation: 1005, // 宝宝测评
      // home_contact_book: 1006, // 家园联系册
      baby_online: 1007, // 宝贝在线
      home_education: 1008, // 家庭教育
      country_study: 1009, // 国学
      art_style: 10010, // 艺体中心
    };
    let d = JSON.parse(JSON.stringify(arr))
      .filter(s => {
        return +s.switch === 0;
      })
      .map(r => {
        return k[r.key];
      });
    let close =
      d.length > 0
        ? Object.values(k).filter(r => {
            return d.indexOf(r) < 0;
          })
        : [];

    return {
      open: d,
      close
    };
  };

  let text = {
    tag: (num, obj = {}) => {
      let arr = num.length ? num : [];
      let n = [
        { text: "点赞", icon: "like-o", type: "like" },
        { text: "删除", icon: "delete-o", type: "del", col: "danger" },
        { text: "取消点赞", icon: "like", type: "unlike" },
        { text: "下载", icon: "down", type: "down" },
        { text: "预览", icon: "eye-o", type: "view" },
        { text: "编辑", icon: "edit", type: "edit", col: "warning" },
        { text: "屏蔽", icon: "closed-eye", type: "out" },
        { text: "解除屏蔽", icon: "eye-o", type: "in" },
        { text: "评论", icon: "edit", type: "comment" },
        { text: "审核通过", icon: "success", type: "check", col: "primary" },
        { text: "反审核", icon: "cross", type: "nocheck", col: "info" },
        { text: "更改账户", icon: "card", type: "card", col: "warning" },
        { text: "解除绑定", icon: "cross", type: "crosscard", col: "danger" },
        { text: "拨打电话", icon: "phone-o", type: "tel" },
        { text: "点击入学", icon: "flower-o", type: "flower" },
        { text: "备注", icon: "label-o", type: "label" },
        { text: "加入相册", icon: "flower-o", type: "joinus" }
      ];
      let t = [];

      arr.forEach(k => {
        let os = { ...n[k], ...obj };
        t.push(os);
        os = null;
      });

      t = t.filter(r => {
        return !!r.text;
      });

      return JSON.parse(JSON.stringify(t));
    },
    emoji: [{ name: "2", count: 59, suffix: ".png", text: "" }]
  };

  let icon = (name, type, suffix = ".png") => {
    let path = "image/";
    switch (type) {
      case "index":
        path = "icon/o2/";
        break;
      case "emoji":
        path = "emoji/";
        break;
      default:
        path = "icon/" + type + "/";
    }
    return [sourceURL, path, name, suffix].join("");
  };

  let tel = tel => {
    let a = demo._div("a");
    a.setAttribute("href", "tel:" + tel);
    a.click();
    setTimeout(() => {
      a = null;
    }, 300);
  };

  return {
    errorinfo,
    menulevel,
    icon,
    tel,
    text
  };
};
const sdkerror = siteConfig(window.demo).errorinfo();

// window.addEventListener('error', (reason) => {
//   const { filename, message, error } = reason;
//   sdkerror.setMsg({ filename, message, error })
// })

let $md5 = window.md5;
window.md5 = str => {
  let d = (str = str.replace(/^\s+|\s+$/g, ""));
  return $md5(d);
};
