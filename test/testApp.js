const request = require('supertest');
const { app } = require('../src/app.js');

describe('app', () => {
  it('Should give 200 on GET /', (done) => {

    request(app)
      .get('/')
      .expect(200, done)
    // .end(function (err, res) {
    //   if (err) { throw err }
    //   done();
    // })
  });
});