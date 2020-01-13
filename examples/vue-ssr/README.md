## 大概的思路
### 入口：
#### 因为涉及到服务端渲染，所以需要增加服务端的入口。所以需要两个入口：client.js（浏览器端入口），server.js（服务端入口）
### 数据预绑定：
#### 利用mixin，拦截页面渲染完成之前，查看当前实例是否含有'asyncData'函数，如果含有就进行调用，并且传入你需要的对象比如(store,route)
### node渲染处理：
#### 通过node拦截所有的get请求，然后将获取到的路由地址，传给前台，然后使用router实例进行push

## 开始
### 创建项目
#### 通过vue-cli创建项目。如果不太清楚怎样创建， 可以阅读我上一篇文章 [基于vue-cli4的多页面配置](https://github.com/TYS2-2/Blog/issues/1)
### 改造项目
#### src目录下增加router.config.js（路由配置）、store.config.js（数据中心配置）、entry目录（渲染入口）、methods目录（存放公共方法）
```
//src/App.vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
```
```
//src/router.config.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import {routes} from './router/index'
//抛出为创建路由的方法，目的是为了避免状态单例，因为在node服务器中，组件一直存在，没有被销毁
export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes: [
      ...routes
    ]
  })
}
```
```
//src/store.config.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      data: 'this is store config store data'
    },
    mutations: {
      setData(state, payload) {
        state.data = payload
      }
    },
    actions:{
      changeData({commit}) {
        commit('setData', 'store changed data')
      }
    },
    modules: {
    }
  })
}
```
```
//src/mian.js
import Vue from 'vue'
import App from './App.vue'

import {createRouter} from './router.config'
import {createStore} from './store.config'
import './methods';

Vue.config.productionTip = false


import { sync } from 'vuex-router-sync';


export function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
```
```
//src/entry/client.js
import {createApp} from '../main'
const { app, router, store } = createApp()
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
//由于使用的路由懒加载，所以必须要等路由提前解析完异步组件，才能正确地调用组件中可能存在的路由钩子。
router.onReady(() => {
  app.$mount('#app')
})
```
```
//src/entry/server.js
import {createApp} from '../main'
export default context => {
  return new Promise((resolve, reject) => {
    const {app , router, store } = createApp(context.data)
    ////根据node传过来的路由 来调用router路由的指向
    router.push(context.url)
    router.onReady(() => {
      //获取当前路由匹配的组件数组
      const matchedComponents = router.getMatchedComponents()
      //长度为0就是没找到该路由所匹配的组件
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
```
```
//src/methods/index.js
import './mixin';
import Vue from 'vue';
import axios from 'axios';
Vue.prototype.http = axios;
```

