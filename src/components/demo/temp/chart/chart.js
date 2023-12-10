let colorArr = {
  'purple': {
    color: '#a48df7',
    text: '#414141',
    sub: '#959595',
    color2: '#ab95f1'
  },
  primary: {
    color: '#7dabff',
    text: '#414141',
    sub: '#959595',
    color2: '#9bbcf8'
  }
}

const remDetault = 37.5

const colors = (name) => {
  return colorArr[name] || colorArr.purple
}

// 样式转对象
function styleToObj(style) {
  function trim(str, isglobal) {
    var result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (isglobal && isglobal.toLowerCase() === 'g') {
      result = result.replace(/\s/g, '')
    }
    return result
  }
  if (!style || style === '') { return }
  var Arr = style.split(';')
  Arr = Arr.filter(item => {
    return item !== ''
  })
  let str = ''
  Arr.forEach(item => {
    let test = ''
    trim(item).split(':').forEach(item2 => {
      test += '"' + trim(item2) + '":'
    })
    str += test + ','
  })
  str = str.replace(/:,/g, ',')
  str = str.substring(0, str.lastIndexOf(','))
  str = '{' + str + '}'
  return JSON.parse(str)
}

const rem = (num) => {
  let n = document.getElementsByTagName('html')[0]
  let obj = styleToObj(n.getAttribute('style'))
  let size = obj['font-size'] || remDetault
  return (num / remDetault) * parseInt(size)
}

const pie = () => {
  return {}
}
const bar = (title, num, color) => {
  let c = colors(color)
  return {
    title: [{
      text: title,
      x: 'center',
      top: '52%',
      textStyle: {
        color: c.sub,
        fontSize: rem(12),
        fontWeight: '100',
      }
    }, {
      text: num + '%',
      x: 'center',
      top: '28%',
      textStyle: {
        fontSize: rem(13),
        color: c.text,
        fontFamily: 'Lato',
        foontWeight: '600',
      },
    }],
    polar: {
      radius: ['80%', '100%'],
      center: ['50%', '50%'],
    },
    angleAxis: {
      max: 100,
      show: false,
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,

      },
      axisTick: {
        show: false
      },
    },
    series: [
      {
        name: '',
        type: 'bar',
        roundCap: true,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(66, 66, 66, .2)',
        },
        data: [num],
        coordinateSystem: 'polar',
        itemStyle: {
          normal: {
            // eslint-disable-next-line
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: c.color
            }, {
              offset: 1,
              color: c.color2
            }]),
          }
        }

      },
    ]
  }
}

export default {
  pie, bar
}
