import Stores from './_let'
export default {
  addCount({ commit, state }, num) {
    commit(Stores.add, num);
  },
  setFixed({ commit, state }, o) {
    commit(Stores.fixed, o)
  },
  setShare({ commit, state }, o) {
    commit(Stores.share, o)
  },
  setProgress({ commit, state }, o) {
    commit(Stores.progress, o)
  },
  setComment({ commit, state }, o) {
    commit(Stores.comment, o)
  },
  setTabbarStatus({ commit, state }, o) {
    commit(Stores.tabbarStatus, o)
  },
  setShareWx({ commit, state }, o) {
    commit(Stores.shareWx, o)
  },
}
