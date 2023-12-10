let t = (name, title, type, val) => {
  return { name, type, title, val }
}

// star 3颗星
// is 异常 正常
// num 数量
// text 输入
// textarea 输入 textarea

let baby = {
  here: [
    t('emotion', '情绪', 'star', 3),
    t('morning', '早操', 'star', 3),
    t('exercise', '集体活动', 'star', 3),
    t('game', '区角游戏', 'star', 3),
    t('outdoor_activities', '户外活动', 'star', 3),
    t('dining', '午餐', 'star', 3),
    t('dessert', '午点', 'star', 3),
    t('water_intake', '饮水量', 'star', 3),
    t('wash', '盥洗', 'star', 3),
    t('noon_break', '午休', 'star', 3),
    t('qsw', '出汗量', 'text', '正常'),
    t('urine', '小便', 'text', '正常'),
    t('stool_frequency', '大便', 'num', ''),
    t('remarks', '备注', 'textarea', ''),
  ]
}

export default {
  baby
}
