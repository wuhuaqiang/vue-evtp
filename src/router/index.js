import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }// ,
  /* {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }*/
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/fabricConfig',
    component: Layout,
    redirect: '/table/fabric-config',
    name: 'FabricConfig',
    meta: {
      title: '区块链配置',
      icon: 'table'
    },
    children: [
      {
        path: 'fabric-user',
        component: () => import('@/views/table/fabric-user'),
        name: 'FabricUser',
        meta: { title: '用户管理' }
      },
      {
        path: 'fabric-config',
        component: () => import('@/views/table/fabric-config'),
        name: 'FabricConfig',
        meta: { title: '参数配置' }
      },
      {
        path: 'fabric-orderer',
        component: () => import('@/views/table/fabric-orderer'),
        name: 'FabricOrderer',
        meta: { title: '排序服务配置' }
      },
      {
        path: 'fabric-peer',
        component: () => import('@/views/table/fabric-peer'),
        name: 'FabricPeer',
        meta: { title: '节点配置' }
      }
    ]
  },
  {
    path: '/fabricMsg',
    component: Layout,
    redirect: '/table/fabric-msg',
    name: 'FabricMsg',
    meta: {
      title: '区块链管理',
      icon: 'international'
    },
    children: [
      {
        path: 'fabric-chainblock',
        component: () => import('@/views/table/fabric-chainblock'),
        name: 'FabricChainblock',
        meta: { title: '区块管理' }
      },
      {
        path: 'fabric-chainchannel',
        component: () => import('@/views/table/fabric-chainchannel'),
        name: 'FabricChainchannel',
        meta: { title: '通道管理' }
      },
      {
        path: 'fabric-chaincode',
        component: () => import('@/views/table/fabric-chaincode'),
        name: 'FabricChaincode',
        meta: { title: '链码管理' }
      }
    ]
  },
  {
    path: '/sell',
    component: Layout,
    redirect: '/sell/sell-list',
    name: 'SellList',
    meta: {
      title: '商品列表',
      icon: 'international'
    },
    children: [
      {
        path: 'car-list',
        component: () => import('@/views/car/car-list'),
        name: 'CarList',
        meta: { title: '汽车列表' }
      },
      {
        path: 'power-list',
        component: () => import('@/views/car/power-list'),
        name: 'PowerList',
        meta: { title: '电量列表' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
