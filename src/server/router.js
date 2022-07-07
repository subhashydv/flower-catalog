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

const router = handlers => {
  return (req, res) => {
    const next = createChain(handlers);
    next(req, res);
  };
};

module.exports = { router };
