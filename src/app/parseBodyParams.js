const bodyParams = req => {
  const queryParams = {};
  const entries = req.entries();
  for (const entry of entries) {
    queryParams[entry[0]] = entry[1];
  }
  // queryParams.timeStamp = getTimeStamp();

  return queryParams;
};

const parseBodyParams = (req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => data += chunk);

  req.on('end', () => {
    req.bodyParams = bodyParams(new URLSearchParams(data));
    next(req, res);
  });
};

module.exports = { parseBodyParams };
