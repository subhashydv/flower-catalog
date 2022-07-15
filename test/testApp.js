const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../src/app.js');

describe('GET /', () => {
  const config = {
    publicDir: 'public'
  }

  it('Should give 200 on GET /', done => {
    const config = {
      publicDir: 'public'
    }
    request(createApp(config))
      .get('/')
      .expect('content-type', 'text/html; charset=UTF-8')
      .expect('content-length', '1037')
      .expect(/<h3 class="heading">Flower Catalog/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /abeliophyllum.html', done => {
    request((req, res) => createApp(config).handle(req, res))
      .get('/abeliophyllum.html')
      .expect('content-type', 'text/html; charset=UTF-8')
      .expect('content-length', '1467')
      .expect(/Abeliophyllum/)
      .expect(200, done)
  });

  it('Should respond with 200 on GET /agerantum.html', done => {
    request((req, res) => createApp(config).handle(req, res))
      .get('/agerantum.html')
      .expect('content-type', 'text/html; charset=UTF-8')
      .expect('content-length', '1292')
      .expect(/Ageratum,/)
      .expect(200, done)
  });
});

describe('GET /login', () => {
  it('Should respond with 200 on GET /login', done => {
    const config = {
      publicDir: 'public'
    };
    request(createApp(config))
      .get('/login')
      .expect('content-type', /html/)
      .expect('')
      .expect(200, done)
  });

  it('Should redirect on guestbook if already logged in', done => {
    const config = { publicDir: 'public' };
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } };

    request(createApp(config, sessions, userData))
      .get('/login')
      .set('cookie', ['id=1'])
      .expect('location', '/guestbook')
      .expect(302, done)
  });
});

describe('POST /login', () => {
  it('Should create session and logged in', done => {
    const config = { publicDir: 'public' };
    const userData = { swap: { user: 'swap' } };
    request(createApp(config, {}, userData))
      .post('/login')
      .send('user=swap')
      .expect('set-cookie', /id=/)
      .expect('location', '/guestbook')
      .expect(302, done)
  });

  it('Should redirect on signup page if session is not present', done => {
    const config = { publicDir: 'public' };
    request(createApp(config))
      .post('/login')
      .send('user=vivek')
      .expect('location', '/signup-page')
      .expect(302, done)
  });
});

describe('GET /guestbook', () => {
  it('Should show the guestbook', done => {
    const config = {
      publicDir: 'public',
      comments: [{ name: 'swap', comment: 'hello', timeStamp: 'Thu Jul 07 2022 10:7' }]
    };
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } }
    request(createApp(config, sessions, userData))
      .get('/guestbook')
      .set('cookie', ['id=1'])
      .expect('content-type', /html/)
      .expect('content-length', '1026')
      .expect(/hello/)
      .expect(200, done)
  });

  it('Should redirect to login page if user is not logged in', done => {
    const config = { publicDir: 'public' };

    request(createApp(config))
      .get('/guestbook')
      .expect(302, done)
  });
});

describe('POST /guestbook', () => {
  it('Should persist new comments', done => {
    const config = {
      publicDir: 'public',
      comments: [],
      persist: x => x
    }
    request(createApp(config))
      .post('/guestbook')
      .send('user=swap&comment=hello')
      .expect('content-type', 'Application/json')
      .expect('content-length', /7[01]/)
      .expect(/{"user":"swap","comment":"hello","timeStamp":/)
      .expect(200, done)
  });
});

describe('GET /logout', () => {
  it('Should logout the user', done => {
    const config = {
      publicDir: 'public'
    }
    const sessions = { '1': { id: 1, user: 'swap' } };
    const userData = { swap: { user: 'swap' } }
    request(createApp(config, sessions, userData))
      .get('/logout')
      .set('cookie', ['id=1'])
      .expect('set-cookie', /id=; Path=.*Expires=/)
      .expect('location', '/')
      .expect(302, done)
  });

  it('Should give 400 if session is not present', done => {
    const config = {
      publicDir: 'public'
    };
    request(createApp(config))
      .get('/logout')
      .expect('Bad request')
      .expect(400, done)
  });
});

describe('GET /signup-page', () => {
  it('Should return signup-page', done => {
    const config = {
      publicDir: 'public'
    };
    request(createApp(config))
      .get('/signup-page')
      .expect('content-length', '276')
      .expect(/action="signup"/)
      .expect(200, done)
  });
});

describe('POST /signup', () => {
  it('Should register new user', done => {
    const config = {
      publicDir: 'public'
    };
    const userData = {};
    request(createApp(config, {}, userData))
      .post('/signup')
      .send('user=vivek')
      .expect(302)
      .end((err, res) => {
        assert.deepStrictEqual(userData, { vivek: { user: 'vivek' } })
        done()
      })
  });
});