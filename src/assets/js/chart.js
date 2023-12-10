let pie = function (data, title) {
  let item = data
  let option = {
    backgroundColor: '#fff',
    color: ['#99CC33', '#FFCC00', '#63AEFF', '#DCDCDC'],
    title: [{
      text: '满员比\n' + title,
      top: '32%',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#999',
      }
    }],
    legend: {
      type: 'plain',
      icon: 'circle',
      bottom: 20,
      // orient: 'vertical',
      itemWidth: 20,
      itemHeight: 12,
      textStyle: {
        rich: {
          name: {
            fontSize: 14
          },
          value: {
            fontSize: 16,
          },
          unit: {
            fontSize: 12
          }
        }
      },
      formatter: function (name) {
        let res = item.filter(v => v.name === name);
        res = res[0] || {};
        let unit = res.unit || '';
        return '{name|' + name + '}  {value|' + res.value + '}{unit|' + unit + '}'
      }
      // data: legendName
    },
    series: [{
      type: 'pie',
      radius: ['40%', '50%'],
      center: ['50%', '40%'],
      data: item,
      stillShowZeroSum: false,
      label: {
        show: false
      },
      hoverAnimation: false
    }, {
      type: 'pie',
      radius: ['32%', '40%'],
      center: ['50%', '40%'],
      data: item,
      stillShowZeroSum: false,
      label: {
        show: false
      },
      hoverAnimation: false,
      itemStyle: {
        opacity: 0.2
      }
    }]
  };
  return option
}

let bar = function (data, name, type, color) {
  let max = 100
  let data2 = []
  if (type >= 4) {
    data = data.map(s => {
      s.value = s.chain
      return s
    })
    if ([2, 3, 4, 7].indexOf(type - 3) >= 0) {
      data2 = data.map(s => {
        return { name: s.name, value: s.deploy, company: s.company }
      })
    }
  }
  let xData = data.map(s => {
    let month = s.name.split('-')
    month = +month[1] || s.name
    return month + '月'
  })
  let opt = {
    backgroundColor: '#fff',
    xAxis: {
      nameLocation: 'start',
      nameTextStyle: {
        color: '#333', verticalAlign: 'top'
      },
      data: xData,
      axisLine: {
        lineStyle: {
          color: color
        }
      },
      axisLabel: {
        color: color,
        fontSize: 14
      },
      min: 0
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: color
        }
      },
      axisLabel: {
        color: color,
        fontSize: 14
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(24,188,156,0.1)'
        }
      },
      interval: max || 100,
    },
    grid: {
      left: "15%", // 距离左边的距离
      right: "10%", // 距离右边的距离
      bottom: "10%", // 距离下边的距离
      top: "10%" // 距离上边的距离
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: data.length > 15 ? 15 : 100
    }],
    series: [{
      type: 'bar',
      barWidth: 22,
      itemStyle: {
        normal: {
          // eslint-disable-next-line
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: color
          }, {
            offset: 1,
            color: 'rgba(255,255,255,0)'
          }], false),
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      label: {
        normal: {
          show: true,
          fontSize: 12,
          color: color,
          position: 'top',
          formatter: (e) => {
            let n = e.data.company
            if (!n) {
              if (+type === 3) {
                n = '%'
              } else if ([1, 2].indexOf(+type) >= 0) {
                n = '人'
              } else if ([5, 6, 7, 10].indexOf(+type) >= 0) {
                n = ''
              } else {
                n = '元'
              }
            }
            return e.data.value + n
          }
        }
      },
      data: data
    }]
  }
  if (data2.length) {
    opt.series.push({
      type: 'bar',
      data: data2,
      barWidth: 22,
      barGap: '-100%',
      itemStyle: {
        normal: {
          // eslint-disable-next-line
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: color
          }, {
            offset: 1,
            color: 'rgba(255,255,255,0)'
          }], false),
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      label: {
        normal: {
          show: true,
          fontSize: 12,
          color: color,
          position: 'top',
          formatter: (e) => {
            return e.data.value + e.data.company
          }
        }
      },
    })
  }
  return opt
}

let line = (data, color) => {
  let xData = data.map(s => {
    return s.name
  })
  let yData = data.map(s => { // +
    return s.reward
  })
  let yData2 = data.map(s => { // -
    return s.deduction
  })
  let yData3 = data.map(s => {
    return s.achievements
  })
  let series = []
  let arr = [yData, yData2, yData3]
  arr.forEach((s, v) => {
    series.push(
      {
        type: 'line',
        itemStyle: {
          normal: {
            color: color[v] || '#3A84FF',
            lineStyle: {
              color: color[v] || '#3A84FF',
              width: 1,
            },
            areaStyle: {
              // eslint-disable-next-line
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(58,132,255,0)',
                },
                {
                  offset: 1,
                  color: color[v] || 'rgba(58,132,255,0.35)',
                },
              ]),
            },
          },
        },
        data: s,
      }
    )
  })
  let opt = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '5%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#1B253A',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 12,
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#E5E9ED',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E5E9ED',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        splitNumber: 5,
        axisLabel: {
          textStyle: {
            color: '#a8aab0',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E5E9ED',
          },
        },
      },
    ],
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: data.length > 15 ? 50 : 100
    }],
    series,
  }
  return opt
}

export default {
  pie,
  bar,
  line
}
