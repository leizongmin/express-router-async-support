import * as express from 'express';

interface WrapAsyncRouter {
  /**
   * 包装 router，使其所有注册的 handler 均可支持 async function
   */
  (router: express.Router): express.Router;
}

export var wrap: WrapAsyncRouter;
