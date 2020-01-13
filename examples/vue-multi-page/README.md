最近用vue-cli搭建项目的时候，才发现cli已经更新到4了？不过搭建的步骤和3好像没有什么变化

### **1. 安装：**

Vue CLI 的包名称由 vue-cli 改成了 @vue/cli。 如果你已经全局安装了旧版本的 vue-cli (1.x 或 2.x)，你需要先卸载
 卸载： `npm uninstall vue-cli -g`  或  `yarn global remove vue-cli` 
 安装：   `npm install -g @vue/cli`  或者 `yarn global add @vue/cli`

### **2. 创建项目：**
（window系统最好通过cmd来执行命令，如果通过git bash，则不能通过↑↓来控制选择）

- 执行命令： `vue create '文件名'`
- 选择配置。有默认配置（default）和自定义配置（manually select features），我一般选择自定义配置（就当练手？）
- 通过移动↑↓来切换选项，通过空格来确认或取消选择。我选择了babel、router、vuex、css pre-processors
- 是否使用history模式的路由，我选No，因为history模式还需要服务器路由的设置，不然有时路由页面不见
- 选择你常用的css预处理器
- 如果有选择eslint，一般选择ESLint + Prettier，使用较多
- 如何存放配置：In dedicated config files（存放到独立文件中），In package.json（存放到 package.json 中）。我选择存放再package中
- 最后就是是否保存本次的配置了，N 不记录，如果选择 Y 需要输入保存名字

    

### **3. 多页面的配置：**

原理：当页面应用就是只有一个文件路口的应用；那同理，多页面应用，则入口有多个。所以我们只需要重新配置一下webpack配置，使其支持多入口即可
需要两步：1、新建多页面文件 2、配置vue.config.js

**新建多页面文件**

    刚创建好的文件结构：
    public
    ---favicon.ico
    ---index.html
    src
        ---App.vue
        ---main.js
        ----assets
        -------logo.png
        ----components
        -------HelloWorld.vue
        ----router
        -------index.js
        ----store
        -------index.js
        ----views
        --------About.vue
        --------Home.vue
    在src目录下新增pages文件夹,文件夹下面包含index和about文件，
    每个文件夹下面对应的都有html、js、vue文件，形成独立的完整的页面
    pages
    ----about
    --------about.html
    --------about.js（相当于mian.js）
    --------about.vue（相当于App.vue）
    --------
    --------router（路由文件）
    ------------index.js
    ------------
    --------store（vuex store 文件）
    ------------index.js
    ------------   
    ----index
    --------index.html
    --------index.js
    --------index.vue
    ------------
    --------router
    ------------index.js
    ------------
    --------store
    ------------index.js



**配置vue.config.js**

因为要构建多页面，所以需要重新配置webpack配置；但是，从vue-cli3开始，脚手架内部已经封装好了配置，没有了webpack.config.js，但vue-cli3提供了vue.config.js来覆盖webpack配置。所以，在根目录下新建vue.config.js文件，vue.config.js可配置选项有很多，可以查看配置文档 `https://cli.vuejs.org/zh/config/#vue-config-js`

**普通方式：**
文件内编写代码：
```
module.exports = {
  pages: {//配置多页面
    index: {
       entry: 'src/pages/index/index.js', // page 的入口
       template: 'src/pages/index/index.html', // 模板来源
       filename: 'index.html',// 在 dist 输出的文件名
       // 当使用 title 选项时，
       // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
       title: 'index Page',
       // 在这个页面中包含的块，默认情况下会包含
       // 提取出来的通用 chunk 和 vendor chunk。
       chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    about: {
       entry: 'src/pages/about/about.js',
       template: 'src/pages/about/about.html',
       filename: 'about.html',
       title: 'about Page',
       chunks: ['chunk-vendors', 'chunk-common', 'about']
    }
  }
}
```

**动态获取页面路径：**

```
cosnt path = require('path')
cosnt glob = require('glob')
//获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {},basename, tmp, pathname, appname;
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = basename; // 正确输出js和html的路径
    entries[pathname] = {
      entry:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[1]+'.js',
      template:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[2],
      filename:tmp[2],
      title: tmp[1],
      chunks: ['chunk-vendors', 'chunk-common', tmp[1]]
    };
  });
  return entries;            
}

let htmls = getEntry('./src/pages/**/*.html');
module.exports = {
  pages: htmls
}
```

通过getEntry来动态获取pages下面的文件，要比第一种方法方便的多。
到这里，多页面配置就已经完成了

### **4. vue.config.js其他常用配置**

**productionSourceMap** //是否生成source map 文件
**configureWebpack**  //配置自定义的webpack配置，比如压缩文件，优化性能
```
//对指定文件开启gzip文件压缩            
const CompressionWebpackPlugin = require('compression-webpack-plugin')
configureWebpack: config => {
  if (process.env.NODE_ENV === 'production') {//生产模式下开启gzip压缩
    config.plugins.push(new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,//匹配文件按
      threshold: 10240,//文件大于10k时压缩
      minRatio: 0.8,
      deleteOriginalAssets: false //是否删除源文件
    })
    )
  }
}
```
**chainWebpack**  //配置文件别名
```
cosnt path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)//设置绝对路径
}
chainWebpack: (config) => {
  config.resolve.alias
  .set('@', resolve('./src'))
  .set('components', resolve('./src/components'))
}
```


