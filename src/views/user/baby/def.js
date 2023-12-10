const detail = (e = {}) => {
  let i = e.baby_files || {}
  let rx = ['', '小学', '初中', '高中', '大专', '大学本科', '研究生', '其他']
  let blood = ["A", "B", "O", "AB"].map((a, v) => {
    return { n: a + "型", id: v + 1 };
  })
  let b = (e.baby_family_members || []).map(r => {
    return {
      members_name: r.members_name || "", // 接送人姓名
      degree: r.degree || "", // 接送人学历(1：小学 2：初中 3：高中: 4：大专 5：大学本科: 6：研究生')
      id_card_no: r.id_card_no || "", // 身份证号码
      number: r.number || "", // 联系电话
      employer: r.employer || "", // 工作单位
      filiation: r.filiation || "", // 关系
      degrees: rx[+r.degree]
    }
  })
  let c = (e.baby_transfer_person || []).map(r => {
    return {
      pick_up_person: r.pick_up_person || "", // 接送人姓名
      id_type: r.id_type || "", // 证件类型
      id_no: r.id_no || "", // 身份证号码
      contact_number: r.contact_number || "", // 联系电话
      relationship: r.relationship || "", // 与幼儿关系
    }
  })
  let d = {
    members_name: "", // 接送人姓名
    degree: "", // 接送人学历(1：小学 2：初中 3：高中: 4：大专 5：大学本科: 6：研究生')
    id_card_no: "", // 身份证号码
    number: "", // 联系电话
    employer: "", // 工作单位
    filiation: "", // 关系
    degrees: ''
  }
  let f = {
    pick_up_person: "", // 接送人姓名
    id_type: "", // 证件类型
    id_no: "", // 身份证号码
    contact_number: "", // 联系电话
    relationship: "", // 与幼儿关系
  }
  return {
    id: e.id || '',
    no: e.no || '',
    logo: e.base_maps || '',
    image: e.base_map || '',
    name: e.name,
    parent_name: e.parent_name || '',
    contact: e.contact || '',
    dangan_imgs: (e.dangan_imgs || []).map((url, v) => {
      let p = (e.dangan_img || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    householders: (i.householders || []).map((url, v) => {
      let p = (i.householder || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    hukou_babys: (i.hukou_babys || []).map((url, v) => {
      let p = (i.hukou_baby || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    dad_pages: (i.dad_pages || []).map((url, v) => {
      let p = (i.dad_page || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    mom_pages: (i.mom_pages || []).map((url, v) => {
      let p = (i.mom_page || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    inoculums: (i.inoculums || []).map((url, v) => {
      let p = (i.inoculum || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    familys: (i.familys || []).map((url, v) => {
      let p = (i.family || '').split(',').filter(s => { return s })
      return { url, path: p[v] }
    }),
    familyData: d,
    transferData: f,
    blood,
    degrees: rx.map((x, y) => {
      return { name: x, value: y }
    }).filter(s => {
      return s.name
    }),
    addressId: [e.now_province, e.now_city, e.now_area],
    child: {
      name: e.name || "", // 宝宝姓名
      en_name: e.en_name || "", // 英文名
      hobby: e.hobby || "", // 兴趣爱好
      gender: e.genders || "1", // 性别 1男2女
      birthday: e.birthday || "", // 出生日期
      id_card: e.id_card || "", // 身份证
      nation: e.nation || "", // 国籍
      religion: e.religion || "", // 宗教
      ethnic: e.ethnic || "", // 民族
      now_province: e.now_province || "", // 现住省
      now_city: e.now_city || "", // 现住市
      now_area: e.now_area || "", // 现住区县
      now_detail: e.now_detail || "", // 现住详细地址
      dangan_img: e.dangan_img || "", // 档案图片【多图，逗号隔开】
    },
    baby_files: {
      blood_type: i.blood_type || "", // 血型 ['','A','B','O','AB'] [1-4]
      enrollment_data: i.enrollment_data || "", // 入园日期
      height: i.height || "", // 身高
      weight: i.weight || "", // 体重
      only_child_or_not: i.only_child_or_not || "1", // 是否独生子女  1是 2否
      febrile_convulsion_history: i.febrile_convulsion_history || "2", // 有无高热惊厥史 1:有 2否
      disabled_or_not: i.disabled_or_not || "2", // 是否残疾幼儿
      congenital_disability_history: i.congenital_disability_history || "2", // 有无先天性疾病 1有 2无
      allergic_history: i.allergic_history || "2", // 有无过敏史（过敏源） 1有 2无
      householder: i.householder || "", // 户口本（户主）图片
      hukou_baby: i.hukou_baby || "", // 户口宝宝页 图片
      dad_page: i.dad_page || "", // 户口（爸爸页）图片
      mom_page: i.mom_page || "", // 户口（妈妈页）图片
      inoculum: i.inoculum || "", // 接种本【必填】 图片
      family: i.family || '', // 家庭合影
    },
    baby_family_members: b.length ? b : [d],
    baby_transfer_person: c.length ? c : [f],
  }
}

export default detail
