/**
 * ①添
 * @@新增 定义初始化菜单
 */
// import axios from 'axios'
import { getToken, localSave, localRead } from '@/libs/util'
// import config from '@/config'
import { lazyLoadingCop } from '@/libs/tools'
import { getMockMenuData } from '@/api/data'
import Main from '@/components/main' // Main 是架构组件，不在后台返回，在文件里单独引入
import parentView from '@/components/parent-view' // 获取组件的方法
import store from '@/store' // parentView 是二级架构组件，不在后台返回，在文件里单独引入
// eslint-disable-next-line no-unused-vars
const _import = require('@/router/_import_' + process.env.NODE_ENV)

var gotRouter
// 初始化路由
export const initRouter = () => {
  console.log('----------------开始初始化路由--------------------')
  if (!getToken()) {
    return
  }
  //  异步请求
  /*  axios.get(baseUrl+'/menuList',{
    header:{'Authorization':getToken()}
  }).then(res=>{
    var menuData=res.data.data;
    localSave('route',JSON.stringify(menuData));
    gotRouter=formatMenu(menuData);
    vm.$store.commit('updateMenuList',gotRouter);
  }); */
  var routerData
  if (!gotRouter) {
    getMockMenuData().then(res => {
      routerData = res.data // 后台拿到路由
      localSave('dynamicRouter', JSON.stringify(routerData)) // 存储路由到localStorage
      gotRouter = filterAsyncRouter(routerData) // 过滤路由,路由组件转换
      store.commit('updateMenuList', gotRouter)
      dynamicRouterAdd()
    })
  } else {
    gotRouter = dynamicRouterAdd()
  }
  return gotRouter
}

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  let dynamicRouter = []
  let data = localRead('dynamicRouter')
  console.log('从本地加载出来', data)
  if (!data) {
    return dynamicRouter
  }
  dynamicRouter = filterAsyncRouter(JSON.parse(data))

  return dynamicRouter
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = asyncRouterMap => {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Main') {
        // Main组件特殊处理
        route.component = Main
      } else if (route.component === 'parentView') {
        // parentView组件特殊处理
        route.component = parentView
      } else {
        // route.component = _import(route.component)
        route.component = lazyLoadingCop(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
