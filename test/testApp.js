const request = require('supertest');
const { app } = require('../src/app.js');

describe('GET /', () => {
  const config = {
    publicDir: 'public'
  }

  it('Should give 200 on GET /', done => {
    request((req, res) => app(config).handle(req, res))
      .get('/')
      .expect('content-type', 'text/html')
      .expect('content-length', '1037')
      .expect(/<h3 class="heading">Flower Catalog/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /abeliophyllum.html', done => {
    request((req, res) => app(config).handle(req, res))
      .get('/abeliophyllum.html')
      .expect('content-type', 'text/html')
      .expect('content-length', '1476')
      .expect(/Abeliophyllum/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /agerantum.html', done => {
    request((req, res) => app(config).handle(req, res))
      .get('/agerantum.html')
      .expect('content-type', 'text/html')
      .expect('content-length', '1301')
      .expect(/Ageratum,/)
      .expect(200, done)
  });
});

describe('GET /login', () => {
  it('Should respond with 200 on GET /login', done => {
    const config = {
      publicDir: 'public'
    };
    request((req, res) => app(config).handle(req, res))
      .get('/login')
      .expect('content-type', 'text/html')
      .expect('')
      .expect(200, done)
  });

  it('Should redirect on guestbook if already logged in', done => {
    const config = {};
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } };

    request((req, res) => app(config, sessions, userData).handle(req, res))
      .get('/login')
      .set('cookie', ['id=1'])
      .expect('location', '/guestbook')
      .expect(302, done)
  });
});

describe('POST /login', () => {
  it('Should create session and logged in', done => {
    const config = {};
    const userData = { swap: { user: 'swap' } };
    request((req, res) => app(config, {}, userData).handle(req, res))
      .post('/login')
      .send('user=swap')
      .expect('set-cookie', /id=/)
      .expect('location', '/guestbook')
      .expect(302, done)
  });

  it('Should redirect on signup page if session is not present', done => {
    const config = {};
    request((req, res) => app(config).handle(req, res))
      .post('/login')
      .send('user=vivek')
      .expect('location', '/signup-page')
      .expect(302, done)
  });
});

describe('GET /guestbook', () => {
  it('Should show the guestbook', done => {
    const config = {
      comments: [{ name: 'swap', comment: 'hello', timeStamp: 'Thu Jul 07 2022 10:7' }]
    };
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } }
    request((req, res) => app(config, sessions, userData).handle(req, res))
      .get('/guestbook')
      .set('cookie', ['id=1'])
      .expect('content-type', 'text/html')
      .expect('content-length', '1026')
      .expect(/hello/)
      .expect(200, done)
  });

  it('Should redirect to login page if user is not logged in', done => {
    const config = {};

    request((req, res) => app(config).handle(req, res))
      .get('/guestbook')
      .expect('content-length', '24')
      .expect('redirected to login page')
      .expect(302, done)
  });
});

describe('POST /guestbook', () => {
  it('Should persist new comments', done => {
    const config = {
      comments: [],
      persist: x => x
    }
    request((req, res) => app(config).handle(req, res))
      .post('/guestbook')
      .send('user=swap&comment=hello')
      .expect('content-type', 'Application/json')
      .expect('content-length', '71')
      .expect(200, done)
  });
});