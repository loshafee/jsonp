# jsonp
a ES6 jsonp module using promise

## Installation && Usage
### Browser
In a browser, you can use `jsonp-request` as follows:

    <script src='./lib/jsonp.js' charset='utf8'><script>

it also can be a AMD module while using require.js

### NodeJS

Install for node.js using `npm`

    npm install jsonp-request

Require module using `require`

    const jsonp = require('jsonp-request)


## Example 
Performing a jsonp request

    // Make a request using Baidu search fetch url https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=github&cb=jsonp

    jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su', {
        wd: 'github',
        jsonpCallback: 'cb'
    }).then((res) => {
        console.log(res)
    })

## API
jsonp(url, options)

* `url` (`String`) url to fetch
* `options` (`Object`), optional
    + `jsonpCallback` define the response function name(defaults to `callback`)

return a promise.

## Interceptors
You can intercept requests or response before they are handled by `then` or `catch`.
        
    //Add a request interceptor
    jsonp.interceptors.request.use((config) => {
        // Do something before request is send
        return config
    }, (error) => {
        // Do something with request error
        return Promise.reject(error)
    })

    //Add a response interceptor
    jsonp.interceptors.response.use((response) => {
        // Do something with response data
        return response
    }, (error) => {
        // Do something with response error
        return Promise.reject(error)
    })

If you may need to remove an interceptor later you can.

    var myInterceptor = jsonp.interceptors.request.use(() => {/*...*/})
    jsonp.interceptors.request.eject(myInterceptor)

## VUE plugin
The plugin for [Vue.js](https://vuejs.org/) provides services for making web requests and handle response using jsonp

    const Vue   = require('Vue')
    const jsonp = require('jsonp-request')
    Vue.prototype.$jsonp = jsonp

## Reference 
Promise based HTTP client for the browser and node.js [axios](https://github.com/axios/axios)

## License
MIT

