import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import { 
  Button,
  Tabbar,
  TabbarItem,
  NoticeBar,
  Search,
  Swipe,
  SwipeItem,
  Lazyload,
  Grid, 
  GridItem,
  Image as VanImage,
  Toast,
  NavBar,
  List,
  Popup,
  ImagePreview,
  Tab,
  Tabs,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  TreeSelect,
  Empty,
  Checkbox, 
  CheckboxGroup,
  Card,
  SubmitBar,
  Stepper,
  Icon,
  Dialog,
  Form,
  Field,
  Cell, 
  CellGroup,
  Divider,
  AddressList,
  AddressEdit,
  Sticky,
 } from 'vant';

Vue.use(Button)
  .use(Tabbar)
  .use(TabbarItem)
  .use(NoticeBar)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Grid)
  .use(GridItem)
  .use(VanImage)
  .use(Toast)
  .use(NavBar)
  .use(List)
  .use(Popup)
  .use(ImagePreview)
  .use(Tab)
  .use(Tabs)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(TreeSelect)
  .use(Empty)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Card)
  .use(SubmitBar)
  .use(Stepper)
  .use(Icon)
  .use(Dialog)
  .use(Form)
  .use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Divider)
  .use(AddressList)
  .use(AddressEdit)
  .use(Sticky)


// 在Vue原型中添加appkey
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
// 添加2个请求路径
// Vue.prototype.coffee = "http://www.kangliuyong.com:10002"  // 咖啡的
Vue.prototype.beauty = "http://106.54.54.237:8000/api/mn" // 美丽说的
// Vue.prototype.beauty = "http://api.kele8.cn/agent/106.54.54.237:8000/api/mn" // 美丽说的

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
