// const home = {
//   //开启命名空间
//   namespaced: true,
//   //ssr注意事项 state 必须为函数
//   state: () => ({
//       homeData:'homeData ================ '
//   }),
//   mutations: {
//   },
//   actions: {
//   }
// }
// export default home

export default {
  namespaced: true,
  state: () => ({
    homeData: 'home data ============ '
  }),
  mutations: {
    set_homeData: state => state.homeData = '000000000000000'
  },
  actions: {
    dispatch_homeData: ({commit}) => commit('set_homeData')
  }
}