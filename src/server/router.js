const createChain = handlers => {
  let index = -1;
  const createNextHandler = (req, res) => {
    index++;
    const currentHandler = handlers[index];
    if (currentHandler) {
      currentHandler(req, res, () => createNextHandler(req, res));
    }
  }

  return createNextHandler;
};

const createRouter = handlers => {
  return (req, res) => {
    const next = createChain(handlers);
    next(req, res);
  };
};

const isGet = req => req.method === 'GET';

class Router {
  constructor() {
    this.handler = {
      get: {},
      post: {},
    };
    this.middleWare = [];
    this.defaultHandler = [];
  }

  get(path, handler) {
    this.handler.get[path] = handler;
  }

  post(path, handler) {
    this.handler.post[path] = handler;
  }

  addMiddleWare(handler) {
    this.middleWare.push(handler);
  }

  default(handler) {
    this.defaultHandler.push(handler);
  }

  handle(req, res) {
    const path = req.url;

    const handler = isGet(req) ? this.handler.get[path] : this.handler.post[path];
    let handlers = [...this.middleWare];
    if (handler) {
      handlers.push(handler);
    }
    handlers = [...handlers, ...this.defaultHandler];
    return createRouter(handlers)(req, res);
  }
};

module.exports = { Router };
