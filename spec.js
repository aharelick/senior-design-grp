var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./app');
  });
  it('responds to /', function testIndex(done) {
    request(server)
        .get('/')
        .expect(302, done);
  });
  it('responds to /login', function testLogin(done) {
    request(server)
        .get('/login')
        .expect(200, done);
  });
  it('responds with a 404', function testNoPath(done) {
    request(server)
        .get('/not-real')
        .expect(404, done);
  });
});