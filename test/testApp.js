const fs = require('fs');
const request = require('supertest');
const { app } = require('../src/app.js');

describe('GET /', () => {
  const config = {
    publicDir: 'public'
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

describe('GET /login', () => {
  it('Should respond with 200 on GET /login', done => {
    const config = {
      publicDir: 'public'
    };
    request(app(config))
      .get('/login')
      .expect('content-type', 'text/html')
      .expect('')
      .expect(200, done)
  });

  it('Should redirect on guestbook if already logged in', done => {
    const config = {};
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } };

    request(app(config, sessions, userData))
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
    request(app(config, {}, userData))
      .post('/login')
      .send('user=swap')
      .expect('set-cookie', /id=/)
      .expect('location', '/guestbook')
      .expect(302, done)
  });

  it('Should redirect on signup page if session is not present', done => {
    const config = {};
    request(app(config))
      .post('/login')
      .send('user=vivek')
      .expect('location', '/signup')
      .expect(302, done)
  });
});

describe('GET /guestbook', () => {
  it('Should show the guestbook', done => {
    const config = {
      comments: [{ name: 'swap', comment: 'hello', timeStamp: 'Thu Jul 07 2022 10:7' }]
    };
    const session = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } }
    request(app(config, session, userData))
      .get('/guestbook')
      .set('cookie', ['id=1'])
      .expect('content-type', 'text/html')
      .expect('content-length', '1026')
      .expect(/hello/)
      .expect(200, done)
  });
});

describe('POST /guestbook', () => {
  it('Should persist new comments', done => {
    const config = {
      comments: [],
      persist: x => x
    }
    request(app(config))
      .post('/guestbook')
      .send('user=swap&comment=hello')
      .expect('content-type', 'Application/json')
      .expect('content-length', '71')
      .expect(200, done)
  });
});