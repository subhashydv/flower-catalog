const request = require('supertest');
const { app } = require('../src/app.js');

describe('GET /', () => {
  const config = {
    sessions: {},
    userCred: { swap: { user: 'swapnil' } },
    publicDir: 'public',
  }

  it('Should give 200 on GET /', done => {
    request(app(config))
      .get('/')
      .expect('content-type', 'text/html')
      .expect('content-length', '1037')
      .expect(/<h3 class="heading">Flower Catalog/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /abeliophyllum.html', done => {
    request(app(config))
      .get('/abeliophyllum.html')
      .expect('content-type', 'text/html')
      .expect('content-length', '1476')
      .expect(/Abeliophyllum/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /agerantum.html', done => {
    request(app(config))
      .get('/agerantum.html')
      .expect('content-type', 'text/html')
      .expect('content-length', '1301')
      .expect(/Ageratum,/)
      .expect(200, done)
  });

});