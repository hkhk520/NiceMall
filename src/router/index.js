import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/main",
    name: "Main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import('../views/Home.vue')
      },
      {
        path: "/classify",
        name: "Classify",
        component: () => import('../views/Classify.vue')
      },
      {
        path: "/cart",
        name: "Cart",
        component: () => import('../views/Cart.vue')
      },
      {
        path: "/me",
        name: "Me",
        component: () => import('../views/Me.vue')
      },
      
    ]
  },

  {
    path: "/remmlists",
    name: "RemmLists",
    component: () => import('../views/RemmLists.vue')
  },
  {
    path: "/beatydetail/:iid",
    name: "BeatyDetail",
    component: () => import('../views/BeatyDetail.vue')
  },
  {
    path: "/smallclassify",
    name: "SmallClassify",
    component: () => import('../views/SmallClassify.vue')
  },
  {
    path: "/like",
    name: "Like",
    component: () => import('../views/Like.vue')
  },
  {
    path: "/login",
    name: "Login",
    component: () => import('../views/Login.vue')
  },
  {
    path: "/selfpage",
    name: "SelfPage",
    component: () => import('../views/SelfPage.vue')
  },
  {
    path: "/secure",
    name: "Secure",
    component: () => import('../views/Secure.vue')
  },
  {
    path: "/pay",
    name: "Pay",
    component: () => import('../views/Pay.vue')
  },
  {
    path: '/newAddress',
    name: 'NewAddress',
    component: () => import('../views/NewAddress.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue')
  },
  {
    path: '/alladdress',
    name: 'AllAddress',
    component: () => import('../views/AllAddress.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },

  // 路由重定向到Home页面
  {
    path: "*",
    redirect: {
      name: "Home"
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
