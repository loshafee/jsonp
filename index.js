;(function (root) {
  /**
   * InterceptorManage, 代表一个拦截器，用于发起jsonp前及响应之后的统一操作
   * @constructor
   * @param {array} handlers - 存放数组
   */
  class InterceptorManager {
    constructor () {
      this.handlers = []
    }
    /**
     * 添加promise（resolve, reject）对象至数组
     * @param {function} fulfilled - promise resolve函数
     * @param {function} rejected - promise rejected函数
     * @return {number} id - 在handlers数组中的位置
     */
    use (fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      })
      return this.handlers.length - 1
    }
    /**
     * 通过id删除handlers中的项
     * @param {number} id - use函数返回的所在handlers的下标
     */
    eject (id) {
      if (this.handlers[id]) {
        this.handlers[id] = null
      }
    }
  }

  jsonp.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }

  /** 解析器parser
   * parser.toJSON() 将对象转换成字符串
   * parser.toObject() 将键值对字符串转换成数组
   */
  let parser = {
    /**
     * 将对象转换成特定字符串格式
     * @param {object} obj - 目标对象
     * @param {string} separator - 键值对之中的分隔符，默认为'='
     * @param {string} delimiter - 键值对连接的分隔符，默认为'&'
     * @example
     * // return a=1&b=2
     * parser.toJSON({a:1, b: 2})
     * // return a=1?b=2
     * parser.toJSON({a:1, b: 2}, undefined, '?')
     */
    toJSON (obj = {}, separator = '=', delimiter = '&') {
      let result = ''
      Object.entries(obj).forEach(([key, value], index) => {
        result += ((index === 0) ? '' : delimiter) + key + separator + value
      })
      return result
    },
    /**
     * 将键值对字符串转换成对象
     * @param {string} jsonstr - 要转换的键值对字符串
     * @param {*} separator - 键值对之中的分隔符，默认为'='
     * @param {*} delimiter - 键值对连接的分隔符，默认为'&'
     * @example
     * // return {a: '1', b: '2'}
     * parser.toObject('a=1&b=2')
     * // return {a: '1', b: '2'}
     * parser.toObject('a:1?b:2', ':', '?')
     */
    toObject (jsonstr, separator = '=', delimiter = '&') {
      if (typeof jsonstr !== 'string') {
        throw new Error('first parameter must be a string')
      }
      return jsonstr.split(delimiter).reduce((result, item) => {
        result[item.split(separator)[0]] = item.split(separator)[1]
        return result
      }, {})
    }
  }

  /**
   * promise 实现的jsonp函数
   * @param {string} url - jsonp 请求地址
   * @param {object} options - jsonp 请求参数对象，其中属性jsonpCallback 为函数名
   * @param {string} cb - jsonp接口所定义的回调函数名称
   */
  function jsonp (url, options = {jsonpCallback: 'callback'}) {
    let promise = Promise.resolve(options)
    let dispatchRequest = function () {
      /** 返回promise， 内部为传统jsonp的用法及代码 */
      return new Promise((resolve, reject) => {
        let s = document.createElement('script')
        let index = url.indexOf('?')
        if (index > -1) {
          Object.assign(options, parser.toObject(url.substring(index + 1)))
          url = url.substring(0, index)
        }
        let cName = 'jsonp' + Date.now()
        options[options['jsonpCallback']] = cName
        delete options['jsonpCallback']
        window[cName] = function (res) {
          resolve(res)
        }
        s.src = url + '?' + parser.toJSON(options)
        document.body.appendChild(s)
        s.remove()
        s.onerror = function (err) {
          reject(err)
        }
      })
    }
    let chain = [dispatchRequest, () => {}]
    jsonp.interceptors.request.handlers.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    jsonp.interceptors.response.handlers.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  /** 模块化封装 */
  if (typeof define !== undefined && define.amd) {
    define([], function () {
      return jsonp
    })
  } else if (typeof module !== undefined && module.exports) {
    module.exports = jsonp
  } else {
    root.jsonp = jsonp
  }
})(this)

