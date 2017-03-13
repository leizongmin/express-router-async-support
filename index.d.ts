import { Router, RequestHandler, ErrorRequestHandler } from 'express';

/**
 * 包装 router，使其所有注册的 handler 均可支持 async function
 */
export function wrapRouter(router: Router): Router;

/**
 * 包装 handler，使其支持 async function
 */
export function wrapHandler(handler: RequestHandler | ErrorRequestHandler, withErrorParam?: boolean): Router;
