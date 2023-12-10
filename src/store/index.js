import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
  count: 0,
  fixed: {},
  share: {},
  progress: 0,
  comment: {},
  tabbarStatus: {},
  shareWx: 0
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
