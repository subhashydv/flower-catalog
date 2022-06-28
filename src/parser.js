const parseSpace = value => {
  return value.replaceAll('+', ' ');
};

const parseQueryParams = queryString => {
  const queryParams = {};
  const params = queryString.split('&');
  params.forEach(param => {
    const [name, value] = param.split('=');
    queryParams[name] = parseSpace(value);
  });
  return queryParams;
};

const parseQuery = rawUri => {
  let queryParams = {};
  const [uri, queryString] = rawUri.split('?');
  if (queryString) {
    queryParams = parseQueryParams(queryString);
  }
  return { uri, ...queryParams };
};

const parseRequestLine = (line) => {
  const [method, rawUri, httpVersion] = line.split(' ');
  const uri = parseQuery(rawUri);
  return { method, ...uri, httpVersion };
};

const isValidHeader = (lines, index) =>
  index < lines.length && lines[index].length > 0;

const separateOnColon = element => {
  const colonIndex = element.indexOf(':');
  const firstPart = element.slice(0, colonIndex).trim();
  const secondPart = element.slice(colonIndex + 1).trim();
  return [firstPart, secondPart];
};

const parseHeader = lines => {
  const header = {};
  let index = 0;
  while (isValidHeader(lines, index)) {
    const [key, value] = separateOnColon(lines[index]);
    header[key.toLowerCase()] = value;
    index++;
  }
  return header;
};

const parseRequest = (request) => {
  const lines = request.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const header = parseHeader(lines.slice(1));
  return { ...requestLine, header };
};

module.exports = { parseRequestLine, parseRequest, parseHeader };
