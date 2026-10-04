import proxy from "express-http-proxy";

export const injectProxyHeaders = (uri) => {
  return proxy(uri, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user?.userId) {
        proxyReqOpts.headers["X-User-Id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  });
};
