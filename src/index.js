'use strict';

/**
 * async function for express.Router
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const methods = require('methods');

// 包装 router，使其所有注册的 handler 均可支持 async function
function wrapRouter(router) {
  // 所有的 HTTP 方法和一些特殊方法
  methods.concat([ 'use', 'all', 'param' ]).forEach(method => {
    if (typeof router[method] === 'function') {
      const originMethod = '__' + method;
      router[originMethod] = router[method].bind(router);
      router[method] = function (...handlers) {
        router[originMethod](...handlers.map(fn => wrapAsyncHandler(fn, method !== 'param')));
        return router;
      };
    }
  });
  // 如果有 route 方法则封装
  if (typeof router.route === 'function') {
    router.__route = router.route.bind(router);
    router.route = function (...args) {
      return wrapRouter(router.__route(...args));
    };
  }
  return router;
}

// 包装 handler，使其支持 async function
// 如果不是一个 function 则返回原来的值
function wrapAsyncHandler(fn, withErrorParam = true) {
  if (typeof fn !== 'function') return fn;
  if (withErrorParam && fn.length > 3) {
    // error handler
    // eslint-disable-next-line
    return function (err, req, res, next) {
      return callAndCatchPromiseError(fn, ...toArray(arguments));
    };
  }
  // eslint-disable-next-line
  return function (req, res, next) {
    return callAndCatchPromiseError(fn, ...toArray(arguments));
  };
}

// 调用 handler，并捕捉 Promise 的错误
function callAndCatchPromiseError(fn, ...args) {
  // args 最后一个参数如果是如果是 function 则表示 next()
  // 如果执行时出错，调用 next(err)
  const next = args[args.length - 1];
  let p = null;
  try {
    p = fn.apply(null, args);
  } catch (err) {
    return next(err);
  }
  if (p && p.then && p.catch) {
    p.catch(err => next(err));
  }
}

// 将 arguments 转成 array
function toArray(args) {
  return Array.prototype.slice.call(args);
}

exports.wrap = wrapRouter;