```
//src/methods/mixin/index.js
import Vue from 'vue';
Vue.mixin({
  beforeMount() {
    const { asyncData } = this.$options
    if (asyncData) {
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      })
    }
  }
})

```
```
//src/router/index.js
const componentPath = (name='Home') => {
  return {
    component: () => import(`../views/${name}.vue`)
  }
}
export const routes = [
  {
    path: '/home',
    name: 'home',
    ...componentPath('Home')
  },
  {
    path: '/about',
    name: 'about',
    ...componentPath('About')
  }
]
```
```
```
#### 根目录下新增vue.config.js（扩展webpack配置）、nodeScript目录（用于node执行）、bin目录（用于命令启动）
```
//bin/index.js
const npm = require('npm');
const bs = require('browser-sync').create();
const chokidar = require('chokidar');
const child_process = require('child_process')
var num = 0;//计数

function directives(commond,cb){
  npm.load(function(){
    npm.commands.cache(['clean'], function(){
      npm.commands.run([commond],cb);
    })
  })
}
function dev(cb){
  return directives('dev',function(){
    cb && cb();
  })
}
//监听源码函数
function soundCode(cb){
  console.log(`${num+=1}.chokidar开始监听src&public下的文件`)
  const watcher = chokidar.watch(['src/**/*.*','public/**/*.*'])
  watcher.on('all', (event, path) => {
    if(event ==='change'){
      console.log('\033[40;31m '+path+'源码发生修改，进行编译,请稍后');
      child_process.exec('npm run dev',function(error, stdout, stderr){
        if (error) {
          console.log(error.stack);
          console.log('Error code: '+error.code);
          console.log('Signal received: '+error.signal);
        }
        console.log(stdout);
        console.log('编译完成');
      })
    }
  });
  console.log('\033[40;32m 源码监听完成');
}

//监听distDev下的文件 编译后的代码
function compileCompleteCode(cb){
  console.log(`${num+=1}.chokidar开始监听distDev下的文件`);
  //该文件产生变化时 说明构建已完成。
  const watcher = chokidar.watch('distDev/**/*.js');
  watcher.on('all', (event, path)  => {
    if(event === 'change'){
      console.log(path+'发生变化，开始进行热更新');
      bs.reload(path);
      console.log('热更新已完成');
    }
  });
  console.log('\033[40;32m 编译后的代码监听完成');
}

console.log(`${num+=1}.进行本地编译`);
dev(function(){
  console.log("\033[40;31m 编译完成")
  soundCode()
  compileCompleteCode()
  console.log(`${num+=1}开启node服务`)
  directives('devServer');
  console.log(`${num+=1}开启browserSync代理服务`);
  bs.init({
    proxy: 'http://localhost:8080',
    open: false
  });
});
```
```
//nodeScript/index.js
const app = require('./server');
app.listen(8080, () => {
  console.log('\033[42;37m DONE \033[40;33m localhost:8080 服务已启动\033[0m')
})

// 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
// 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
```
```
//nodeScript/server.js
const fs = require('fs');
const { resolve } = require('path');
const express = require('express');
const app = express();
const { createBundleRenderer } = require('vue-server-renderer')
const pathDir = process.env.NODE_ENV === 'development' ? '../distDev' : '../dist';
//模板地址
const templatePath = resolve(__dirname, '../public/index.nodeTemplate.html')
//客户端渲染清单
const clientManifest = require(pathDir+'/vue-ssr-client-manifest.json')
//服务端渲染清单
const bundle = require(pathDir+'/vue-ssr-server-bundle.json')
//读取模板
const template = fs.readFileSync(templatePath, 'utf-8')
const renderer = createBundleRenderer(bundle,{
  template,
  clientManifest,
  runInNewContext: false
})
//请求静态资源相关配置
app.use('/js', express.static(resolve(__dirname, pathDir+'/js')))
app.use('/css', express.static(resolve(__dirname, pathDir+'/css')))
app.use('/font', express.static(resolve(__dirname, pathDir+'/font')))
app.use('/img', express.static(resolve(__dirname, pathDir+'/img')))
app.use('*.ico', express.static(resolve(__dirname, pathDir)))


//路由请求
app.get('*', (req, res) => {
  res.setHeader("Content-Type", "text/html")
  //传入路由 src/entry/server.js会接收到  使用vueRouter实例进行push
  const context = { url: req.url }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      } else {
        res.status(500).end('500 | 服务器错误');
        console.error(`${req.url}: 渲染错误 `);
        console.error(err)
      }
    }
    res.status(context.HTTPStatus || 200)
    res.send(html)
  })
})
module.exports = app;
```
```
//public/index.nodeTemplate.html
//服务端渲染模板
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=2.0">
  <title>vue-ssr</title>
</head>
<body>
  <!--vue-ssr-outlet-->
</body>
</html>
```

#### 最后package.json
```
{
  "name": "vue-ssr-6",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "cross-env NODE_ENV=development npm run devBuild",
    "devServer": "cross-env NODE_ENV=development node nodeScript/index",
    "devBuild": "cross-env VUE_NODE=node vue-cli-service build --no-clean --silent && npm run build:client",
    "build": " npm run build:server  && npm run build:client ",
    "build:client": "vue-cli-service build --no-clean --silent",
    "build:server": "cross-env VUE_NODE=node vue-cli-service build --silent",
    "start": " node bin/index",
    "start:server": "cross-env NODE_ENV=production nodemon  nodeScript/index",
    "pm2": " cross-env NODE_ENV=production pm2 start  nodeScript/index.js --watch"
  },
  "dependencies": {
    "core-js": "^3.4.3",
    "vue": "^2.6.10",
    "vue-router": "^3.1.3",
    "vuex": "^3.1.2",
    "cross-env": "^5.2.0",
    "mddir": "^1.1.1",
    "npm": "^6.13.4"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.1.0",
    "@vue/cli-plugin-router": "^4.1.0",
    "@vue/cli-plugin-vuex": "^4.1.0",
    "@vue/cli-service": "^4.1.0",
    "vue-template-compiler": "^2.6.10",
    "browser-sync": "^2.26.3",
    "http-proxy-middleware": "^0.19.1",
    "lodash.merge": "^4.6.1",
    "npm-run-all": "^4.1.5",
    "vue-server-renderer": "^2.5.22",
    "vuex-router-sync": "^5.0.0",
    "webpack-node-externals": "^1.7.2"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
}
```