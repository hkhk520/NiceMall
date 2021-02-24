import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存美丽说推荐的当前项
    currentRemm: null,
    // 判断是否从Home页面跳转的
    isHome: true,
    // 记录点击列表的次数
    clickListCount: 0,
    // 下拉加载更多
    loading: false,
    // 子分类的请求参数
    miniWallkey: null,
    // 请求类型
    type: 'pop',
    // 购物车每一条数据的id
    cartItemId: 0,
    // 订单每一条数据的id
    buyItemId: 0,
    // 每一条地址数据的id
    addressId: 0,
  },

  // 写同步的方法
  mutations: {
    // 改变当前的美丽说推荐项的方法
    changeCurrentRemm(state, payload) {
      state.currentRemm = payload;
    },
    // 切换是否从Home页面跳转的方法
    toggleIsHome(state,payload) {
      if(payload){
        state.isHome = payload;
      }else{
        state.isHome = !state.isHome;
      }
    },
    // 改变记录点击列表的次数
    changeClickListCount(state,payload) {
      state.clickListCount++;
      if(payload){
        state.clickListCount = 0;
      }
    },
    // 改变子分类的请求参数的方法
    changeMiniWallkey(state,payload){
      state.miniWallkey = payload;
    },
    changeType(state,payload){
      state.type = payload;
    },
    // 自增购物车的商品id
    changeCartItemId(state){
      state.cartItemId++; 
    },
    // 自增订单的商品id
    changeBuyItemId(state){
      state.buyItemId++; 
    },
    // 自增地址的id
    changeAddressId(state){
      state.addressId++; 
    }

  },

  // 写异步的方法
  actions: {
  },

  modules: {
  }
})
