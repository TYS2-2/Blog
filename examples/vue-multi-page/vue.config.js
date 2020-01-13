let path = require('path')
let glob = require('glob')
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
    let entries = {},
        basename, tmp, pathname, appname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        // console.log(entry)
        tmp = entry.split('/').splice(-3);
        console.log(tmp)
        pathname = basename; // 正确输出js和html的路径
        
        // console.log(pathname)
        entries[pathname] = {
            entry:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[1]+'.js',
            template:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[2],
            filename:tmp[2],
            title: tmp[1],
            chunks: ['chunk-vendors', 'chunk-common', tmp[1]]
        };
    });
    console.log(entries)
    return entries;
    
}

let htmls = getEntry('./src/pages/**/*.html');

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'png']

function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}


module.exports = {
    pages: {
        index: {
            entry: 'src/pages/index/index.js',
            template: 'src/pages/index/index.html',
            filename: 'index.html',
            title: 'Index Page',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        about: {
            entry: 'src/pages/about/about.js',
            template: 'src/pages/about/about.html',
            filename: 'about.html',
            title: 'about Page',
            chunks: ['chunk-vendors', 'chunk-common', 'about']
        }
    },
    pages: htmls,
    productionSourceMap: false,
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 1024,
                minRatio: 0.8,
                // deleteOriginalAssets: true
              })
            )
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('./src'))
    }
}

