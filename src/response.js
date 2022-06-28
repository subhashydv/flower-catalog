const EOL = '\r\n';
const errMessage = {
  '200': 'ok',
  '400': 'file not found',
  '302': 'temporary redirect'
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  setHeader(key, value) {
    this.#headers[key] = value;
  }

  #writeHeaders() {
    const header = Object.entries(this.#headers);
    header.forEach(([key, value]) => {
      this.#write(`${key}: ${value}${EOL}`);
    });
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  #write(content) {
    this.#socket.write(content);
  }

  #response() {
    const version = 'HTTP/1.1';
    const message = errMessage[this.#statusCode];
    return `${version} ${this.#statusCode} ${message}${EOL}`;
  }

  send(body) {
    this.setHeader('content-length', body.length);

    this.#write(this.#response());
    this.#writeHeaders();
    this.#write(EOL);
    this.#write(body);
    this.#socket.end();
  }
}

exports.Response = Response;
