import * as express from 'express';

/**
 * 包装 router，使其所有注册的 handler 均可支持 async function
 */
export function wrapRouter(router: express.Router): express.Router;

/**
 * 包装 handler，使其支持 async function
 */
export function wrapHandler(handler: express.Handler, withErrorParam?: boolean = true): express.Router;
