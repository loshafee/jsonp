# jsonp-request
返回Promise的jsonp模块，包括请求前以及响应后的统一处理。

## 安装与使用
### 浏览器
在浏览器中，使用 `jsonp-request` 模块如下:

    <script src='./lib/jsonp.js' charset='utf8'><script>

该模块 `jsonp-request` 也可以作为 `AMD` 模块使用

### NodeJS 环境

先使用 `npm` 安装该模块 `jsonp-request`

    npm install jsonp-request --save

引入模块 `require`

    const jsonp = require('jsonp-request)


## 例子 
发起一个 jsonp 请求。

    // 使用以下地址发起jsonp请求，该接口后端定义 https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=github&cb=jsonp

    jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su', {
        wd: 'github',
        jsonpCallback: 'cb'
    }).then((res) => {
        console.log(res)
    })

## API
jsonp(url, options)

* `url` (`String`) 请求 url 地址
* `options` (`Object`), 可选项
    + `jsonpCallback` 设置后端定义的回调函数键值对中的键(默认为 `callback`)

该接口返回一个promise对象，之后可以使用 `then` `catch`方法。

## 拦截器
在请求或响应被 `then` 或者 `catch` 处理前拦截它们。
        
    //添加请求拦截，可以在请求前处理某些操作，如加载前的加载动画
    jsonp.interceptors.request.use((config) => {
        // Do something before request is send
        return config
    }, (error) => {
        // Do something with request error
        return Promise.reject(error)
    })

    //添加响应拦截，响应后操作
    jsonp.interceptors.response.use((response) => {
        // Do something with response data
        return response
    }, (error) => {
        // Do something with response error
        return Promise.reject(error)
    })

移除拦截器如下：

    var myInterceptor = jsonp.interceptors.request.use(() => {/*...*/})
    jsonp.interceptors.request.eject(myInterceptor)

## Vue 插件
可以配合 [Vue.js](https://vuejs.org/) 使用，发起 `jsonp` 请求，`axios` 不支持jsonp

    const Vue   = require('Vue')
    const jsonp = require('jsonp-request')
    Vue.prototype.$jsonp = jsonp

## 参考 
参考 [axios](https://github.com/axios/axios) 拦截器实现

## License
MIT

